import React, { useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { InjectAppServices } from '../../../../services/pure-di';
import { Loading } from '../../../Loading/Loading';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { extractParameter } from '../../../../utils';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import useTimeout from '../../../../hooks/useTimeout';
import { paymentType } from '../PaymentMethod/PaymentMethod';
import { PLAN_TYPE } from '../../../../doppler-types';
import { InvoiceRecipients } from './InvoiceRecipients';
import { Promocode } from './Promocode';

const dollarSymbol = 'US$';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const PlanInformation = ({ plan, planType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

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
      <span>
        {_(`checkoutProcessForm.purchase_summary.plan_type_${planType.replace('-', '_')}_label`)}
        <strong> {getQuantity()}</strong>
      </span>
      <span>
        {dollarSymbol} <FormattedNumber value={plan?.fee} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const MonthsToPayInformation = ({ plan, discount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const monthsCount = discount ? discount.monthsAmmount : 1;
  const amount = discount ? plan?.fee * discount?.monthsAmmount : plan?.fee;

  return (
    <>
      <span>
        {_(`checkoutProcessForm.purchase_summary.months_to_pay`)}{' '}
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

export const CreditsPromocode = ({ extraCredits }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <span>
        {_(`checkoutProcessForm.purchase_summary.credits_for_promocode`)}{' '}
        <strong>{extraCredits}</strong>
      </span>
      <span>
        {dollarSymbol} <FormattedNumber value={0} {...numberFormatOptions} />
      </span>
    </>
  );
};

export const StatusMessage = ({ type, message, show }) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className={`dp-wrap-message dp-wrap-${type}`}>
        <span className="dp-message-icon" />
        <div className="dp-content-message">
          <p>{message}</p>
        </div>
      </div>
      <hr className="m-t-24 m-b-24"></hr>
    </>
  );
};

export const InvoiceInformation = ({ priceToPay, discount, paymentMethodType, planType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getTaxesLegend = (paymentMethodType, planType) => {
    switch (planType) {
      case PLAN_TYPE.byCredit:
        return paymentMethodType === paymentType.creditCard
          ? ''
          : `*${_('checkoutProcessForm.purchase_summary.explanatory_legend_by_credits')}`;
      case PLAN_TYPE.byContact:
      case PLAN_TYPE.byEmail:
        return paymentMethodType === paymentType.creditCard
          ? `*${_('checkoutProcessForm.purchase_summary.explanatory_legend')}`
          : `*${_('checkoutProcessForm.purchase_summary.transfer_explanatory_legend')}`;
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
              {dollarSymbol}{' '}
              <FormattedNumber value={priceToPay - discount} {...numberFormatOptions} />
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
        <span className="dp-renewal">{getTaxesLegend(paymentMethodType, planType)}</span>
      </li>
    </>
  );
};

export const TotalPurchase = ({ totalPlan, priceToPay, state }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { discountPrepayment } = state.amountDetails;

  return (
    <div className="dp-total-purchase">
      <ul>
        <li>
          <span>{_(`checkoutProcessForm.purchase_summary.total`)}</span>
          <span>
            {' '}
            <span className="dp-money">{dollarSymbol} </span>
            <FormattedNumber value={priceToPay} {...numberFormatOptions} />
          </span>
        </li>
        <InvoiceInformation
          planType={state.planType}
          priceToPay={totalPlan}
          discount={discountPrepayment?.amount}
          paymentMethodType={state.paymentMethodType}
        />
      </ul>
    </div>
  );
};

export const ShoppingList = ({ state, planType, promotion }) => {
  const { plan, discount } = state;
  const { discountPrepayment, discountPaymentAlreadyPaid, discountPromocode } = state.amountDetails;

  return (
    <ul className="dp-summary-list">
      <li aria-label="units">
        <PlanInformation plan={plan} planType={planType} />
      </li>
      {promotion?.extraCredits > 0 && (
        <li>
          <CreditsPromocode extraCredits={promotion.extraCredits} />
        </li>
      )}
      {planType === PLAN_TYPE.byContact || planType === PLAN_TYPE.byEmail ? (
        <li aria-label="months to pay">
          <MonthsToPayInformation discount={discount} plan={plan} planType={planType} />
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
    </ul>
  );
};

export const PurchaseSummary = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, appSessionRef },
    discountId,
    paymentMethod,
    canBuy,
    onApplyPromocode,
  }) => {
    const location = useLocation();
    const history = useHistory();
    const [state, setState] = useState({
      loading: true,
      planData: {},
      amountDetails: { total: 0, discountPrepayment: { discountPercentage: 0 } },
      plan: { fee: 0 },
      discount: { discountPercentage: 0, monthsAmmount: 1 },
    });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(false);
    const [recipients, setRecipients] = useState([]);
    const createTimeout = useTimeout();
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { planType } = useRouteMatch().params;
    const selectedDiscountId =
      discountId === 0
        ? extractParameter(location, queryString.parse, 'discountId') ?? 0
        : discountId;
    const selectedPlan = extractParameter(location, queryString.parse, 'selected-plan') || 0;
    const selectedPromocode = extractParameter(location, queryString.parse, 'PromoCode') || '';

    useEffect(() => {
      const fetchData = async () => {
        let paymentMethodType = paymentMethod;
        const userEmail = appSessionRef.current.userData.user.email;

        var invoiceRecipientsData = await dopplerBillingUserApiClient.getInvoiceRecipientsData();

        setRecipients(
          invoiceRecipientsData.success ? invoiceRecipientsData.value.recipients : [userEmail],
        );

        if (paymentMethod === '') {
          const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();
          paymentMethodType = paymentMethodData.success
            ? paymentMethodData.value.paymentMethodName
            : paymentType.creditCard;
        }

        const discountsData = await dopplerAccountPlansApiClient.getDiscountsData(
          selectedPlan,
          paymentMethodType,
        );

        const discount = discountsData.success
          ? discountsData.value.find((d) => d.id.toString() === selectedDiscountId)
          : undefined;

        const amountDetailsData = await dopplerAccountPlansApiClient.getPlanAmountDetailsData(
          selectedPlan,
          selectedDiscountId ?? 0,
          selectedPromocode,
        );

        const planData = await dopplerAccountPlansApiClient.getPlanData(selectedPlan);

        setState((prevState) => ({
          ...prevState,
          loading: false,
          paymentMethodType,
          plan: planData.value,
          discount,
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
      appSessionRef,
      selectedPromocode,
    ]);

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

    const proceedToBuy = async () => {
      setSaving(true);
      const result = await dopplerBillingUserApiClient.purchase({
        planId: selectedPlan,
        discountId: selectedDiscountId,
        total: state.amountDetails.total,
      });

      setError(!result.success);
      setSaving(false);

      if (result.success) {
        setSaved(true);
        createTimeout(() => {
          setSaved(false);
          history.push('/checkout-summary');
        }, 3000);
      }
    };

    const updateInvoiceRecipients = async (recipients) => {
      setRecipients(recipients);

      await dopplerBillingUserApiClient.updateInvoiceRecipients(recipients, selectedPlan);
    };

    const applyPromocode = async (promotion) => {
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
      onApplyPromocode(promotion.promocode);
    };

    const { total } = state.amountDetails;

    return (
      <>
        {state.loading && <Loading />}
        <div className="dp-hiring-summary">
          <header className="dp-header-summary">
            <h6>{_('checkoutProcessForm.purchase_summary.header')}</h6>
          </header>
          <h3>{getPlanTypeTitle()}</h3>
          <ShoppingList state={state} planType={planType} promotion={state.promotion} />
          <hr className="dp-hr-grey" />
          <Promocode
            allowPromocode={!state.discount ? true : state.discount.applyPromo}
            disabled={!canBuy}
            planId={selectedPlan}
            callback={(promocode) => {
              applyPromocode(promocode);
            }}
          />
          <hr className="dp-hr-grey" />
          <TotalPurchase
            totalPlan={state.plan?.fee * state.discount?.monthsAmmount}
            priceToPay={total}
            state={state}
          />
        </div>
        <div className="dp-zigzag" />
        <div className="dp-cta-pay">
          <button
            type="button"
            className={'dp-button button-big primary-green' + (saving ? ' button--loading' : '')}
            disabled={!canBuy || saving}
            onClick={proceedToBuy}
          >
            {_('checkoutProcessForm.purchase_summary.buy_button')}
          </button>
          <button type="button" className="dp-button button-big">
            <span className="ms-icon icon-lock dp-color-green" />
            {_('checkoutProcessForm.purchase_summary.secure_payment_message')}
          </button>
        </div>
        <StatusMessage
          show={saved || error}
          type={saved ? 'success' : 'cancel'}
          message={_(`checkoutProcessForm.purchase_summary.${saved ? 'success' : 'error'}_message`)}
        />
        <InvoiceRecipients
          emails={recipients}
          viewOnly={true}
          onSubmit={(values) => {
            updateInvoiceRecipients(values.editRecipients);
          }}
        />
      </>
    );
  },
);
