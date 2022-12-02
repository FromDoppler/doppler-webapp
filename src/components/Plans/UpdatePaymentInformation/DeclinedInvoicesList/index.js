import { useIntl, FormattedDate, FormattedNumber } from 'react-intl';

const dollarSymbol = 'US$';
const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const DeclinedInvoicesList = ({ declinedInvoices }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <table className="dp-c-table">
      <thead>
        <tr>
          <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.date_column')}</th>
          <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.invoice_column')}</th>
          <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.amount_column')}</th>
          <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.error_column')}</th>
        </tr>
      </thead>
      <tbody>
        {declinedInvoices.map((invoice) => (
          <tr aria-label="invoice" key={invoice.invoiceNumber}>
            <td>
              <FormattedDate value={invoice.date} />
            </td>
            <td>{invoice.invoiceNumber}</td>
            <td>
              {dollarSymbol} <FormattedNumber value={invoice.amount} {...numberFormatOptions} />
            </td>
            <td>{invoice.error}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
