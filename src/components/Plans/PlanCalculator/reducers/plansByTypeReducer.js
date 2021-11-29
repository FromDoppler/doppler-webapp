import { PLAN_TYPE, SUBSCRIPTION_TYPE } from '../../../../doppler-types';

export const INITIAL_STATE_PLANS_BY_TYPE = {
  selectedPlanIndex: 0,
  selectedPlan: null,
  plansByType: [],
  sliderValuesRange: [],
  discounts: [],
  selectedDiscount: null,
  loading: false,
  hasError: false,
};

export const PLANS_BY_TYPE_ACTIONS = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  SELECT_DISCOUNT: 'SELECT_DISCOUNT',
  SELECT_PLAN: 'SELECT_PLAN',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const plansByTypeReducer = (state, action) => {
  switch (action.type) {
    case PLANS_BY_TYPE_ACTIONS.START_FETCH:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case PLANS_BY_TYPE_ACTIONS.FINISH_FETCH:
      const { payload: plansByType } = action;
      const sliderValuesRange = plansByType.map(amountByPlanType);
      const discounts =
        plansByType[0].billingCycleDetails?.map(mapDiscount).sort(orderDiscount) ?? [];
      return {
        ...state,
        selectedPlanIndex: 0,
        selectedPlan: plansByType[0], // Assuming that there is at leas one plan
        loading: false,
        plansByType,
        sliderValuesRange,
        discounts,
        selectedDiscount: discounts[0],
      };
    case PLANS_BY_TYPE_ACTIONS.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    case PLANS_BY_TYPE_ACTIONS.SELECT_DISCOUNT:
      const { payload: selectedDiscount } = action;
      return {
        ...state,
        selectedDiscount,
      };
    case PLANS_BY_TYPE_ACTIONS.SELECT_PLAN:
      const { payload: selectedPlanIndex } = action;
      const _discounts =
        state.plansByType[selectedPlanIndex].billingCycleDetails
          ?.map(mapDiscount)
          .sort(orderDiscount) ?? [];

      return {
        ...state,
        selectedPlanIndex,
        selectedPlan: state.plansByType[selectedPlanIndex],
        discounts: _discounts,
        selectedDiscount: _discounts[0],
      };
    default:
      return state;
  }
};

export const amountByPlanType = (plan) => {
  switch (plan.type) {
    case PLAN_TYPE.byCredit:
      return plan.credits;

    case PLAN_TYPE.byContact:
      return plan.subscriberLimit;

    case PLAN_TYPE.byEmail:
      return plan.emailsByMonth;
    default:
      return plan.credits;
  }
};

export const mapDiscount = (discount) => ({
  id: discount.id,
  subscriptionType: discount.billingCycle,
  numberMonths: getMonthsByCycle(discount.billingCycle),
  discountPercentage: discount.discountPercentage,
});

export const orderDiscount = (currentDiscount, nextDiscount) =>
  currentDiscount.numberMonths - nextDiscount.numberMonths;

export const getMonthsByCycle = (subscriptionType) => {
  switch (subscriptionType) {
    case SUBSCRIPTION_TYPE.monthly:
      return 1;
    case SUBSCRIPTION_TYPE.quarterly:
      return 3;
    case SUBSCRIPTION_TYPE.biyearly:
      return 6;
    case SUBSCRIPTION_TYPE.yearly:
      return 12;
    default:
      return 1;
  }
};
