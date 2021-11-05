import { PLAN_TYPE, SUBSCRIPTION_TYPE } from '../../../../doppler-types';

export const INITIAL_STATE_PLANS_BY_TYPE = {
  plansByType: [],
  sliderValuesRange: [],
  discounts: [],
  selectedDiscount: null,
  loading: false,
  hasError: false,
};

export const PLANS_BY_TYPE_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  RECEIVE_PLANS_BY_TYPE: 'RECEIVE_PLANS_BY_TYPE',
  CHANGE_SELECTED_DISCOUNT: 'CHANGE_SELECTED_DISCOUNT',
  SEARCH_DISCOUNTS_BY_INDEX_PLAN: 'SEARCH_DISCOUNTS_BY_INDEX_PLAN',
  FETCH_FAILED: 'FETCH_FAILED',
};

export const plansByTypeReducer = (state, action) => {
  switch (action.type) {
    case PLANS_BY_TYPE_ACTIONS.FETCHING_STARTED:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case PLANS_BY_TYPE_ACTIONS.RECEIVE_PLANS_BY_TYPE:
      const { payload: plansByType } = action;
      const sliderValuesRange = plansByType.map(amountByPlanType);
      const discounts = plansByType[0].billingCycleDetails?.map(mapDiscount) ?? [];
      return {
        ...state,
        loading: false,
        plansByType,
        sliderValuesRange,
        discounts,
        selectedDiscount: discounts[0],
      };
    case PLANS_BY_TYPE_ACTIONS.FETCH_FAILED:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    case PLANS_BY_TYPE_ACTIONS.CHANGE_SELECTED_DISCOUNT:
      const { payload: selectedDiscount } = action;
      return {
        ...state,
        selectedDiscount,
      };
    case PLANS_BY_TYPE_ACTIONS.SEARCH_DISCOUNTS_BY_INDEX_PLAN:
      const { payload: selectedPlanIndex } = action;
      const _discounts =
        state.plansByType[selectedPlanIndex].billingCycleDetails?.map(mapDiscount) ?? [];

      return {
        ...state,
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
