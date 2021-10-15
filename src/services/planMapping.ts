import { AdvancePayOptions, BillingCycle, PathType, PaymentType, PlanType } from '../doppler-types';

/**
 * @deprecated planTypeByIdUserType is deprecated and will be removed. Please use planTypeByIdUserType from /src/services/planMapping.ts instead
 * */
export const planTypeByIdUserType: { [idUserType: number]: PlanType } = {
  1: 'free',
  2: 'monthly-deliveries',
  3: 'prepaid',
  4: 'subscribers',
  5: 'agencies',
  6: 'agencies',
  7: 'free',
  8: 'agencies',
};

const pathTypeByType: { [type: number]: PathType } = {
  1: 'free',
  2: 'standard',
  3: 'plus',
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

function mapAdvancePay(json: any): AdvancePayOptions {
  return {
    id: json.IdDiscountPlan,
    paymentType: paymentTypeByPaymentMethod[json.IdPaymentMethod],
    discountPercentage: json.DiscountPlanFee,
    billingCycle: monthPlanByBillingCycle[json.MonthPlan],
  };
}

/**
 * @deprecated parsePlan is deprecated and will be removed. Please use parsePlan function from /src/services/planMapping.ts instead
 * */
export function parsePlan(json: any) {
  const id = json.IdUserTypePlan;
  const fee = json.Fee;
  const featureSet = pathTypeByType[json.PlanType];
  const type = planTypeByIdUserType[json.IdUserType];
  const emailsByMonth = json.EmailQty;
  const subscriberLimit = json.SubscribersQty;
  const extraEmailPrice = json.ExtraEmailCost;
  const features = [];
  json.EmailParameterEnabled && features.push('emailParameter');
  json.CancelCampaignEnabled && features.push('cancelCampaign');
  json.SiteTrackingLicensed && features.push('siteTracking');
  json.SmartCampaignsEnabled && features.push('smartCampaigns');
  json.ShippingLimitEnabled && features.push('shippingLimit');

  const billingCycleDetails = json.DiscountXPlan.length
    ? json.DiscountXPlan.filter(
        (discount: any) => paymentTypeByPaymentMethod[discount.IdPaymentMethod] === 'CC',
      ).map(mapAdvancePay)
    : [];
  switch (type) {
    case 'monthly-deliveries':
      return {
        type: 'monthly-deliveries',
        id: id,
        name: `${emailsByMonth}-EMAILS-${featureSet.toUpperCase()}`,
        emailsByMonth: emailsByMonth,
        extraEmailPrice: extraEmailPrice,
        fee: fee,
        featureSet: featureSet,
        features: features,
      };
    case 'subscribers':
      return {
        type: 'subscribers',
        id: id,
        name: `${subscriberLimit}-SUBSCRIBERS-${featureSet.toUpperCase()}`,
        subscriberLimit: subscriberLimit,
        fee: fee,
        featureSet: featureSet,
        featureList: features,
        billingCycleDetails: billingCycleDetails,
      };
    case 'prepaid':
      return {
        type: 'prepaid',
        id: id,
        name: `${emailsByMonth}-CREDITS`,
        credits: emailsByMonth,
        extraEmailPrice: extraEmailPrice,
        price: fee,
        featureSet: 'standard',
      };
  }
}
