import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../../services/pure-di';
import { useIntl, FormattedDate, FormattedNumber, FormattedMessage } from 'react-intl';
import { Loading } from '../../../../Loading/Loading';
import { handleMessage } from '../index';
import { StatusMessage } from '../../../Checkout/PurchaseSummary/PlanPurchase/index';
import useTimeout from '../../../../../hooks/useTimeout';

const dollarSymbol = 'US$';
const HAS_ERROR = 'HAS_ERROR';
const SAVED = 'SAVED';
export const DELAY_BEFORE_REDIRECT_TO_SUMMARY = 3000;

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const DeclinedInvoices = ({ declinedInvoices }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <table className="dp-c-table  m-t-24">
        <thead>
          <tr>
            <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.date_column')}</th>
            <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.invoice_column')}</th>
            <th>{_('updatePaymentMethod.reprocess.invoices_declined_table.amount_column')}</th>
          </tr>
        </thead>
        <tbody>
          {declinedInvoices.map((invoice) => (
            <tr role="row" aria-label="invoice" key={invoice.invoiceNumber}>
              <td>
                <FormattedDate value={invoice.date} />
              </td>
              <td>{invoice.invoiceNumber}</td>
              <td>
                {dollarSymbol} <FormattedNumber value={invoice.amount} {...numberFormatOptions} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export const Reprocess = InjectAppServices(({ dependencies: { dopplerBillingUserApiClient } }) => {
  const intl = useIntl();
  const [state, setState] = useState({ loading: true, declinedInvoices: { invoices: [] } });
  const [status, setStatus] = useState('');
  const [messageError, setMessageError] = useState('');
  const createTimeout = useTimeout();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      const declinedInvoices = await dopplerBillingUserApiClient.getDeclinedInvoices();

      setState({
        declinedInvoices: declinedInvoices.success ? declinedInvoices.value : { invoices: [] },
        loading: false,
      });
    };
    fetchData();
  }, [dopplerBillingUserApiClient]);

  const reprocess = async () => {
    const result = await dopplerBillingUserApiClient.reprocess();

    if (result.success) {
      setStatus(SAVED);

      createTimeout(() => {
        window.location.href = `login`;
      }, DELAY_BEFORE_REDIRECT_TO_SUMMARY);
    } else {
      setMessageError(handleMessage(result.error));
      setStatus(HAS_ERROR);
    }
  };

  const showMessage = [SAVED, HAS_ERROR].includes(status);

  return (
    <>
      {state.loading ? (
        <Loading page />
      ) : (
        <>
          <div role="pending-amount-section" aria-label="pending-ammount">
            {_('updatePaymentMethod.reprocess.pending_amount_message')} {': '} {dollarSymbol}{' '}
            <FormattedNumber value={state.declinedInvoices.totalPending} {...numberFormatOptions} />
          </div>
          <DeclinedInvoices declinedInvoices={state.declinedInvoices.invoices} />
          {showMessage && (
            <StatusMessage
              type={status === SAVED ? 'success' : 'cancel'}
              message={_(
                status === SAVED ? 'updatePaymentMethod.reprocess.success_message' : messageError,
              )}
            />
          )}
          {status !== SAVED && (
            <button
              type="button"
              className="dp-button button-medium primary-green m-t-30"
              onClick={reprocess}
            >
              <FormattedMessage id="updatePaymentMethod.reprocess.payment_now_button" />
            </button>
          )}
        </>
      )}
    </>
  );
});

export default InjectAppServices(Reprocess);
