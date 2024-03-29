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
import { PaymentMethodType } from '../../../../doppler-types';
import { getRedirectUrl } from '..';

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

const SuccessfulMessage = ({
  allInvoicesProcessed,
  anyPendingInvoices,
  invoices,
  email,
  paymentMethod,
  isLoggedIn,
}) => {
  return (
    <>
      {anyPendingInvoices === 'true' ? (
        <>
          <div className="col-md-12 col-lg-9 m-b-24 m-t-24p-l-12">
            <p>
              <FormattedMessage
                id="updatePaymentInformationSuccess.payment_pending_message_line1"
                values={{ userEmail: <b>{email}</b> }}
              />
            </p>
          </div>
          <div className="col-md-12 col-lg-9 m-b-24 m-t-24">
            <DeclinedInvoicesList declinedInvoices={invoices.invoices} showError={false} />
          </div>
          <div className="col-md-12 col-lg-9 m-b-24 m-t-24p-l-12">
            <p>
              <FormatMessageWithBoldWords id="updatePaymentInformationSuccess.payment_pending_message_line2" />
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="p-l-12">
            {allInvoicesProcessed === 'true' ? (
              <>
                {isLoggedIn ? (
                  <p>
                    <FormatMessageWithBoldWords id="updatePaymentInformationSuccess.all_invoices_processed_with_active_account_message" />
                  </p>
                ) : (
                  <p>
                    <FormatMessageWithBoldWords id="updatePaymentInformationSuccess.all_invoices_processed_message" />
                  </p>
                )}
                {paymentMethod === PaymentMethodType.transfer && (
                  <>
                    <p>&nbsp;</p>
                    <p>
                      <FormatMessageWithBoldWords id="updatePaymentInformationSuccess.transfer_message" />
                    </p>
                  </>
                )}
              </>
            ) : (
              <FormattedMessage
                id="updatePaymentInformationSuccess.not_all_invoices_processed_message"
                values={{ userEmail: <b>{email}</b> }}
              />
            )}
          </p>
          {allInvoicesProcessed !== 'true' && (
            <>
              <div className="col-md-12 col-lg-9 m-b-24 m-t-24">
                <DeclinedInvoicesList declinedInvoices={invoices.invoices} showError={true} />
              </div>
              <div className="col-md-12 col-lg-9 m-b-24 m-t-24p-l-12">
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
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <>
      <p className="p-l-12">{_('updatePaymentInformationSuccess.rejected_payments_message')}</p>
      <div className="col-md-12 col-lg-9 m-b-24 m-t-24">
        <DeclinedInvoicesList declinedInvoices={declinedInvoices.invoices} showError={true} />
      </div>
      <div className="col-md-12 col-lg-9 m-b-24 m-t-24 m-l-12">
        <div className="dp-rowflex">
          <p>
            <FormatMessageWithBoldWords id="updatePaymentInformationSuccess.rejected_payments_legend_1" />
          </p>
          <p>&nbsp;</p>
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
  ({ dependencies: { dopplerBillingUserApiClient, appSessionRef } }) => {
    const [{ loading, declinedInvoices, paymentMethod, hasError }, dispatch] = useReducer(
      reprocessReducer,
      INITIAL_STATE_REPROCESS,
    );

    const query = useQueryParams();
    const allInvoicesProcessed = query.get('allInvoicesProcessed') ?? 'false';
    const anyPendingInvoices = query.get('anyPendingInvoices') ?? 'false';
    const successful = query.get('success') ?? 'false';
    const from = query.get('from') ?? '';
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
            'failed',
            'clientFailed',
            'doNotHonor',
            'mercadopagoException',
          ]);

          const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();

          dispatch({
            type: REPROCESS_ACTIONS.FINISH_FETCH,
            payload: {
              paymentMethod: paymentMethodData.value.paymentMethodName,
              declinedInvoices: declinedInvoices.value,
            },
          });
        } catch (error) {
          dispatch({ type: REPROCESS_ACTIONS.FAIL_FETCH });
        }
      };

      fetchData();
    }, [dopplerBillingUserApiClient]);

    const redirect = (successful) => {
      if (successful === 'true') {
        window.location.href = getRedirectUrl(from);
      } else {
        navigate('/update-payment-method');
      }
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
              paymentMethod={paymentMethod}
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
                email={appSessionRef.current.email}
                paymentMethod={paymentMethod}
                isLoggedIn={from === 'control-panel'}
              />
            )}
            <div className="p-l-12">
              <hr className="dp-separator" />
            </div>
            <div className="p-l-12">
              <button
                className="dp-button button-medium primary-green m-t-24"
                onClick={() => redirect(successful)}
              >
                {successful === 'true' && from !== 'control-panel'
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
