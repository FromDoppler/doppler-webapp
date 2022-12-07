import React, { useEffect, useState, useReducer } from 'react';
import { InjectAppServices } from '../../../../../services/pure-di';
import { useIntl, FormattedDate, FormattedNumber, FormattedMessage } from 'react-intl';
import { Loading } from '../../../../Loading/Loading';
import { handleMessage } from '../index';
import { StatusMessage } from '../../../Checkout/PurchaseSummary/PlanPurchase/index';
import useTimeout from '../../../../../hooks/useTimeout';
import {
  INITIAL_STATE_REPROCESS,
  reprocessReducer,
  REPROCESS_ACTIONS,
} from '../../Reducers/reprocessReducer';
import { UnexpectedError } from '../../../../shared/UnexpectedError/index';
import { useNavigate } from 'react-router-dom';

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
  const [{ loading, declinedInvoices, hasError }, dispatch] = useReducer(
    reprocessReducer,
    INITIAL_STATE_REPROCESS,
  );

  const intl = useIntl();
  const [status, setStatus] = useState('');
  const [messageError, setMessageError] = useState('');
  const createTimeout = useTimeout();
  const navigate = useNavigate();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: REPROCESS_ACTIONS.START_FETCH });
        const declinedInvoices = await dopplerBillingUserApiClient.getInvoices(['declined']);

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
    const result = await dopplerBillingUserApiClient.reprocess();

    if (result.success) {
      setStatus(SAVED);

      createTimeout(() => {
        navigate(
          `/payment-information-summary?allInvoicesProcessed=${result.value.allInvoicesProcessed}&success=${result.success}&anyPendingInvoices=${result.value.anyPendingInvoices}`,
        );
      }, DELAY_BEFORE_REDIRECT_TO_SUMMARY);
    } else {
      setMessageError(handleMessage(result.error));
      setStatus(HAS_ERROR);
    }
  };

  const showMessage = [SAVED, HAS_ERROR].includes(status);

  if (loading) {
    return <Loading />;
  }

  if (hasError) {
    return <UnexpectedError />;
  }

  return (
    <>
      <div role="alert" aria-label="pending-ammount">
        {_('updatePaymentMethod.reprocess.pending_amount_message')} {': '} {dollarSymbol}{' '}
        <FormattedNumber value={declinedInvoices.totalPending} {...numberFormatOptions} />
      </div>
      <DeclinedInvoices declinedInvoices={declinedInvoices.invoices} />
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
  );
});

export default InjectAppServices(Reprocess);
