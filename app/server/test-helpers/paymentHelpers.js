function generateGlobalPaymentsRequestBody(
  amount,
  paymentType,
  debtorDetails,
  creditorDetails,
) {
  const requestBody = {
    requestedExecutionDate: new Date().toISOString().split('T')[0],
    paymentIdentifiers: {
      endToEndId: 'UF' + new Date().getTime(),
    },
    transferType: 'CREDIT',
    value: {
      currency: 'USD',
      amount: amount,
    },
    paymentType: paymentType,
    debtor: debtorDetails.account,
    debtorAgent: debtorDetails.agent,
    creditor: creditorDetails,
  };
  return requestBody;
}

module.exports = {
  generateGlobalPaymentsRequestBody,
};
