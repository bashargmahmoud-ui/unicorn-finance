# Payments API Contract Tests

## Overview

This test suite validates the contract between the Unicorn Finance application and the JPMorgan Chase Global Payments API (v2.0.22). Contract tests ensure that request/response structures conform to the OpenAPI specification without requiring actual API calls.

## Test Coverage

### Total Tests: 26 ✅
- **Request Schema Validation**: 9 tests
- **Request Data Type Validation**: 3 tests  
- **Business Rule Validation**: 3 tests
- **API Endpoint Structure**: 3 tests
- **Response Schema Validation**: 6 tests
- **Payment Types Contract**: 2 tests

## Test Categories

### 1. Request Schema Validation (9 tests)

Validates that payment initiation requests include all required fields per the OpenAPI spec:

- ✅ All required fields present: `requestedExecutionDate`, `paymentIdentifiers`, `value`, `transferType`, `paymentType`, `debtor`, `debtorAgent`, `creditor`
- ✅ Date format validation: `YYYY-MM-DD` (ISO 8601)
- ✅ Payment identifiers structure with unique `endToEndId`
- ✅ Value object with currency (ISO 4217) and amount (decimal string)
- ✅ Transfer type validation (CREDIT)
- ✅ Payment type enum validation (RTP, ACH, WIRE, CARD, etc.)
- ✅ Debtor structure with account details
- ✅ Debtor agent with financial institution IDs (BIC, USABA, etc.)
- ✅ Creditor structure with account details

### 2. Request Data Type Validation (3 tests)

Ensures all fields use correct data types per the API contract:

- ✅ `requestedExecutionDate`: string
- ✅ `endToEndId`: string (1-128 characters)
- ✅ `amount`: string (supports decimals)

### 3. Business Rule Validation (3 tests)

Validates business logic constraints:

- ✅ Unique `endToEndId` generation for each payment (prevents duplicates)
- ✅ Decimal amounts support up to 2 decimal places
- ✅ Requested execution date must be current or future date

### 4. API Endpoint Structure (3 tests)

Validates API endpoint configuration:

- ✅ Endpoint path: `/api/digitalSignature/payment/v2/payments`
- ✅ HTTP method: POST
- ✅ Content-Type header: `application/json`

### 5. Response Schema Validation (6 tests)

Validates expected API responses per the OpenAPI spec:

**202 Accepted Response:**
- ✅ Response includes `endToEndId` and `paymentId`
- ✅ `paymentId` follows UUID format pattern
- ✅ `endToEndId` matches request
- ✅ Optional `duplicateRequest` boolean flag

**Error Responses:**
- ✅ 400 Bad Request structure with `httpStatus`, `traceId`, `context` array
- ✅ 422 Unprocessable Entity with error codes, messages, locations

### 6. Payment Types Contract (2 tests)

Validates support for different payment types:

- ✅ RTP (Real-Time Payments)
- ✅ ACH (Automated Clearing House)

## Running the Tests

```bash
# Run contract tests only
cd app/server
yarn test payments-api.contract.test.js

# Run with coverage
yarn test:coverage
```

## Test Structure

```
payments-api.contract.test.js
├── POST /payments - Payment Initiation
│   ├── Request Schema Validation (9 tests)
│   ├── Request Data Type Validation (3 tests)
│   ├── Business Rule Validation (3 tests)
│   └── API Endpoint Structure (3 tests)
├── Response Schema Validation
│   ├── 202 Accepted Response (4 tests)
│   └── Error Response Schemas (2 tests)
└── Payment Types Contract (2 tests)
```

## Key Benefits

### 1. **No External Dependencies**
Contract tests run independently without requiring:
- Live API endpoints
- Network connectivity
- Mock servers
- Test credentials

### 2. **Fast Execution**
All 26 tests execute in ~175ms, enabling rapid feedback during development.

### 3. **Comprehensive Coverage**
Tests validate:
- Request structure conformance
- Data type correctness
- Business rule enforcement
- Response schema expectations
- Error handling contracts

### 4. **API Contract Safety**
Early detection of:
- Schema violations
- Breaking changes
- Type mismatches
- Missing required fields
- Invalid enum values

## OpenAPI Specification Reference

