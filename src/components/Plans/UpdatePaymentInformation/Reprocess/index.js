import React, { useEffect, useReducer } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl, FormattedDate, FormattedNumber, FormattedMessage } from 'react-intl';
import { Loading } from '../../../Loading/Loading';
import {
  INITIAL_STATE_REPROCESS,
  reprocessReducer,
  REPROCESS_ACTIONS,
} from '../Reducers/reprocessReducer';
import { UnexpectedError } from '../../../shared/UnexpectedError/index';

const dollarSymbol = 'US$';

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

export const Reprocess = InjectAppServices(
  ({ dependencies: { dopplerBillingUserApiClient }, handleSaveAndContinue }) => {
    const [{ loading, declinedInvoices, hasError }, dispatch] = useReducer(
      reprocessReducer,
      INITIAL_STATE_REPROCESS,
    );

    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      const fetchData = async () => {
        try {
          dispatch({ type: REPROCESS_ACTIONS.START_FETCH });
          const declinedInvoices = await dopplerBillingUserApiClient.getInvoices([
            'declined',
            'failed',
          ]);

          dispatch({
            type: REPROCESS_ACTIONS.FINISH_FETCH,
            payload: {
              declinedInvoices: declinedInvoices.value,
            },
          });
        } catch (error) {
          dispatch({ type: REPROCESS_ACTIONS.FAIL_FETCH });
        }
      };

      fetchData();
    }, [dopplerBillingUserApiClient]);

    const reprocess = async () => {
      handleSaveAndContinue();
    };

    if (loading) {
      return <Loading />;
    }

    if (hasError) {
      return <UnexpectedError />;
    }

    return (
      <>
        <DeclinedInvoices declinedInvoices={declinedInvoices.invoices} showError={false} />
        <div role="alert" aria-label="pending-ammount" className="p-t-24 p-b-24">
          <b>
            {_('updatePaymentMethod.reprocess.pending_amount_message')} {': '} {dollarSymbol}{' '}
            <FormattedNumber value={declinedInvoices.totalPending} {...numberFormatOptions} />
          </b>
        </div>
        <button
          type="button"
          className="dp-button button-medium primary-green m-t-30"
          onClick={reprocess}
        >
          <FormattedMessage id="updatePaymentMethod.reprocess.payment_now_button" />
        </button>
      </>
    );
  },
);

export default InjectAppServices(Reprocess);
