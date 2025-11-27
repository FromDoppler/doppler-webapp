export const getEprotectConfig = (payframeClientCallback, intl) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const locale = intl.locale;
  const style = locale === 'en' ? 'enhancedstyleDB5ENGL' : 'enhancedstyleDB5ESPA';

  return {
    paypageId: process.env.REACT_APP_EPROTECT_PAYPAGE_ID,
    style: style,
    reportGroup: process.env.REACT_APP_EPROTECT_REPORT_GROUP,
    timeout: '5000',
    div: 'eprotect-payframe',
    height: "230",
    callback: payframeClientCallback,
    showCvv: true,
    months: {
      "1": "01",
      "2": "02",
      "3": "03",
      "4": "04",
      "5": "05",
      "6": "06",
      "7": "07",
      "8": "08",
      "9": "09",
      "10": "10",
      "11": "11",
      "12": "12"
    },
    numYears: 15,
    expYearFormat: "YY",
    tabIndex: {
      accountNumber: 1,
      expMonth: 2,
      expYear: 3,
      cvv: 4
    },
    placeholderText: {
      cvv: _('checkoutProcessForm.payment_method.eprotect_placeholder_cvv'),
      accountNumber: _('checkoutProcessForm.payment_method.credit_card'),
    },
    htmlTimeout: "5000",
    clearCvvMaskOnReturn: true,
    enhancedUxFeatures: {
      inlineFieldValidations: true,
      numericInputsOnly: true,
      enhancedUxVersion: 2,
      coloredCardNetworkLogos: true,
      cVVValidation: true,
      expDateValidation: false,
    },
    label: {
      accountNumber: _('checkoutProcessForm.payment_method.credit_card'),
      expDate: _('checkoutProcessForm.payment_method.expiration_date'),
      cvv: _('checkoutProcessForm.payment_method.security_code')
    },
    customErrorMessages: {
      // Invalid account number group (871-876)
      871: _('validation_messages.error_invalid_card_number'),
      872: _('validation_messages.error_invalid_card_number'),
      873: _('validation_messages.error_invalid_card_number'),
      874: _('validation_messages.error_invalid_card_number'),
      875: _('validation_messages.error_invalid_card_number'),
      876: _('validation_messages.error_invalid_card_number'),

      // Generic error group (877-898)
      877: _('checkoutProcessForm.payment_method.error'),
      878: _('checkoutProcessForm.payment_method.error'),
      879: _('checkoutProcessForm.payment_method.error'),
      880: _('checkoutProcessForm.payment_method.error'),
      884: _('checkoutProcessForm.payment_method.error'),
      885: _('checkoutProcessForm.payment_method.error'),
      887: _('checkoutProcessForm.payment_method.error'),
      888: _('checkoutProcessForm.payment_method.error'),
      889: _('checkoutProcessForm.payment_method.error'),
      893: _('checkoutProcessForm.payment_method.error'),
      894: _('checkoutProcessForm.payment_method.error'),
      898: _('checkoutProcessForm.payment_method.error'),

      // Invalid validation number group (881-883)
      881: _('checkoutProcessForm.payment_method.eprotect_error.invalid_validation_number'),
      882: _('checkoutProcessForm.payment_method.eprotect_error.invalid_validation_number'),
      883: _('checkoutProcessForm.payment_method.eprotect_error.invalid_validation_number'),

      // Expiration date invalid group (886*)
      '886-month': _('validation_messages.error_invalid_expiry_date'),
      '886-year': _('validation_messages.error_invalid_expiry_date'),
      886: _('validation_messages.error_invalid_expiry_date')
    },
  };
};
