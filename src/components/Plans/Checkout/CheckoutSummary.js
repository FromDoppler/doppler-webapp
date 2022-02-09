import React, { useEffect, useReducer } from 'react';
import SafeRedirect from '../../SafeRedirect';
import { useLinkedinInsightTag } from '../../../hooks/useLinkedingInsightTag';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { paymentType } from './PaymentMethod/PaymentMethod';
import { PLAN_TYPE } from '../../../doppler-types';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { useQueryParams } from '../../../hooks/useQueryParams';
import {
  checkoutSummaryReducer,
  CHECKOUT_SUMMARY_ACTIONS,
  INITIAL_STATE_CHECKOUT_SUMMARY,
} from './Reducers/checkoutSummaryReducer';
import { exception } from 'react-ga';
import { UnexpectedError } from '../PlanCalculator/UnexpectedError';
import { thousandSeparatorNumber } from '../../../utils';

const arCountry = 'ar';

const FormatMessageWithSpecialStyle = ({ id }) => {
  return (
    <FormattedMessage
      id={id}
      values={{
        underline: (chunks) => <u>{chunks}</u>,
        bold: (chunks) => <b>{chunks}</b>,
      }}
    />
  );
};

const PlanInformation = ({
  planType,
  quantity,
  discount,
  paymentMethod,
  extraCredits,
  remainingCredits,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <nav className="dp-kpi-success">
      <ul className="dp-rowflex">
        <li>
          <img
            src={_('common.ui_library_image', {
              imageUrl: `${
                paymentMethod === paymentType.creditCard ? 'checkout-success.svg' : 'on-hold.svg'
              }`,
            })}
            alt=""
          ></img>
        </li>
        <li>
          <span>{_(`checkoutProcessSuccess.plan_type_${planType.replace('-', '_')}`)}</span>
          <h3>{thousandSeparatorNumber(intl.defaultLocale, quantity)}</h3>
        </li>
        {extraCredits > 0 ? (
          <li>
            <span>{_(`checkoutProcessSuccess.plan_type_prepaid_promocode`)}</span>
            <h3>{thousandSeparatorNumber(intl.defaultLocale, extraCredits)}</h3>
          </li>
        ) : null}
        {planType === PLAN_TYPE.byCredit ? (
          <li>
            <span>{_(`checkoutProcessSuccess.plan_type_prepaid_total`)}</span>
            <h3>{thousandSeparatorNumber(intl.defaultLocale, remainingCredits)}</h3>
          </li>
        ) : null}
        <li>
          {discount ? (
            <>
              <span>{_(`checkoutProcessSuccess.renewal_type_title`)}</span>
              <h3>{_('checkoutProcessSuccess.discount_' + discount?.replace('-', '_'))}</h3>
            </>
          ) : (
            <h3 className="m-t-36">
              {_(`checkoutProcessSuccess.plan_type_prepaid_no_expiration`)}
            </h3>
          )}
        </li>
      </ul>
    </nav>
  );
};

const TransferInformation = ({ billingCountry }) => {
  return (
    <>
      <div className="dp-wrap-message dp-wrap-warning m-t-24">
        <span className="dp-message-icon"></span>
        <div className="dp-content-message">
          <p>
            <FormatMessageWithSpecialStyle
              id={'checkoutProcessSuccess.flashcard_transfer_message'}
            ></FormatMessageWithSpecialStyle>
          </p>
        </div>
      </div>
      <div className="dp-kpi-success">
        <p>
          <FormatMessageWithSpecialStyle
            id={'checkoutProcessSuccess.flashcard_transfer_note_1'}
          ></FormatMessageWithSpecialStyle>
        </p>
        {arCountry === billingCountry ? (
          <p>
            <FormatMessageWithSpecialStyle
              id={'checkoutProcessSuccess.flashcard_transfer_note_2'}
            ></FormatMessageWithSpecialStyle>
          </p>
        ) : null}
        <p>
          {
            <FormatMessageWithSpecialStyle
              id={`checkoutProcessSuccess.flashcard_transfer_note_3${
                arCountry === billingCountry ? '_ar' : ''
              }`}
            ></FormatMessageWithSpecialStyle>
          }
        </p>
      </div>
    </>
  );
};

