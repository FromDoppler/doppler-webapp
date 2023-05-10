import React, { useEffect, useReducer } from 'react';
import SafeRedirect from '../../../SafeRedirect';
import { useLinkedinInsightTag } from '../../../../hooks/useLinkedingInsightTag';
import HeaderSection from '../../../shared/HeaderSection/HeaderSection';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { paymentType } from '../PaymentMethod/PaymentMethod';
import { InjectAppServices } from '../../../../services/pure-di';
import { Loading } from '../../../Loading/Loading';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import {
  checkoutSummaryReducer,
  CHECKOUT_SUMMARY_ACTIONS,
  INITIAL_STATE_CHECKOUT_SUMMARY,
} from '../Reducers/checkoutSummaryReducer';
import { exception } from 'react-ga';
import { UnexpectedError } from '../../PlanCalculator/UnexpectedError';
import { thousandSeparatorNumber } from '../../../../utils';
import { TransferInformation } from './TransferInformation/index';
import { CheckoutSummaryButton } from './CheckoutSummaryButton';
import { CheckoutSummaryTitle } from './CheckoutSummaryTitle/index';
import { MercadoPagoInformation } from './MercadoPagoInformation';
import { PLAN_TYPE } from '../../../../doppler-types';

export const FormatMessageWithSpecialStyle = ({ id }) => {
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
  upgradePending,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <nav className="dp-kpi-success">
      <ul className="dp-rowflex">
        <li>
          <span className="dp-icon-kpis">
            <img
              src={_('common.ui_library_image', {
                imageUrl: `${
                  paymentMethod === paymentType.creditCard ||
                  ([paymentType.transfer, paymentType.mercadoPago].includes(paymentMethod) &&
                    !upgradePending)
                    ? 'checkout-success.svg'
                    : 'three-points.svg'
                }`,
              })}
              alt=""
            ></img>
          </span>
        </li>
        <li>
          <span>{_(`checkoutProcessSuccess.plan_type`)}</span>
          <h3>{_(`checkoutProcessSuccess.plan_type_${planType.replace('-', '_')}_label`)}</h3>
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
        <li>
          <span>
            {_(`checkoutProcessSuccess.plan_type_${planType.replace('-', '_')}_availables`)}
          </span>
          <h3>{thousandSeparatorNumber(intl.defaultLocale, remainingCredits)}</h3>
        </li>
        <li>
          {planType === PLAN_TYPE.byContact && discount ? (
            <>
              <span>{_(`checkoutProcessSuccess.renewal_type_title`)}</span>
              <h3>{_('checkoutProcessSuccess.discount_' + discount?.replace('-', '_'))}</h3>
            </>
          ) : planType === PLAN_TYPE.byEmail ? (
            <>
              <span>{_(`checkoutProcessSuccess.renewal_type_title`)}</span>
              <h3>{_(`checkoutProcessSuccess.plan_type_monthly_deliveries_monthly_renovation`)}</h3>
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

export const CheckoutSummary = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, appSessionRef },
    location,
  }) => {
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

    const upgradePending = appSessionRef.current.userData.user.plan.upgradePending;

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
          <CheckoutSummaryTitle paymentMethod={paymentMethod} upgradePending={upgradePending} />
        </HeaderSection>
        <section className="dp-container m-b-24">
          <PlanInformation
            planType={planType}
            quantity={quantity}
            discount={discount}
            paymentMethod={paymentMethod}
            extraCredits={extraCredits}
            remainingCredits={remainingCredits}
            upgradePending={upgradePending}
          />
          {paymentMethod === paymentType.transfer ? (
            <TransferInformation billingCountry={billingCountry} upgradePending={upgradePending} />
          ) : paymentMethod === paymentType.mercadoPago ? (
            <MercadoPagoInformation upgradePending={upgradePending} />
          ) : null}

          <CheckoutSummaryButton paymentMethod={paymentMethod} upgradePending={upgradePending} />
        </section>
      </>
    );
  },
);
