export const TRANSFER_BANKING_DETAILS_BY_COUNTRY = {
  ar: {
    account: '090/408227/0',
    alias: 'BISIDE',
    bank: 'BBVA BANCO FRANCES S.A.',
    cbu: '0170090920000040822703',
    cuit: '30-7119594-1',
    holder: 'Biside SRL',
  },
  co: {
    account: '090/408227/0',
    alias: 'BISIDE',
    bank: 'BBVA BANCO FRANCES S.A.',
    cbu: '0170090920000040822703',
    cuit: '30-7119594-1',
    holder: 'Biside SRL',
  },
  mx: {
    account: '090/408227/0',
    alias: 'BISIDE',
    bank: 'BBVA BANCO FRANCES S.A.',
    cbu: '0170090920000040822703',
    cuit: '30-7119594-1',
    holder: 'Biside SRL',
  },
};

export const getTransferBankingDetails = (billingCountry) =>
  TRANSFER_BANKING_DETAILS_BY_COUNTRY[billingCountry] ?? TRANSFER_BANKING_DETAILS_BY_COUNTRY.ar;