const MercadoPagoInformation = () => {
  return (
    <div className="dp-wrap-message dp-wrap-warning m-t-24">
      <span className="dp-message-icon"></span>
      <div className="dp-content-message">
        <p>
          <FormatMessageWithSpecialStyle
            id={'checkoutProcessSuccess.flashcard_mercadopago_message'}
          ></FormatMessageWithSpecialStyle>
        </p>
      </div>
    </div>
  );
};

export const CheckoutSummary = InjectAppServices(
  ({ dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient }, location }) => {
    useLinkedinInsightTag();
    const [
      {
        loading,
        billingCountry,
        paymentMethod,
        planType,
        discount,
        quantity,
        extraCredits,
        remainingCredits,
        hasError,
      },
      dispatch,
    ] = useReducer(checkoutSummaryReducer, INITIAL_STATE_CHECKOUT_SUMMARY);

    const query = useQueryParams();
    const redirect = query.get('redirect');
    const legacy = query.get('legacy');
    const planId = query.get('planId') ?? '';
    const paymentMethodType = query.get('paymentMethod') ?? '';
    const discountDescription = query.get('discount') ?? '';
    const extraCreditsByPromocode = query.get('extraCredits') ?? 0;
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      const fetchBillingInformationData = async () => {
        const data = await dopplerBillingUserApiClient.getBillingInformationData();
        if (data.success) {
          return data;
        } else {
          throw new exception();
        }
      };

      const fetchCurrentUserPlan = async () => {
        const data = await dopplerBillingUserApiClient.getCurrentUserPlanData();
        if (data.success) {
          return data;
        } else {
          throw new exception();
        }
      };

      const fetchData = async () => {
        try {
          dispatch({ type: CHECKOUT_SUMMARY_ACTIONS.START_FETCH });
          const billingInformationData = await fetchBillingInformationData();
          const currentUserPlanData = await fetchCurrentUserPlan();

          dispatch({
            type: CHECKOUT_SUMMARY_ACTIONS.FINISH_FETCH,
            payload: {
              billingInformation: billingInformationData.value,
              currentUserPlan: currentUserPlanData.value,
              extraCredits: extraCreditsByPromocode,
              discount: discountDescription,
              paymentMethod: paymentMethodType,
            },
          });
        } catch (error) {
          dispatch({ type: CHECKOUT_SUMMARY_ACTIONS.FAIL_FETCH });
        }
      };

      fetchData();
    }, [
      dopplerBillingUserApiClient,
      dopplerAccountPlansApiClient,
      extraCreditsByPromocode,
      discountDescription,
      paymentMethodType,
      planId,
    ]);

    if (legacy) {
      if (redirect) {
        return <SafeRedirect to={`/${redirect}`} />;
      }
      return <SafeRedirect to="/Campaigns/Draft" />;
    }

    if (loading) {
      return <Loading />;
    }

    if (hasError) {
      return <UnexpectedError />;
    }

    return (
      <>
        <Helmet>
          <title>{_('checkoutProcessSuccess.purchase_finished_title')}</title>
          <meta name="checkout-success" />
        </Helmet>
        <HeaderSection>
          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <nav className="dp-breadcrumb">
                  <ul>
                    <li>
                      <span className="dp-uppercase">
                        {_('checkoutProcessSuccess.purchase_finished_title')}
                      </span>
                    </li>
                  </ul>
                </nav>
                <h1>{_('checkoutProcessSuccess.title')}</h1>
              </div>
            </div>
          </section>
        </HeaderSection>
        <section className="dp-container m-b-24">
          <PlanInformation
            planType={planType}
            quantity={quantity}
            discount={discount}
            paymentMethod={paymentMethod}
            extraCredits={extraCredits}
            remainingCredits={remainingCredits}
          />
          {paymentMethod === paymentType.transfer ? (
            <TransferInformation billingCountry={billingCountry} />
          ) : paymentMethod === paymentType.mercadoPago ? (
            <MercadoPagoInformation />
          ) : null}
          <a href={'/dashboard'} className="dp-button button-medium primary-green m-t-24">
            {_('checkoutProcessSuccess.start_using_new_plan_button')}
          </a>
        </section>
      </>
    );
  },
);