Tests are based on:
- **API**: JPMorgan Chase Global Payments API
- **Version**: 2.0.22
- **Specification**: `app/server/mock-server/specs/global_payments_2_0_22.yaml`
- **Base URL**: `https://api.payments.jpmorgan.com/payment/v2`

## Supported Payment Types

| Payment Type | Description | Tested |
|--------------|-------------|--------|
| RTP | Real-Time Payments | ✅ |
| ACH | Automated Clearing House | ✅ |
| WIRE | Wire Transfers | 📋 |
| CARD | Push to Card | 📋 |
| VENMO | Venmo Payments | 📋 |
| PAYPAL | PayPal Payments | 📋 |
| BLOCKCHAIN | Kinexys Digital Payments | 📋 |
| INTERAC | Interac e-Transfer | 📋 |
| ZELLE | Zelle Payments | 📋 |
| DEFAULT | Other Payment Types | 📋 |

✅ = Covered by tests  
📋 = Supported but not yet tested

## Test Data

### Sample Valid Request

```json
{
  "requestedExecutionDate": "2025-10-17",
  "paymentIdentifiers": {
    "endToEndId": "UF1729161234567"
  },
  "transferType": "CREDIT",
  "value": {
    "currency": "USD",
    "amount": "100.00"
  },
  "paymentType": "RTP",
  "debtor": {
    "name": "RAPID AUDIO LLC",
    "account": {
      "accountNumber": "000000010900009"
    }
  },
  "debtorAgent": {
    "financialInstitutionIds": [{
      "id": "021000021",
      "idType": "USABA"
    }]
  },
  "creditor": {
    "name": "TEST CREDITOR LLC",
    "account": {
      "accountNumber": "987654321"
    }
  }
}
```

### Sample 202 Response

```json
{
  "endToEndId": "UF1729161234567",
  "paymentId": "253f67f3-b640-44cb-aabd-2cc348b52678",
  "duplicateRequest": false
}
```

### Sample Error Response (400)

```json
{
  "httpStatus": 400,
  "traceId": "0eca2e1a-74b7-44b7-9e66-4a6ec8336eb9",
  "context": [{
    "code": "40001",
    "message": "Invalid request format",
    "location": "BODY",
    "field": "$.value.amount"
  }]
}
```

## Implementation Details

### Helper Functions

**Location**: `app/server/test-helpers/paymentHelpers.js`

```javascript
generateGlobalPaymentsRequestBody(amount, paymentType, debtorDetails, creditorDetails)
```

Generates compliant payment request bodies for testing.

### Test Framework

- **Framework**: Jest
- **Configuration**: `jest.config.js`
- **Node Options**: `--experimental-vm-modules` (for ES module support)

## Future Enhancements

1. **Expand Payment Type Coverage**
   - Add contract tests for WIRE, CARD, BLOCKCHAIN
   - Test payment type-specific fields and requirements

2. **Add Query Endpoint Tests**
   - GET /payments (query by endToEndId)
   - GET /payments/{paymentId} (retrieve details)
   - GET /payments/{paymentId}/status (retrieve status)

3. **Test Additional Fields**
   - remittanceInformation
   - paymentPurpose
   - taxInformation
   - regulatoryReporting
   - fxInformation

4. **Error Scenarios**
   - 401 Unauthorized
   - 403 Forbidden
   - 404 Not Found
   - 429 Too Many Requests
   - 503 Service Unavailable

5. **Integration Testing**
   - Test against mock server
   - Validate digital signature generation
   - End-to-end payment flow testing

## Related Documentation

- [Test Coverage Dashboard](../test-coverage-dashboard.html)
- [Digital Signature Tests](./digitalSignature.test.js)
- [OpenAPI Specification](./mock-server/specs/global_payments_2_0_22.yaml)
- [JPMorgan Global Payments API Docs](https://developer.payments.jpmorgan.com)

## Questions & Support

For questions about:
- **API Specification**: Contact JPMorgan Chase API Support
- **Test Implementation**: See [PR #3](https://github.com/bashargmahmoud-ui/unicorn-finance/pull/3)
- **Devin Session**: https://app.devin.ai/sessions/70311d15be844c0b91e05a764bf550ac
