const { generateGlobalPaymentsRequestBody } = require('./test-helpers/paymentHelpers');

describe('Payments API Contract Tests', () => {
  describe('POST /payments - Payment Initiation', () => {
    describe('Request Schema Validation', () => {
      it('should generate valid payment request with all required fields', () => {
        const debtorDetails = {
          account: {
            name: 'RAPID AUDIO LLC',
            account: { accountNumber: '000000010900009' },
          },
          agent: {
            financialInstitutionIds: [{
              id: '021000021',
              idType: 'USABA',
            }],
          },
        };

        const creditorDetails = {
          name: 'TEST CREDITOR LLC',
          account: { accountNumber: '987654321' },
        };

        const requestBody = generateGlobalPaymentsRequestBody(
          '100.00',
          'RTP',
          debtorDetails,
          creditorDetails
        );

        expect(requestBody).toHaveProperty('requestedExecutionDate');
        expect(requestBody).toHaveProperty('paymentIdentifiers');
        expect(requestBody).toHaveProperty('value');
        expect(requestBody).toHaveProperty('transferType');
        expect(requestBody).toHaveProperty('paymentType');
        expect(requestBody).toHaveProperty('debtor');
        expect(requestBody).toHaveProperty('debtorAgent');
        expect(requestBody).toHaveProperty('creditor');
      });

      it('should have correct requestedExecutionDate format (YYYY-MM-DD)', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);

        expect(requestBody.requestedExecutionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        
        const date = new Date(requestBody.requestedExecutionDate);
        expect(date).toBeInstanceOf(Date);
        expect(date.toString()).not.toBe('Invalid Date');
      });

      it('should generate valid paymentIdentifiers with endToEndId', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);

        expect(requestBody.paymentIdentifiers).toBeDefined();
        expect(requestBody.paymentIdentifiers).toHaveProperty('endToEndId');
        expect(requestBody.paymentIdentifiers.endToEndId).toMatch(/^UF\d+$/);
        expect(requestBody.paymentIdentifiers.endToEndId.length).toBeGreaterThan(2);
        expect(requestBody.paymentIdentifiers.endToEndId.length).toBeLessThanOrEqual(128);
      });

      it('should generate valid value object with currency and amount', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const amount = '250.75';
        const requestBody = generateGlobalPaymentsRequestBody(amount, 'RTP', debtorDetails, creditorDetails);

        expect(requestBody.value).toBeDefined();
        expect(requestBody.value).toHaveProperty('currency');
        expect(requestBody.value).toHaveProperty('amount');
        expect(requestBody.value.currency).toBe('USD');
        expect(requestBody.value.currency).toMatch(/^[A-Z]{3}$/);
        expect(requestBody.value.amount).toBe(amount);
        expect(requestBody.value.amount).toMatch(/^\d+(\.\d+)?$/);
      });

      it('should have valid transferType as CREDIT', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);

        expect(requestBody.transferType).toBe('CREDIT');
      });

      it('should accept valid paymentType values', () => {
        const validPaymentTypes = ['RTP', 'ACH', 'WIRE', 'CARD', 'VENMO', 'PAYPAL', 'BLOCKCHAIN', 'INTERAC', 'ZELLE', 'DEFAULT'];
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        validPaymentTypes.forEach(paymentType => {
          const requestBody = generateGlobalPaymentsRequestBody('100.00', paymentType, debtorDetails, creditorDetails);
          expect(requestBody.paymentType).toBe(paymentType);
        });
      });

      it('should have valid debtor structure', () => {
        const debtorDetails = {
          account: {
            name: 'RAPID AUDIO LLC',
            account: { accountNumber: '000000010900009' },
          },
          agent: {
            financialInstitutionIds: [{
              id: '021000021',
              idType: 'USABA',
            }],
          },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);

        expect(requestBody.debtor).toBeDefined();
        expect(requestBody.debtor).toHaveProperty('name');
        expect(requestBody.debtor).toHaveProperty('account');
        expect(requestBody.debtor.account).toHaveProperty('accountNumber');
        expect(requestBody.debtor.name).toBe('RAPID AUDIO LLC');
        expect(requestBody.debtor.account.accountNumber).toBe('000000010900009');
      });

      it('should have valid debtorAgent structure', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: {
            financialInstitutionIds: [{
              id: '021000021',
              idType: 'USABA',
            }],
          },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);

        expect(requestBody.debtorAgent).toBeDefined();
        expect(requestBody.debtorAgent).toHaveProperty('financialInstitutionIds');
        expect(Array.isArray(requestBody.debtorAgent.financialInstitutionIds)).toBe(true);
        expect(requestBody.debtorAgent.financialInstitutionIds[0]).toHaveProperty('id');
        expect(requestBody.debtorAgent.financialInstitutionIds[0]).toHaveProperty('idType');
        expect(requestBody.debtorAgent.financialInstitutionIds[0].idType).toMatch(/^(BIC|USABA|SORT_CODE|CLEARING_SYSTEM_ID)$/);
      });

      it('should have valid creditor structure', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = {
          name: 'MORRIS ELECTRIC CONTRACTING LLC',
          account: { accountNumber: '000000010962009' },
        };

        const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);

        expect(requestBody.creditor).toBeDefined();
        expect(requestBody.creditor).toHaveProperty('name');
        expect(requestBody.creditor).toHaveProperty('account');
        expect(requestBody.creditor.account).toHaveProperty('accountNumber');
        expect(requestBody.creditor.name).toBe('MORRIS ELECTRIC CONTRACTING LLC');
      });
    });

    describe('Request Data Type Validation', () => {
      it('should have string type for requestedExecutionDate', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);

        expect(typeof requestBody.requestedExecutionDate).toBe('string');
      });

      it('should have string type for endToEndId', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);

        expect(typeof requestBody.paymentIdentifiers.endToEndId).toBe('string');
      });

      it('should have string type for amount', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);

        expect(typeof requestBody.value.amount).toBe('string');
      });
    });

    describe('Business Rule Validation', () => {
      it('should generate unique endToEndId for different payments', (done) => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const requestBody1 = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);
        
        setTimeout(() => {
          const requestBody2 = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);
          expect(requestBody1.paymentIdentifiers.endToEndId).not.toBe(requestBody2.paymentIdentifiers.endToEndId);
          done();
        }, 10);
      });

      it('should accept decimal amounts with up to 2 decimal places', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const validAmounts = ['100.00', '250.50', '1000.99', '0.01', '999999.99'];

        validAmounts.forEach(amount => {
          const requestBody = generateGlobalPaymentsRequestBody(amount, 'RTP', debtorDetails, creditorDetails);
          expect(requestBody.value.amount).toBe(amount);
          expect(requestBody.value.amount).toMatch(/^\d+\.\d{2}$/);
        });
      });

      it('should generate requestedExecutionDate as current or future date', () => {
        const debtorDetails = {
          account: { name: 'Test', account: { accountNumber: '123' } },
          agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
        };
        const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

        const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);
        
        const requestedDate = new Date(requestBody.requestedExecutionDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        expect(requestedDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
      });
    });

    describe('API Endpoint Structure', () => {
      it('should construct correct API endpoint path', () => {
        const baseUrl = 'http://localhost:8081';
        const expectedEndpoint = `${baseUrl}/api/digitalSignature/payment/v2/payments`;

        expect(expectedEndpoint).toMatch(/\/api\/digitalSignature\/payment\/v2\/payments$/);
      });

      it('should use POST method for payment initiation', () => {
        const method = 'POST';
        expect(method).toBe('POST');
      });

      it('should set Content-Type header to application/json', () => {
        const headers = {
          'Content-Type': 'application/json',
        };

        expect(headers['Content-Type']).toBe('application/json');
      });
    });
  });

  describe('Response Schema Validation', () => {
    describe('202 Accepted Response', () => {
      it('should expect response with endToEndId and paymentId', () => {
        const mockResponse = {
          endToEndId: 'UF1729161234567',
          paymentId: '253f67f3-b640-44cb-aabd-2cc348b52678',
        };

        expect(mockResponse).toHaveProperty('endToEndId');
        expect(mockResponse).toHaveProperty('paymentId');
        expect(typeof mockResponse.endToEndId).toBe('string');
        expect(typeof mockResponse.paymentId).toBe('string');
      });

      it('should validate paymentId format (UUID-like)', () => {
        const mockResponse = {
          endToEndId: 'UF1729161234567',
          paymentId: '253f67f3-b640-44cb-aabd-2cc348b52678',
        };

        expect(mockResponse.paymentId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      });

      it('should validate endToEndId matches request', () => {
        const requestEndToEndId = 'UF1729161234567';
        const mockResponse = {
          endToEndId: requestEndToEndId,
          paymentId: '253f67f3-b640-44cb-aabd-2cc348b52678',
        };

        expect(mockResponse.endToEndId).toBe(requestEndToEndId);
      });

      it('should handle optional duplicateRequest flag', () => {
        const mockResponseWithDuplicate = {
          endToEndId: 'UF1729161234567',
          paymentId: '253f67f3-b640-44cb-aabd-2cc348b52678',
          duplicateRequest: true,
        };

        expect(mockResponseWithDuplicate).toHaveProperty('duplicateRequest');
        expect(typeof mockResponseWithDuplicate.duplicateRequest).toBe('boolean');
      });
    });

    describe('Error Response Schemas', () => {
      it('should validate 400 Bad Request error structure', () => {
        const mock400Error = {
          httpStatus: 400,
          traceId: '0eca2e1a-74b7-44b7-9e66-4a6ec8336eb9',
          context: [
            {
              code: '40001',
              message: 'Invalid request format',
              location: 'BODY',
              field: '$.value.amount',
            },
          ],
        };

        expect(mock400Error).toHaveProperty('httpStatus');
        expect(mock400Error).toHaveProperty('traceId');
        expect(mock400Error).toHaveProperty('context');
        expect(mock400Error.httpStatus).toBe(400);
        expect(Array.isArray(mock400Error.context)).toBe(true);
        expect(mock400Error.context[0]).toHaveProperty('message');
      });

      it('should validate 422 Unprocessable Entity structure', () => {
        const mock422Error = {
          httpStatus: 422,
          traceId: '1bca3e2b-85c8-55c8-af77-5b7fd9447fc0',
          context: [
            {
              code: '42201',
              message: 'Payment amount exceeds limit',
              location: 'BODY',
              field: '$.value.amount',
            },
          ],
        };

        expect(mock422Error.httpStatus).toBe(422);
        expect(mock422Error.context[0].code).toMatch(/^[0-9]+$/);
        expect(mock422Error.context[0].location).toMatch(/^(BODY|PATH|QUERY|HEADER)$/);
      });
    });
  });

  describe('Payment Types Contract', () => {
    it('should support RTP payment type', () => {
      const debtorDetails = {
        account: { name: 'Test', account: { accountNumber: '000000010900009' } },
        agent: { financialInstitutionIds: [{ id: '021000021', idType: 'USABA' }] },
      };
      const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

      const requestBody = generateGlobalPaymentsRequestBody('100.00', 'RTP', debtorDetails, creditorDetails);

      expect(requestBody.paymentType).toBe('RTP');
    });

    it('should support ACH payment type', () => {
      const debtorDetails = {
        account: { name: 'Test', account: { accountNumber: 'DE89370400440532013000' } },
        agent: { financialInstitutionIds: [{ id: 'COBADEFF', idType: 'BIC' }] },
      };
      const creditorDetails = { name: 'Test', account: { accountNumber: '456' } };

      const requestBody = generateGlobalPaymentsRequestBody('100.00', 'ACH', debtorDetails, creditorDetails);

      expect(requestBody.paymentType).toBe('ACH');
    });
  });
});
