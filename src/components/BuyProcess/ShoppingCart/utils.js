import { FormattedMessage, FormattedNumber } from 'react-intl';
import { amountByPlanType, thousandSeparatorNumber } from '../../../utils';
import {
  AddOnType,
  BUY_LANDING_PACK,
  BUY_MARKETING_PLAN,
  BUY_ONSITE_PLAN,
  BUY_PUSH_NOTIFICATION_PLAN,
  CloverError,
  FirstDataError,
  MercadoPagoError,
  OnlySupportUpSelling,
  PLAN_TYPE,
  RaftApiError,
} from '../../../doppler-types';
import { CheckoutLink } from './CheckoutLink';
import { CheckoutButton } from './CheckoutButton';
import { LandingPackCheckoutLink } from './CheckoutLink/LandingPackCheckoutLink';
import { LandingPackCheckoutButton } from './CheckoutButton/LandingPackCheckoutButton';
import { AddOnCheckoutLink } from './CheckoutLink/AddOn';
import { AddOnCheckoutButton } from './CheckoutButton/AddOn';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const getLegacyCheckoutPurchaseUrl = ({
  controlPanelUrl,
  planId,
  discountId,
  currentQueryParams,
}) => {
  return (
    controlPanelUrl +
    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planId}&fromStep1=True` +
    `${discountId ? `&IdDiscountPlan=${discountId}` : ''}` +
    `${currentQueryParams}`
  );
};

const getNewCheckoutPurchaseUrl = ({
  planType,
  planId,
  discountId,
  monthPlan,
  currentQueryParams,
}) => {
  return (
    `/checkout/premium/${planType}?selected-plan=${planId}` +
    `${discountId ? `&discountId=${discountId}` : ''}` +
    `${monthPlan ? `&monthPlan=${monthPlan}` : ''}` +
    `${currentQueryParams}`
  );
};

export const getBuyPurchaseUrl = ({
  controlPanelUrl,
  planType,
  planId,
  discountId,
  monthPlan,
  newCheckoutEnabled,
  search,
}) => {
  const params = new URLSearchParams(search.slice(1));
  // these parameters are eliminated, so that they do not appear repeated in the url
  params.delete('selected-plan');
  params.delete('discountId');
  params.delete('monthPlan');

  const currentQueryParams = params.toString()
    ? `&${params.toString().replace('promo-code', 'PromoCode')}`
    : '';
  return newCheckoutEnabled
    ? getNewCheckoutPurchaseUrl({ planType, planId, discountId, monthPlan, currentQueryParams })
    : getLegacyCheckoutPurchaseUrl({ controlPanelUrl, planId, discountId, currentQueryParams });
};

export const mapItemFromMarketingPlan = ({
  marketingPlan,
  selectedPaymentFrequency,
  amountDetailsData,
  promocodeApplied,
  disabledPromocode,
  removePromocodeApplied,
  intl,
  isExclusiveDiscountArgentina,
}) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const numberMonths = selectedPaymentFrequency?.numberMonths;

  const planInformation = {
    name: <FormattedMessage id={`buy_process.marketing_plan_title`} />,
    featureList: [
      <FormattedMessage
        id={`buy_process.feature_item_${marketingPlan.type}`}
        values={{
          units: thousandSeparatorNumber(intl.defaultLocale, amountByPlanType(marketingPlan)),
          Strong: (chunk) => <strong>{chunk}</strong>,
        }}
      />,
    ],
    data: marketingPlan,
    billingList: [],
    subscriptionItems: [],
  };

  // Months to hire
  if (marketingPlan.type === PLAN_TYPE.byContact) {
    const monthsCount = numberMonths ? numberMonths : 1;
    const amount = numberMonths ? marketingPlan?.fee * monthsCount : marketingPlan?.fee;

    planInformation.featureList.push(
      <>
        <FormattedMessage id={`buy_process.months_to_hire`} />{' '}
        <strong>
          <FormattedMessage
            id="buy_process.month_with_plural"
            values={{ months: monthsCount }}
          ></FormattedMessage>
        </strong>{' '}
        US$ <FormattedNumber value={amount} {...numberFormatOptions} />
      </>,
    );
  }

  // Months to pay
  if (marketingPlan.type === PLAN_TYPE.byContact || marketingPlan.type === PLAN_TYPE.byEmail) {
    const monthsToPay = amountDetailsData?.value?.discountPrepayment?.monthsToPay;
    const monthsCount = monthsToPay ? monthsToPay : numberMonths ? numberMonths : 1;
    const amountMonthsToPay = numberMonths ? marketingPlan?.fee * monthsCount : marketingPlan?.fee;

    planInformation.billingList.push({
      label: (
        <>
          <FormattedMessage
            id={
              marketingPlan.type !== PLAN_TYPE.byContact
                ? `buy_process.months_to_pay`
                : `buy_process.difference_months_to_pay`
            }
            values={{
              months: monthsToPay ? monthsToPay : numberMonths ? numberMonths : 1,
            }}
          />{' '}
          <strong>
            <FormattedMessage
              id="buy_process.month_with_plural"
              values={{ months: monthsCount }}
            ></FormattedMessage>
          </strong>
        </>
      ),
      amount: (
        <>
          US$ <FormattedNumber value={amountMonthsToPay} {...numberFormatOptions} />
        </>
      ),
    });
  }

  // Discount advanced pay
  if (amountDetailsData?.value?.discountPrepayment?.discountPercentage > 0) {
    planInformation.featureList.push(
      <>
        <FormattedMessage
          id={`buy_process.feature_item_discount_advanced_pay`}
          values={{
            months: numberMonths,
          }}
        />
        <span className="dp-discount">
          -{amountDetailsData?.value?.discountPrepayment?.discountPercentage}%
        </span>
      </>,
    );

    planInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.shopping_cart.save_percentage`}
          values={{
            percentage: `${amountDetailsData?.value?.discountPrepayment?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPrepayment.amount}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  if (amountDetailsData?.value?.discountPromocode?.discountPercentage > 0) {
    planInformation.featureList.push(
      <>
        <p className={isExclusiveDiscountArgentina ? 'dp-discount-arg' : ''}>
          <FormattedMessage
            id={
              isExclusiveDiscountArgentina
                ? `buy_process.feature_item_discount_monthly_argentina`
                : `buy_process.feature_item_discount_monthly`
            }
            values={{
              months:
                promocodeApplied?.duration || amountDetailsData?.value?.discountPromocode?.duration,
            }}
          />
        </p>
        {promocodeApplied && !disabledPromocode && (
          <button
            type="button"
            className="dp-btn-delete dpicon iconapp-delete"
            title="borrar"
            onClick={removePromocodeApplied}
          />
        )}
      </>,
    );

    planInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.shopping_cart.save_percentage`}
          values={{
            percentage: `${amountDetailsData?.value?.discountPromocode?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPromocode.amount}
            {...numberFormatOptions}
          />
          *
        </>
      ),
    });
  }

  if (amountDetailsData?.value?.discountPlanFeeAdmin?.discountPercentage > 0) {
    planInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.promocode.discount_for_admin`}
          values={{
            Strong: (chunk) => <strong>{chunk}</strong>,
            percentage: `${amountDetailsData?.value?.discountPlanFeeAdmin?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPlanFeeAdmin.amount}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  if (promocodeApplied?.planType === PLAN_TYPE.byCredit && promocodeApplied?.extraCredits > 0) {
    planInformation.featureList.push(
      <>
        <p>
          <FormattedMessage
            id={`buy_process.feature_item_extra_credits`}
            values={{
              units: thousandSeparatorNumber(intl.defaultLocale, promocodeApplied?.extraCredits),
            }}
          />
        </p>
        <button
          type="button"
          className="dp-btn-delete dpicon iconapp-delete"
          title="borrar"
          onClick={removePromocodeApplied}
        />
      </>,
    );
  }

  // Positive balance
  if (amountDetailsData?.value?.discountPaymentAlreadyPaid > 0) {
    planInformation.billingList.push({
      label: <FormattedMessage id="buy_process.discount_for_payment_paid" />,
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData?.value?.discountPaymentAlreadyPaid}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  if (marketingPlan.type === PLAN_TYPE.byCredit) {
    planInformation.subscriptionItems.push(
      _('buy_process.shopping_cart.credits_renewal_description'),
    );
  } else {
    planInformation.subscriptionItems.push(_('buy_process.shopping_cart.renewal_description'));
  }

  planInformation.subscriptionItems.push(_('buy_process.shopping_cart.price_without_taxes'));

  return planInformation;
};

export const mapItemFromChatPlan = (chatPlan) => ({
  name: <FormattedMessage id={`buy_process.chat_plan_title`} />,
  featureList: [
    <FormattedMessage
      id="buy_process.feature_item_chat_plan"
      values={{
        units: chatPlan.cant,
      }}
    />,
  ],
  billingList: [
    {
      label: 'Ahorra 25%',
      amount: 'US$ 288,00*',
    },
    {
      label: 'Facturación anual',
      amount: 'US$ 216,00*',
    },
  ],
  isRemovible: true,
  data: chatPlan,
  handleRemove: chatPlan.handleRemove,
});

export const mapItemFromLandingPackages = ({
  landingPacks,
  selectedPaymentFrequency,
  amountDetailsData,
  sessionPlan,
  intl,
}) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const numberMonths = selectedPaymentFrequency?.numberMonths;

  const LandingPackInformation = {
    name: <FormattedMessage id={`landing_selection.shopping_cart.title`} />,
    featureList: [
      ...landingPacks.map((landingPack) => (
        <FormattedMessage
          id={`landing_selection.shopping_cart.pack_of_landing_pages`}
          values={{
            packagesQty: landingPack.packagesQty,
            landingsQty: landingPack.landingsQty,
          }}
        />
      )),
    ],
    data: landingPacks,
    billingList: [],
    subscriptionItems: [],
  };

  // Months to pay
  const monthsToPay = amountDetailsData?.value?.discountPrepayment?.monthsToPay;
  const monthsCount = monthsToPay ? monthsToPay : numberMonths ? numberMonths : 1;
  const totalLandingPacks = landingPacks.reduce((a, b) => a + b.price * b.packagesQty, 0);
  const amountMonthsToPay = numberMonths ? totalLandingPacks * monthsCount : totalLandingPacks;

  LandingPackInformation.billingList.push({
    label: (
      <>
        <FormattedMessage
          id={
            sessionPlan.planType !== PLAN_TYPE.byContact
              ? `buy_process.months_to_pay`
              : `buy_process.difference_months_to_pay`
          }
          values={{
            months: monthsToPay ? monthsToPay : numberMonths ? numberMonths : 1,
          }}
        />{' '}
        <strong>
          <FormattedMessage
            id="buy_process.month_with_plural"
            values={{ months: monthsCount }}
          ></FormattedMessage>
        </strong>
      </>
    ),
    amount: (
      <>
        US$ <FormattedNumber value={amountMonthsToPay} {...numberFormatOptions} />
      </>
    ),
  });

  // Discount advanced pay
  if (amountDetailsData?.value?.discountPrepayment?.discountPercentage > 0) {
    LandingPackInformation.featureList.push(
      <>
        <FormattedMessage
          id={`buy_process.feature_item_discount_advanced_pay`}
          values={{
            months: numberMonths,
          }}
        />
        <span className="dp-discount">
          -{amountDetailsData?.value?.discountPrepayment?.discountPercentage}%
        </span>
      </>,
    );

    LandingPackInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.shopping_cart.save_percentage`}
          values={{
            percentage: `${amountDetailsData?.value?.discountPrepayment?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPrepayment.amount}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  if (amountDetailsData?.value?.discountPromocode?.discountPercentage > 0) {
    LandingPackInformation.featureList.push(
      <>
        <FormattedMessage
          id={`buy_process.feature_item_discount_monthly`}
          values={{
            months: amountDetailsData?.value?.discountPromocode?.duration,
          }}
        />
      </>,
    );

    LandingPackInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.shopping_cart.save_percentage`}
          values={{
            percentage: `${amountDetailsData?.value?.discountPromocode?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPromocode.amount}
            {...numberFormatOptions}
          />
          *
        </>
      ),
    });
  }

  if (amountDetailsData?.value?.discountPlanFeeAdmin?.discountPercentage > 0) {
    LandingPackInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.promocode.discount_for_admin`}
          values={{
            Strong: (chunk) => <strong>{chunk}</strong>,
            percentage: `${amountDetailsData?.value?.discountPlanFeeAdmin?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPlanFeeAdmin.amount}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  // Positive balance
  if (amountDetailsData?.value?.discountPaymentAlreadyPaid > 0) {
    LandingPackInformation.billingList.push({
      label: <FormattedMessage id="buy_process.discount_for_payment_paid" />,
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData?.value?.discountPaymentAlreadyPaid}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  LandingPackInformation.subscriptionItems.push(_('buy_process.shopping_cart.renewal_description'));
  LandingPackInformation.subscriptionItems.push(_('buy_process.shopping_cart.price_without_taxes'));

  return LandingPackInformation;
};

export const mapItemFromPlanChat = ({
  planChat,
  selectedPaymentFrequency,
  intl,
  amountDetailsData,
  planType,
  handleRemove,
  canChatPlanRemove = true,
}) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const numberMonths = selectedPaymentFrequency?.numberMonths;

  const planChatInformation = {
    name: <FormattedMessage id={`buy_process.chat_plan_title`} />,
    featureList: [
      <FormattedMessage
        id={`buy_process.feature_item_chat_plan`}
        values={{
          units: thousandSeparatorNumber(intl.defaultLocale, planChat?.conversationsQty ?? 0),
          Strong: (chunk) => <strong>{chunk}</strong>,
        }}
      />,
    ],
    // isRemovible: true,
    data: planChat,
    isRemovible: canChatPlanRemove,
    handleRemove,
    billingList: [],
    subscriptionItems: [],
  };

  // Months to hire
  if (planType === PLAN_TYPE.byContact) {
    const monthsCount = numberMonths ? numberMonths : 1;
    const chatPlanFee = planChat?.fee ?? 0;
    const amount = numberMonths ? chatPlanFee * monthsCount : chatPlanFee;

    planChatInformation.featureList.push(
      <>
        <FormattedMessage id={`buy_process.months_to_hire`} />{' '}
        <strong>
          <FormattedMessage
            id="buy_process.month_with_plural"
            values={{ months: monthsCount }}
          ></FormattedMessage>
        </strong>{' '}
        US$ <FormattedNumber value={amount} {...numberFormatOptions} />
      </>,
    );
  }

  // Months to pay
  const monthsToPay = amountDetailsData?.value?.discountPrepayment?.monthsToPay;
  const monthsCount = monthsToPay ? monthsToPay : numberMonths ? numberMonths : 1;
  const planFee = planChat?.fee ?? 0;
  const amountMonthsToPay = numberMonths ? planFee * monthsCount : planFee;

  planChatInformation.billingList.push({
    label: (
      <>
        <FormattedMessage
          id={
            planType !== PLAN_TYPE.byContact
              ? `buy_process.months_to_pay`
              : `buy_process.difference_months_to_pay`
          }
          values={{
            months: monthsToPay ? monthsToPay : numberMonths ? numberMonths : 1,
          }}
        />{' '}
        <strong>
          <FormattedMessage
            id="buy_process.month_with_plural"
            values={{ months: monthsCount }}
          ></FormattedMessage>
        </strong>
      </>
    ),
    amount: (
      <>
        US$ <FormattedNumber value={amountMonthsToPay} {...numberFormatOptions} />
      </>
    ),
  });

  // // Discount advanced pay
  if (amountDetailsData?.value?.discountPrepayment?.discountPercentage > 0) {
    planChatInformation.featureList.push(
      <>
        <FormattedMessage
          id={`buy_process.feature_item_discount_advanced_pay`}
          values={{
            months: numberMonths,
          }}
        />
        <span className="dp-discount">
          -{amountDetailsData?.value?.discountPrepayment?.discountPercentage}%
        </span>
      </>,
    );

    planChatInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.shopping_cart.save_percentage`}
          values={{
            percentage: `${amountDetailsData?.value?.discountPrepayment?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPrepayment.amount}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  if (amountDetailsData?.value?.discountPromocode?.discountPercentage > 0) {
    planChatInformation.featureList.push(
      <>
        <FormattedMessage
          id={`buy_process.feature_item_discount_monthly`}
          values={{
            months: amountDetailsData?.value?.discountPromocode?.duration,
          }}
        />
      </>,
    );

    planChatInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.shopping_cart.save_percentage`}
          values={{
            percentage: `${amountDetailsData?.value?.discountPromocode?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPromocode.amount}
            {...numberFormatOptions}
          />
          *
        </>
      ),
    });
  }

  if (amountDetailsData?.value?.discountPlanFeeAdmin?.discountPercentage > 0) {
    planChatInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.promocode.discount_for_admin`}
          values={{
            Strong: (chunk) => <strong>{chunk}</strong>,
            percentage: `${amountDetailsData?.value?.discountPlanFeeAdmin?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPlanFeeAdmin.amount}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  // // Positive balance
  if (amountDetailsData?.value?.discountPaymentAlreadyPaid > 0) {
    planChatInformation.billingList.push({
      label: <FormattedMessage id="buy_process.discount_for_payment_paid" />,
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData?.value?.discountPaymentAlreadyPaid}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  planChatInformation.subscriptionItems.push(_('buy_process.shopping_cart.renewal_description'));
  planChatInformation.subscriptionItems.push(_('buy_process.shopping_cart.price_without_taxes'));

  return planChatInformation;
};

export const mapItemFromOnSitePlan = ({
  onSitePlan,
  selectedPaymentFrequency,
  intl,
  amountDetailsData,
  planType,
  handleRemove,
  canOnSitePlanRemove,
}) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const numberMonths = selectedPaymentFrequency?.numberMonths;

  const onSitePlanInformation = {
    name: <FormattedMessage id={`buy_process.onsite_plan_title`} />,
    featureList: [
      <FormattedMessage
        id={`buy_process.feature_item_onsite_plan`}
        values={{
          units: thousandSeparatorNumber(intl.defaultLocale, onSitePlan?.printQty ?? 0),
          Strong: (chunk) => <strong>{chunk}</strong>,
        }}
      />,
    ],
    // isRemovible: true,
    data: onSitePlan,
    isRemovible: canOnSitePlanRemove,
    handleRemove,
    billingList: [],
    subscriptionItems: [],
  };

  // Months to hire
  if (planType === PLAN_TYPE.byContact) {
    const monthsCount = numberMonths ? numberMonths : 1;
    const onSitePlanFee = onSitePlan?.fee ?? 0;
    const amount = numberMonths ? onSitePlanFee * monthsCount : onSitePlanFee;

    onSitePlanInformation.featureList.push(
      <>
        <FormattedMessage id={`buy_process.months_to_hire`} />{' '}
        <strong>
          <FormattedMessage
            id="buy_process.month_with_plural"
            values={{ months: monthsCount }}
          ></FormattedMessage>
        </strong>{' '}
        US$ <FormattedNumber value={amount} {...numberFormatOptions} />
      </>,
    );
  }

  // Months to pay
  const monthsToPay = amountDetailsData?.value?.discountPrepayment?.monthsToPay;
  const monthsCount = monthsToPay ? monthsToPay : numberMonths ? numberMonths : 1;
  const planFee = onSitePlan?.fee ?? 0;
  const amountMonthsToPay = numberMonths ? planFee * monthsCount : planFee;

  onSitePlanInformation.billingList.push({
    label: (
      <>
        <FormattedMessage
          id={
            planType !== PLAN_TYPE.byContact
              ? `buy_process.months_to_pay`
              : `buy_process.difference_months_to_pay`
          }
          values={{
            months: monthsToPay ? monthsToPay : numberMonths ? numberMonths : 1,
          }}
        />{' '}
        <strong>
          <FormattedMessage
            id="buy_process.month_with_plural"
            values={{ months: monthsCount }}
          ></FormattedMessage>
        </strong>
      </>
    ),
    amount: (
      <>
        US$ <FormattedNumber value={amountMonthsToPay} {...numberFormatOptions} />
      </>
    ),
  });

  // // Discount advanced pay
  if (amountDetailsData?.value?.discountPrepayment?.discountPercentage > 0) {
    onSitePlanInformation.featureList.push(
      <>
        <FormattedMessage
          id={`buy_process.feature_item_discount_advanced_pay`}
          values={{
            months: numberMonths,
          }}
        />
        <span className="dp-discount">
          -{amountDetailsData?.value?.discountPrepayment?.discountPercentage}%
        </span>
      </>,
    );

    onSitePlanInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.shopping_cart.save_percentage`}
          values={{
            percentage: `${amountDetailsData?.value?.discountPrepayment?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPrepayment.amount}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  if (amountDetailsData?.value?.discountPlanFeeAdmin?.discountPercentage > 0) {
    onSitePlanInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.promocode.discount_for_admin`}
          values={{
            Strong: (chunk) => <strong>{chunk}</strong>,
            percentage: `${amountDetailsData?.value?.discountPlanFeeAdmin?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPlanFeeAdmin.amount}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  // // Positive balance
  if (amountDetailsData?.value?.discountPaymentAlreadyPaid > 0) {
    onSitePlanInformation.billingList.push({
      label: <FormattedMessage id="buy_process.discount_for_payment_paid" />,
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData?.value?.discountPaymentAlreadyPaid}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  onSitePlanInformation.subscriptionItems.push(_('buy_process.shopping_cart.renewal_description'));
  onSitePlanInformation.subscriptionItems.push(_('buy_process.shopping_cart.price_without_taxes'));

  return onSitePlanInformation;
};

export const mapItemFromAddOnPlan = ({
  addOnPlan,
  addOnType,
  selectedPaymentFrequency,
  intl,
  amountDetailsData,
  planType,
  handleRemove,
  canAddOnPlanRemove,
}) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const numberMonths = selectedPaymentFrequency?.numberMonths;

  const addOnPlanInformation = {
    name: (
      <FormattedMessage
        id={`${
          addOnType === AddOnType.OnSite
            ? 'buy_process.onsite_plan_title'
            : 'buy_process.push_notification_plan_title'
        }`}
      />
    ),
    featureList: [
      <FormattedMessage
        id={`${
          addOnType === AddOnType.OnSite
            ? 'buy_process.feature_item_onsite_plan'
            : 'buy_process.feature_item_push_notification_plan'
        }`}
        values={{
          units: thousandSeparatorNumber(intl.defaultLocale, addOnPlan?.quantity ?? 0),
          Strong: (chunk) => <strong>{chunk}</strong>,
        }}
      />,
    ],
    // isRemovible: true,
    data: addOnPlan,
    isRemovible: canAddOnPlanRemove,
    handleRemove,
    billingList: [],
    subscriptionItems: [],
  };

  // Months to hire
  if (planType === PLAN_TYPE.byContact) {
    const monthsCount = numberMonths ? numberMonths : 1;
    const addOnPlanFee = addOnPlan?.fee ?? 0;
    const amount = numberMonths ? addOnPlanFee * monthsCount : addOnPlanFee;

    addOnPlanInformation.featureList.push(
      <>
        <FormattedMessage id={`buy_process.months_to_hire`} />{' '}
        <strong>
          <FormattedMessage
            id="buy_process.month_with_plural"
            values={{ months: monthsCount }}
          ></FormattedMessage>
        </strong>{' '}
        US$ <FormattedNumber value={amount} {...numberFormatOptions} />
      </>,
    );
  }

  // Months to pay
  const monthsToPay = amountDetailsData?.value?.discountPrepayment?.monthsToPay;
  const monthsCount = monthsToPay ? monthsToPay : numberMonths ? numberMonths : 1;
  const planFee = addOnPlan?.fee ?? 0;
  const amountMonthsToPay = numberMonths ? planFee * monthsCount : planFee;

  addOnPlanInformation.billingList.push({
    label: (
      <>
        <FormattedMessage
          id={
            planType !== PLAN_TYPE.byContact
              ? `buy_process.months_to_pay`
              : `buy_process.difference_months_to_pay`
          }
          values={{
            months: monthsToPay ? monthsToPay : numberMonths ? numberMonths : 1,
          }}
        />{' '}
        <strong>
          <FormattedMessage
            id="buy_process.month_with_plural"
            values={{ months: monthsCount }}
          ></FormattedMessage>
        </strong>
      </>
    ),
    amount: (
      <>
        US$ <FormattedNumber value={amountMonthsToPay} {...numberFormatOptions} />
      </>
    ),
  });

  // // Discount advanced pay
  if (amountDetailsData?.value?.discountPrepayment?.discountPercentage > 0) {
    addOnPlanInformation.featureList.push(
      <>
        <FormattedMessage
          id={`buy_process.feature_item_discount_advanced_pay`}
          values={{
            months: numberMonths,
          }}
        />
        <span className="dp-discount">
          -{amountDetailsData?.value?.discountPrepayment?.discountPercentage}%
        </span>
      </>,
    );

    addOnPlanInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.shopping_cart.save_percentage`}
          values={{
            percentage: `${amountDetailsData?.value?.discountPrepayment?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPrepayment.amount}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  if (amountDetailsData?.value?.discountPromocode?.discountPercentage > 0) {
    addOnPlanInformation.featureList.push(
      <>
        <FormattedMessage
          id={`buy_process.feature_item_discount_monthly`}
          values={{
            months: amountDetailsData?.value?.discountPromocode?.duration,
          }}
        />
      </>,
    );

    addOnPlanInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.shopping_cart.save_percentage`}
          values={{
            percentage: `${amountDetailsData?.value?.discountPromocode?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPromocode.amount}
            {...numberFormatOptions}
          />
          *
        </>
      ),
    });
  }

  if (amountDetailsData?.value?.discountPlanFeeAdmin?.discountPercentage > 0) {
    addOnPlanInformation.billingList.push({
      label: (
        <FormattedMessage
          id={`buy_process.promocode.discount_for_admin`}
          values={{
            Strong: (chunk) => <strong>{chunk}</strong>,
            percentage: `${amountDetailsData?.value?.discountPlanFeeAdmin?.discountPercentage}%`,
          }}
        />
      ),
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData.value.discountPlanFeeAdmin.amount}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  // // Positive balance
  if (amountDetailsData?.value?.discountPaymentAlreadyPaid > 0) {
    addOnPlanInformation.billingList.push({
      label: <FormattedMessage id="buy_process.discount_for_payment_paid" />,
      amount: (
        <>
          US$ -
          <FormattedNumber
            value={amountDetailsData?.value?.discountPaymentAlreadyPaid}
            {...numberFormatOptions}
          />
        </>
      ),
    });
  }

  addOnPlanInformation.subscriptionItems.push(_('buy_process.shopping_cart.renewal_description'));
  addOnPlanInformation.subscriptionItems.push(_('buy_process.shopping_cart.price_without_taxes'));

  return addOnPlanInformation;
};

export const getCheckoutErrorMesage = (error) => {
  switch (error) {
    case FirstDataError.invalidExpirationDate:
    case MercadoPagoError.invalidExpirationDate:
    case CloverError.invalidExpirationMonth:
    case CloverError.invalidExpirationYear:
    case CloverError.invalidExpirationCard:
    case RaftApiError.invalidExpirationYear:
    case RaftApiError.invalidExpirationCard:
      return 'checkoutProcessForm.payment_method.first_data_error.invalid_expiration_date';
    case FirstDataError.invalidCreditCardNumber:
    case FirstDataError.invalidCCNumber:
    case CloverError.invalidCreditCardNumber:
    case RaftApiError.invalidCreditCardNumber:
    case RaftApiError.invalidToken:
      return 'checkoutProcessForm.payment_method.first_data_error.invalid_credit_card_number';
    case FirstDataError.declined:
    case FirstDataError.doNotHonorDeclined:
    case MercadoPagoError.declinedOtherReason:
    case CloverError.declined:
    case RaftApiError.doNotHonor:
    case RaftApiError.declined:
      return 'checkoutProcessForm.payment_method.first_data_error.declined';
    case FirstDataError.suspectedFraud:
    case MercadoPagoError.suspectedFraud:
    case RaftApiError.declinedFraud:
    case RaftApiError.doNotHonorFraud:
      return 'checkoutProcessForm.payment_method.first_data_error.suspected_fraud';
    case FirstDataError.insufficientFunds:
    case MercadoPagoError.insufficientFunds:
    case CloverError.insufficientFunds:
    case RaftApiError.insufficientFunds:
      return 'checkoutProcessForm.payment_method.first_data_error.insufficient_funds';
    case FirstDataError.cardVolumeExceeded:
      return 'checkoutProcessForm.payment_method.first_data_error.card_volume_exceeded';
    case MercadoPagoError.invalidSecurityCode:
    case CloverError.invalidSecurityCode:
    case RaftApiError.invalidSecurityCode:
      return 'checkoutProcessForm.payment_method.mercado_pago_error.invalid_security_code';
    case OnlySupportUpSelling:
      return 'checkoutProcessForm.purchase_summary.error_only_supports_upselling_message';
    default:
      return 'checkoutProcessForm.purchase_summary.error_message';
  }
};

export const getBuyButton = ({
  pathname,
  isEqualPlan,
  sessionPlanType,
  selectedMarketingPlan,
  selectedDiscount,
  promotion,
  canBuy,
  paymentMethodName,
  total,
  buyType = BUY_MARKETING_PLAN,
  landingPacks,
  disabledLandingsBuy,
  checkoutLandingPackButtonEnabled,
  cancelLandings,
  selectedPlanChat,
  hasChatActive,
  selectedAddOnPlan,
}) => {
  const redirectNewCheckout = [
    PLAN_TYPE.free,
    PLAN_TYPE.byEmail,
    PLAN_TYPE.byContact,
    PLAN_TYPE.byCredit,
  ].includes(sessionPlanType);

  if (buyType === BUY_LANDING_PACK) {
    const landingIdsMapped = landingPacks?.map((item) => item.planId).toString();
    const landingPacksMapped = landingPacks?.map((item) => item.packagesQty).toString();

    if (pathname.includes('/checkout/premium/')) {
      return (
        <LandingPackCheckoutButton
          keyTextButton={'buy_process.buy_now_title'}
          canBuy={canBuy}
          landingPacks={landingPacks?.map((lp) => ({
            landingPlanId: lp.planId,
            landingQty: lp.packagesQty,
            fee: lp.price,
          }))}
          landingIds={landingIdsMapped}
          landingPacksMapped={landingPacksMapped}
          total={total}
        />
      );
    } else if (checkoutLandingPackButtonEnabled) {
      return (
        <LandingPackCheckoutButton
          keyTextButton={'buy_process.continue'}
          canBuy={canBuy}
          landingPacks={[]}
          total={total}
          cancelLandings={cancelLandings}
        />
      );
    } else {
      return disabledLandingsBuy ? (
        <button type="button" className="dp-button button-big primary-green" disabled>
          <FormattedMessage id="buy_process.continue" />
        </button>
      ) : (
        <LandingPackCheckoutLink
          showTooltip={isEqualPlan && sessionPlanType !== PLAN_TYPE.byCredit}
          planType={sessionPlanType === PLAN_TYPE.free ? PLAN_TYPE.byContact : sessionPlanType}
          landingIds={landingIdsMapped}
          landingPacks={landingPacksMapped}
          monthPlan={selectedDiscount?.numberMonths}
        />
      );
    }
  }

  if (buyType === BUY_ONSITE_PLAN || buyType === BUY_PUSH_NOTIFICATION_PLAN) {
    if (pathname.includes('/checkout/premium/')) {
      return (
        <AddOnCheckoutButton
          total={total}
          discount={selectedDiscount}
          addOnPlanId={selectedAddOnPlan?.addOnPlan?.planId ?? '0'}
          cancelOnSitePlan={false}
          keyTextButton={'buy_process.buy_now_title'}
          canBuy={canBuy}
          buyType={buyType}
        />
      );
    } else {
      return (
        <AddOnCheckoutLink
          planId={selectedMarketingPlan?.id}
          showTooltip={isEqualPlan && sessionPlanType !== PLAN_TYPE.byCredit}
          planType={sessionPlanType === PLAN_TYPE.free ? PLAN_TYPE.byContact : sessionPlanType}
          addOnPlanId={selectedAddOnPlan?.addOnPlan?.planId ?? '0'}
          monthPlan={selectedDiscount?.numberMonths}
          buyType={buyType}
        />
      );
    }
  }

  if (pathname.includes('/checkout/premium/')) {
    return (
      <CheckoutButton
        keyTextButton={'buy_process.buy_now_title'}
        canBuy={canBuy}
        planId={selectedMarketingPlan?.id}
        discount={selectedDiscount}
        total={total}
        promotion={promotion}
        paymentMethod={paymentMethodName}
        selectedPlanChat={selectedPlanChat}
        buyType={buyType}
        hasChatActive={hasChatActive}
        selectedAddOnPlan={selectedAddOnPlan}
      />
    );
  }

  return (
    <CheckoutLink
      showTooltip={isEqualPlan && sessionPlanType !== PLAN_TYPE.byCredit}
      planType={selectedMarketingPlan?.type}
      planId={selectedMarketingPlan?.id}
      discountId={selectedDiscount?.id}
      promocode={promotion?.promocode ?? ''}
      monthPlan={selectedDiscount?.numberMonths}
      newCheckoutEnabled={redirectNewCheckout}
      chatPlanId={selectedPlanChat?.planChat?.planId}
    />
  );
};
