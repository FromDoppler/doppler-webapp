import { useIntl, FormattedDate, FormattedNumber } from 'react-intl';
import { FirstDataError, MercadoPagoError } from '../../.././../doppler-types';

const dollarSymbol = 'US$';
const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const translateCreditCardError = (creditCardError) => {
  switch (creditCardError) {
    case FirstDataError.invalidExpirationDate:
    case MercadoPagoError.invalidExpirationDate:
      return 'updatePaymentInformationSuccess.credit_card_error.invalid_expiration_date';
    case FirstDataError.invalidCreditCardNumber:
    case FirstDataError.invalidCCNumber:
      return 'updatePaymentInformationSuccess.credit_card_error.invalid_credit_card_number';
    case FirstDataError.declined:
    case FirstDataError.doNotHonorDeclined:
    case MercadoPagoError.declinedOtherReason:
      return 'cupdatePaymentInformationSuccess.credit_card_error.declined';
    case FirstDataError.suspectedFraud:
    case MercadoPagoError.suspectedFraud:
      return 'updatePaymentInformationSuccess.credit_card_error.suspected_fraud';
    case FirstDataError.insufficientFunds:
    case MercadoPagoError.insufficientFunds:
      return 'updatePaymentInformationSuccess.credit_card_error.insufficient_funds';
    case FirstDataError.cardVolumeExceeded:
      return 'updatePaymentInformationSuccess.credit_card_error.card_volume_exceeded';
    case MercadoPagoError.invalidSecurityCode:
      return 'updatePaymentInformationSuccess.credit_card_error.invalid_security_code';
    case MercadoPagoError.pending:
      return 'updatePaymentInformationSuccess.credit_card_error.pending';
    default:
      return 'updatePaymentInformationSuccess.credit_card_error.default';
  }
};

export const DeclinedInvoicesList = ({ declinedInvoices, showError }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <table className="dp-c-table">
      <thead>
        <tr>
          <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.date_column')}</th>
          <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.invoice_column')}</th>
          {showError && (
            <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.error_column')}</th>
          )}
          <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.amount_column')}</th>
        </tr>
      </thead>
      <tbody>
        {declinedInvoices.map((invoice) => (
          <tr aria-label="invoice" key={invoice.invoiceNumber}>
            <td>
              <FormattedDate value={invoice.date} />
            </td>
            <td>{invoice.invoiceNumber}</td>
            {showError && <td>{_(translateCreditCardError(invoice.error))}</td>}
            <td>
              {dollarSymbol} <FormattedNumber value={invoice.amount} {...numberFormatOptions} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
