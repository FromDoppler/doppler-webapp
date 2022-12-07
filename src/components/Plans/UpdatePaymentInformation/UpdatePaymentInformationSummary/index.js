import React, { useEffect, useReducer } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl, FormattedMessage } from 'react-intl';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import HeaderSection from '../../../shared/HeaderSection/HeaderSection';
import { Helmet } from 'react-helmet';
import { UpdatePaymentInformationSummaryTitle } from './UpdatePaymenInformationSummaryTitle';
import {
  INITIAL_STATE_REPROCESS,
  reprocessReducer,
  REPROCESS_ACTIONS,
} from '../Reducers/reprocessReducer';
import { DeclinedInvoicesList } from '../DeclinedInvoicesList/index';
import Footer from '../../../Footer/Footer';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../../Loading/Loading';
import { UnexpectedError } from '../../../shared/UnexpectedError/index';

const FormatMessageWithBoldWords = ({ id }) => {
  return (
    <FormattedMessage
      id={id}
      values={{
        bold: (chunks) => <b>{chunks}</b>,
      }}
    />
  );
};

const SuccessfulMessage = ({ allInvoicesProcessed, anyPendingInvoices, invoices }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <>
      {anyPendingInvoices === 'true' ? (
        <>
          <div className="col-md-12 col-lg-8 m-b-24 m-t-24p-l-12">
            <p>
              <FormatMessageWithBoldWords id="updatePaymentInformationSuccess.payment_pending_message_line1" />
            </p>
          </div>
          <div className="col-md-12 col-lg-8 m-b-24 m-t-24">
            <DeclinedInvoicesList declinedInvoices={invoices.invoices} />
          </div>
          <div className="col-md-12 col-lg-8 m-b-24 m-t-24p-l-12">
            <p>
              <FormatMessageWithBoldWords id="updatePaymentInformationSuccess.payment_pending_message_line2" />
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="p-l-12">
            {allInvoicesProcessed === 'true'
              ? _('updatePaymentInformationSuccess.all_invoices_processed_message')
              : _('updatePaymentInformationSuccess.not_all_invoices_processed_message')}
          </p>
          {allInvoicesProcessed !== 'true' && (
            <>
              <div className="col-md-12 col-lg-8 m-b-24 m-t-24">
                <DeclinedInvoicesList declinedInvoices={invoices.invoices} />
              </div>
              <div className="col-md-12 col-lg-8 m-b-24 m-t-24p-l-12">
                <p>
                  <FormatMessageWithBoldWords id="updatePaymentInformationSuccess.not_all_invoices_processed_legend" />
                </p>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

const FailedMessage = ({ declinedInvoices }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <>
      <p className="p-l-12">{_('updatePaymentInformationSuccess.rejected_payments_message')}</p>
      <div className="col-md-12 col-lg-8 m-b-24 m-t-24">
        <DeclinedInvoicesList declinedInvoices={declinedInvoices.invoices} />
      </div>
      <div className="col-md-12 col-lg-8 m-b-24 m-t-24p-l-12">
        <div className="dp-rowflex">
          <p>
            <button
              className="dp-button link-green"
              onClick={() => navigate('/update-payment-method')}
            >
              {_('updatePaymentInformationSuccess.rejected_payments_legend_1')}
            </button>{' '}
          </p>
          <FormattedMessageMarkdown
            id="updatePaymentInformationSuccess.rejected_payments_legend_2"
            linkTarget={'_blank'}
          />
        </div>
      </div>
    </>
  );
};

export const PaymentInformationSummary = InjectAppServices(
  ({ dependencies: { dopplerBillingUserApiClient } }) => {
    const [{ loading, declinedInvoices, hasError }, dispatch] = useReducer(
      reprocessReducer,
      INITIAL_STATE_REPROCESS,
    );

    const query = useQueryParams();
    const allInvoicesProcessed = query.get('allInvoicesProcessed') ?? 'false';
    const anyPendingInvoices = query.get('anyPendingInvoices') ?? 'false';
    const successful = query.get('success') ?? 'false';
    const intl = useIntl();
    const navigate = useNavigate();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      const fetchData = async () => {
        try {
          dispatch({ type: REPROCESS_ACTIONS.START_FETCH });
          const declinedInvoices = await dopplerBillingUserApiClient.getInvoices([
            'pending',
            'declined',
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

    const redirect = (url) => {
      navigate(url);
    };

    if (loading) {
      return <Loading />;
    }

    if (hasError) {
      return <UnexpectedError />;
    }

    return (
      <>
        <div className="dp-app-container">
          <Helmet>
            <title>{_('updatePaymentInformationSuccess.title')}</title>
            <meta name="checkout-success" />
          </Helmet>
          <HeaderSection>
            <UpdatePaymentInformationSummaryTitle
              allInvoicesProcessed={allInvoicesProcessed}
              successful={successful}
              anyPendingInvoices={anyPendingInvoices}
            />
          </HeaderSection>
          <section className="dp-container m-b-24">
            {successful === 'false' ? (
              <FailedMessage declinedInvoices={declinedInvoices} />
            ) : (
              <SuccessfulMessage
                anyPendingInvoices={anyPendingInvoices}
                allInvoicesProcessed={allInvoicesProcessed}
                invoices={declinedInvoices}
              />
            )}
            <div className="p-l-12">
              <hr className="dp-separator" />
            </div>
            <div className="p-l-12">
              <button
                className="dp-button button-medium primary-green m-t-24"
                onClick={() =>
                  redirect(successful === 'true' ? '/login' : '/update-payment-method')
                }
              >
                {successful === 'true'
                  ? _('updatePaymentInformationSuccess.go_to_login_button')
                  : _('updatePaymentInformationSuccess.back_button')}
              </button>
            </div>
          </section>
          <Footer />
        </div>
      </>
    );
  },
);

export default InjectAppServices(PaymentInformationSummary);
