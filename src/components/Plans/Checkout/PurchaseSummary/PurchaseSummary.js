import React, { useEffect, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { PLAN_TYPE } from '../../../../doppler-types';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { InjectAppServices } from '../../../../services/pure-di';
import { thousandSeparatorNumber } from '../../../../utils';
import { Loading } from '../../../Loading/Loading';
import { paymentType } from '../PaymentMethod/PaymentMethod';
import { PlanPurchase } from './PlanPurchase';
import { Promocode } from './Promocode';
import styled from 'styled-components';

const TaxesExclude = styled.span`
  margin-top: 0 !important;
`;

const dollarSymbol = 'US$';
const none = 'NONE';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const PlanInformation = ({ plan, planType, discount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const monthsCount = discount ? discount.monthsAmmount : 1;
  const amount = discount ? plan?.fee * monthsCount : plan?.fee;

  const getQuantity = () => {
    switch (planType) {
      case PLAN_TYPE.byCredit:
        return plan?.emailQty;
      case PLAN_TYPE.byContact:
        return plan?.subscribersQty;
      case PLAN_TYPE.byEmail:
        return plan?.emailQty;
      default:
        return 0;
    }
  };

  return (
    <>
      <li aria-label="units">
        <span>
          {_(`checkoutProcessForm.purchase_summary.plan_type_${planType.replace('-', '_')}_label`)}
          <strong> {thousandSeparatorNumber(intl.defaultLocale, getQuantity())}</strong>
        </span>
        <span>
          {dollarSymbol} <FormattedNumber value={plan?.fee} {...numberFormatOptions} />
        </span>
      </li>
      {planType === PLAN_TYPE.byContact && (
        <>
          <li>
            <span>
              {_(`checkoutProcessForm.purchase_summary.months_to_hire`)}{' '}
              <strong>
                <FormattedMessage
                  id="checkoutProcessForm.purchase_summary.month_with_plural"
                  values={{ monthsCount: monthsCount }}
                ></FormattedMessage>
              </strong>
            </span>
            <span>
              {dollarSymbol} <FormattedNumber value={amount} {...numberFormatOptions} />
            </span>
          </li>
          <br></br>
        </>
      )}
    </>
  );
};

export const MonthsToPayInformation = ({ plan, discount, monthsToPay, planType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const monthsCount = monthsToPay ? monthsToPay : discount ? discount.monthsAmmount : 1;
  const amount = discount ? plan?.fee * monthsCount : plan?.fee;

  return (
    <>
      <span>
        {planType !== PLAN_TYPE.byContact
          ? _(`checkoutProcessForm.purchase_summary.months_to_pay`)
          : _(`checkoutProcessForm.purchase_summary.difference_months_to_pay`)}{' '}
        <strong>
          <FormattedMessage
            id="checkoutProcessForm.purchase_summary.month_with_plural"
            values={{ monthsCount: monthsCount }}
          ></FormattedMessage>
        </strong>
      </span>
      <span>
        {dollarSymbol} <FormattedNumber value={amount} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const DiscountPrice = ({ discountPrepayment }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span>
        {_(`checkoutProcessForm.purchase_summary.discount_for_prepayment`)}{' '}
        <strong>- {discountPrepayment.discountPercentage}%</strong>
      </span>
      <span>
        -{dollarSymbol}{' '}
        <FormattedNumber value={discountPrepayment.amount} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const DiscountPaymentPaid = ({ discountPaymentAlreadyPaid }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span>{_(`checkoutProcessForm.purchase_summary.discount_for_payment_paid`)}</span>
      <span>
        -{dollarSymbol}{' '}
        <FormattedNumber value={discountPaymentAlreadyPaid} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const DiscountPromocode = ({ discountPromocode }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span>
        {_(`checkoutProcessForm.purchase_summary.discount_for_promocode`)}{' '}
        <strong>- {discountPromocode.discountPercentage}%</strong>
      </span>
      <span>
        -{dollarSymbol}{' '}
        <FormattedNumber value={discountPromocode.amount} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const DiscountPlanFeeAdmin = ({ discountPlanFeeAdmin }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span>
        {_(`checkoutProcessForm.purchase_summary.discount_for_admin`)}{' '}
        <strong>- {discountPlanFeeAdmin.discountPercentage}%</strong>
      </span>
      <span>
        -{dollarSymbol}{' '}
        <FormattedNumber value={discountPlanFeeAdmin.amount} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const CreditsPromocode = ({ extraCredits }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span>
        {_(`checkoutProcessForm.purchase_summary.credits_for_promocode`)}{' '}
        <strong>{thousandSeparatorNumber(intl.defaultLocale, extraCredits)}</strong>
      </span>
      <span>
        {dollarSymbol} <FormattedNumber value={0} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const InvoiceInformation = ({
  priceToPay,
  paymentMethodType,
  planType,
  isFree,
  currentPriceToPay,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const isTransfer = paymentMethodType === paymentType.transfer;

  const getTaxesLegend = (paymentMethodType, planType) => {
    switch (planType) {
      case PLAN_TYPE.byCredit:
        return paymentMethodType === paymentType.creditCard
          ? ''
          : `*${_('checkoutProcessForm.purchase_summary.explanatory_legend_by_credits')}`;
      case PLAN_TYPE.byContact:
      case PLAN_TYPE.byEmail:
        return paymentMethodType === paymentType.creditCard ? (
          <div>
            {!isFree && currentPriceToPay === 0 && (
              <div>{`${_('checkoutProcessForm.purchase_summary.upgrade_plan_legend')}`}</div>
            )}
            <div className="m-t-12">
              {`*${_('checkoutProcessForm.purchase_summary.explanatory_legend')}`}
            </div>
          </div>
        ) : (
          <div>
            {`*${_('checkoutProcessForm.purchase_summary.transfer_explanatory_legend')}`}
            {!isFree && currentPriceToPay === 0 && (
              <div className="m-t-12">
                {`${_('checkoutProcessForm.purchase_summary.upgrade_plan_legend')}`}
              </div>
            )}
            <div className="m-t-12">
              {`${_('checkoutProcessForm.purchase_summary.transfer_explanatory_legend2')}`}
            </div>
          </div>
        );
      default:
        return '';
    }
  };

  return (
    <>
      {planType === PLAN_TYPE.byContact || planType === PLAN_TYPE.byEmail ? (
        priceToPay > 0 ? (
          <li>
            <h3 className="m-t-24">
              {`${_('checkoutProcessForm.purchase_summary.your_next_billing_legend')}`}{' '}
              {dollarSymbol} <FormattedNumber value={priceToPay} {...numberFormatOptions} />
              {isTransfer && '*'}
            </h3>
          </li>
        ) : (
          <li>
            <h3 className="m-t-24">{`${_(
              'checkoutProcessForm.purchase_summary.to_pay_from_next_month_legend',
            )}`}</h3>
          </li>
        )
      ) : null}
      <li>
        <div className="dp-renewal">{getTaxesLegend(paymentMethodType, planType)}</div>
      </li>
    </>
  );
};

export const TotalPurchase = ({ totalPlan, priceToPay, state, isFree, currentMonthTotal = 0 }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const isTransfer = state.paymentMethodType === paymentType.transfer;

  return (
    <div className="dp-total-purchase">
      <ul>
        <li>
          <span>{_(`checkoutProcessForm.purchase_summary.total`)}</span>
          <span>
            {' '}
            <span className="dp-money">{dollarSymbol} </span>
            <FormattedNumber value={currentMonthTotal} {...numberFormatOptions} />
            {isTransfer && '*'}
          </span>
        </li>
        {isTransfer && (
          <li>
            <TaxesExclude className="dp-renewal">
              {_(`checkoutProcessForm.purchase_summary.taxes_excluded`)}
            </TaxesExclude>
          </li>
        )}
        <InvoiceInformation
          planType={state.planType}
          priceToPay={totalPlan}
          paymentMethodType={state.paymentMethodType}
          isFree={isFree}
          currentPriceToPay={currentMonthTotal}
        />
      </ul>
    </div>
  );
};

export const ShoppingList = ({ state, planType, promotion }) => {
  const { plan, discount } = state;
  const {
    discountPrepayment,
    discountPaymentAlreadyPaid,
    discountPromocode,
    discountPlanFeeAdmin,
  } = state.amountDetails;

  const extraCredits = promotion?.extraCredits ?? discountPromocode?.extraCredits;
  return (
    <ul className="dp-summary-list">
      <PlanInformation plan={plan} planType={planType} discount={discount} />
      {extraCredits > 0 && (
        <li>
          <CreditsPromocode extraCredits={extraCredits} />
        </li>
      )}
      {planType === PLAN_TYPE.byContact || planType === PLAN_TYPE.byEmail ? (
        <li aria-label="months to pay">
          <MonthsToPayInformation
            discount={discount}
            plan={plan}
            planType={planType}
            monthsToPay={discountPrepayment.monthsToPay}
          />
        </li>
      ) : null}
      {discountPrepayment?.discountPercentage > 0 && (
        <li aria-label="discount">
          <DiscountPrice discountPrepayment={discountPrepayment} plan={plan} />
        </li>
      )}
      {discountPaymentAlreadyPaid > 0 && (
        <li>
          <DiscountPaymentPaid discountPaymentAlreadyPaid={discountPaymentAlreadyPaid} />
        </li>
      )}
      {discountPromocode?.discountPercentage > 0 && (
        <li>
          <DiscountPromocode discountPromocode={discountPromocode} />
        </li>
      )}
      {discountPlanFeeAdmin?.discountPercentage > 0 && (
        <li>
          <DiscountPlanFeeAdmin discountPlanFeeAdmin={discountPlanFeeAdmin} />
        </li>
      )}
    </ul>
  );
};

export const PurchaseSummary = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, appSessionRef },
    discountId,
    monthPlan,
    paymentMethod,
    canBuy,
    onApplyPromocode,
  }) => {
    const [state, setState] = useState({
      loadingPaymentInformation: true,
      loadingPlanInformation: true,
      loadingPromocodeValidation: true,
      planData: {},
      amountDetails: { total: 0, discountPrepayment: { discountPercentage: 0 } },
      plan: { fee: 0 },
      discount: { discountPercentage: 0, monthsAmmount: 1 },
    });
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { planType } = useParams();
    const query = useQueryParams();
    const selectedDiscountId = discountId === 0 ? query.get('discountId') ?? 0 : discountId;
    const selectedPlan = query.get('selected-plan') ?? 0;
    const selectedPromocode = query.get('PromoCode') ?? '';
    const selectedMonthPlan = monthPlan === '0' ? query.get('monthPlan') : monthPlan;
    const isFree = appSessionRef.current.userData.user.plan.isFreeAccount;

    useEffect(() => {
      const fetchData = async () => {
        let paymentMethodType = paymentMethod;

        if (!paymentMethod) {
          const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();
          paymentMethodType = paymentMethodData.success
            ? paymentMethodData.value.paymentMethodName !== none
              ? paymentMethodData.value.paymentMethodName
              : paymentType.creditCard
            : paymentType.creditCard;
        }

        const discountsData = await dopplerAccountPlansApiClient.getDiscountsData(
          selectedPlan,
          paymentMethodType,
        );

        const discount = discountsData.success
          ? discountsData.value.find((d) => d.monthsAmmount.toString() === selectedMonthPlan)
          : undefined;

        const amountDetailsData = await dopplerAccountPlansApiClient.getPlanAmountDetailsData(
          selectedPlan,
          discount ? discount.id : discountsData.value[0] ? discountsData.value[0].id : 0,
          selectedPromocode,
        );

        setState((prevState) => ({
          ...prevState,
          loadingPaymentInformation: false,
          paymentMethodType,
          discount: discount ?? discountsData.value[0],
          amountDetails: amountDetailsData.success ? amountDetailsData.value : { total: 0 },
          planType,
        }));
      };

      fetchData();
    }, [
      dopplerAccountPlansApiClient,
      dopplerBillingUserApiClient,
      selectedDiscountId,
      selectedPlan,
      paymentMethod,
      planType,
      selectedPromocode,
      selectedMonthPlan,
    ]);

    useEffect(() => {
      const fetchData = async () => {
        const planData = await dopplerAccountPlansApiClient.getPlanData(selectedPlan);

        setState((prevState) => ({
          ...prevState,
          loadingPlanInformation: false,
          plan: planData.value,
        }));
      };

      fetchData();
    }, [dopplerAccountPlansApiClient, selectedPlan]);

    useEffect(() => {
      const fetchData = async () => {
        const validateData = selectedPromocode
          ? await dopplerAccountPlansApiClient.validatePromocode(selectedPlan, selectedPromocode)
          : undefined;

        setState((prevState) => ({
          ...prevState,
          loadingPromocodeValidation: false,
          promotion:
            validateData && validateData.success
              ? { ...validateData.value, promocode: selectedPromocode }
              : '',
        }));
      };

      fetchData();
    }, [dopplerAccountPlansApiClient, selectedPromocode, selectedPlan]);

    const getPlanTypeTitle = () => {
      switch (planType) {
        case PLAN_TYPE.byCredit:
        case PLAN_TYPE.byContact:
        case PLAN_TYPE.byEmail:
          return (
            _('checkoutProcessForm.purchase_summary.plan_premium_title') +
            ' - ' +
            _(`checkoutProcessForm.purchase_summary.plan_type_${planType.replace('-', '_')}`)
          );
        default:
          return '';
      }
    };

    const applyPromocode = async (promotion) => {
      if (!selectedPromocode) {
        const amountDetailsData = await dopplerAccountPlansApiClient.getPlanAmountDetailsData(
          selectedPlan,
          selectedDiscountId ?? 0,
          promotion.promocode,
        );

        setState((prevState) => ({
          ...prevState,
          amountDetails: amountDetailsData.success ? amountDetailsData.value : { total: 0 },
          promotion,
        }));
      }
      onApplyPromocode(promotion.promocode);
    };

    const { total, currentMonthTotal, nextMonthTotal } = state.amountDetails;
    const { loadingPaymentInformation, loadingPlanInformation, loadingPromocodeValidation } = state;

    return (
      <>
        {(loadingPaymentInformation || loadingPlanInformation || loadingPromocodeValidation) && (
          <Loading />
        )}
        <div className="dp-hiring-summary">
          <header className="dp-header-summary">
            <h6>{_('checkoutProcessForm.purchase_summary.header')}</h6>
          </header>
          <h3>{getPlanTypeTitle()}</h3>
          <ShoppingList state={state} planType={planType} promotion={state.promotion} />
          <hr className="dp-hr-grey" />
          {(isFree || planType === PLAN_TYPE.byCredit) && (
            <div>
              <Promocode
                allowPromocode={!state.discount ? true : state.discount.applyPromo}
                disabled={!canBuy}
                planId={selectedPlan}
                callback={(promocode) => {
                  applyPromocode(promocode);
                }}
              />
              <hr className="dp-hr-grey" />
            </div>
          )}
          <TotalPurchase
            totalPlan={nextMonthTotal}
            priceToPay={total}
            currentMonthTotal={currentMonthTotal}
            state={state}
            isFree={isFree}
          />
        </div>
        <div className="dp-zigzag" />
        <PlanPurchase
          canBuy={canBuy}
          planId={selectedPlan}
          discount={state.discount}
          promotion={state.promotion}
          total={currentMonthTotal ?? 0}
          paymentMethod={state.paymentMethodType}
        />
      </>
    );
  },
);
