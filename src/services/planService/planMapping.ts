import {
  ACCOUNT,
  AccountType,
  AdvancePayOptions,
  BillingCycle,
  PaymentType,
} from '../../doppler-types';

export const planTypeByIdUserType: { [idUserType: number]: AccountType } = {
  1: ACCOUNT.free,
  2: ACCOUNT.byEmail,
  3: ACCOUNT.byCredit,
  4: ACCOUNT.byContact,
  5: ACCOUNT.agencies,
  6: ACCOUNT.agencies,
  7: ACCOUNT.free,
  8: ACCOUNT.agencies,
};

const paymentTypeByPaymentMethod: { [paymentMehtod: number]: PaymentType } = {
  1: 'CC',
  3: 'transfer',
};

const monthPlanByBillingCycle: { [paymentMehtod: number]: BillingCycle } = {
  1: 'monthly',
  3: 'quarterly',
  6: 'half-yearly',
  12: 'yearly',
};

export const mapAdvancePay = (discount: any): AdvancePayOptions => {
  return {
    id: discount.IdDiscountPlan,
    paymentType: paymentTypeByPaymentMethod[discount.IdPaymentMethod],
    discountPercentage: discount.DiscountPlanFee,
    billingCycle: monthPlanByBillingCycle[discount.MonthPlan],
  };
};

export const getBillingCycleDetails = (discounts: Array<any>) => {
  if (discounts.length === 0) {
    return [];
  }

  return discounts
    .filter((discount: any) => paymentTypeByPaymentMethod[discount.IdPaymentMethod] === 'CC')
    .map(mapAdvancePay);
};

export const parsePlan = (plan: any) => {
  const id = plan.IdUserTypePlan;
  const fee = plan.Fee;
  const planType = planTypeByIdUserType[plan.IdUserType];
  const emailsByMonth = plan.EmailQty;
  const extraEmailPrice = plan.ExtraEmailCost;

  switch (planType) {
    case ACCOUNT.byEmail:
      return {
        type: ACCOUNT.byEmail,
        id,
        name: `${emailsByMonth}-EMAILS`,
        emailsByMonth,
        extraEmailPrice,
        fee,
      };
    case ACCOUNT.byContact:
      const subscriberLimit = plan.SubscribersQty;
      const billingCycleDetails = getBillingCycleDetails(plan.DiscountXPlan);
      return {
        type: ACCOUNT.byContact,
        id: id,
        name: `${subscriberLimit}-SUBSCRIBERS`,
        subscriberLimit,
        fee,
        billingCycleDetails,
      };
    case ACCOUNT.byCredit:
      return {
        type: ACCOUNT.byCredit,
        id,
        name: `${emailsByMonth}-CREDITS`,
        credits: emailsByMonth,
        extraEmailPrice,
        price: fee,
      };
  }
};
