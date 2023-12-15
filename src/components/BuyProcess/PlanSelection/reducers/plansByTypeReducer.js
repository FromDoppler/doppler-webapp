import { PLAN_TYPE, SUBSCRIPTION_TYPE } from '../../../../doppler-types';
import { amountByPlanType } from '../../../../utils';

export const INITIAL_STATE_PLANS_BY_TYPE = {
  currentSubscriptionIndexUser: 0,
  currentPlanUser: 0,
  selectedPlanIndex: 0,
  selectedPlan: null,
  plansByType: [],
  sliderValuesRange: [],
  discounts: [],
  selectedDiscount: null,
  selectedDiscountIndex: 0,
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
      const { plansByType, currentSubscriptionUser, currentPlanType } = action.payload;
      const sliderValuesRange = plansByType.map(amountByPlanType);
      const discounts =
        plansByType[0]?.billingCycleDetails?.map(mapDiscount).sort(orderDiscount) ?? [];
      const selectDiscountIndexByDefault = discounts.findIndex(
        (discount) => discount.numberMonths === currentSubscriptionUser,
      );
      return {
        ...state,
        currentSubscriptionIndexUser: selectDiscountIndexByDefault,
        currentPlanUser: currentPlanType === PLAN_TYPE.free ? 0 : plansByType[0].id,
        selectedPlanIndex: 0,
        selectedPlan: plansByType[0], // Assuming that there is at leas one plan
        loading: false,
        plansByType,
        sliderValuesRange,
        discounts,
        selectedDiscount: discounts[selectDiscountIndexByDefault],
        selectedDiscountIndex: selectDiscountIndexByDefault,
      };
    case PLANS_BY_TYPE_ACTIONS.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    case PLANS_BY_TYPE_ACTIONS.SELECT_DISCOUNT:
      const { payload: selectedDiscount } = action;
      const selectDiscountIndexAux = state.discounts.indexOf(selectedDiscount);
      const selectedDiscountIndex = selectDiscountIndexAux !== -1 ? selectDiscountIndexAux : 0;

      return {
        ...state,
        selectedDiscount: state.discounts[selectedDiscountIndex],
        selectedDiscountIndex,
      };
    case PLANS_BY_TYPE_ACTIONS.SELECT_PLAN:
      const { payload: selectedPlanIndex } = action;

      const _discounts =
        state.plansByType[selectedPlanIndex].billingCycleDetails
          ?.map(mapDiscount)
          .sort(orderDiscount) ?? [];

      const selectedDiscountIndexAux =
        state.currentPlanUser === state.plansByType[selectedPlanIndex].id
          ? state.currentSubscriptionIndexUser
          : _discounts[state.selectedDiscountIndex]
            ? state.selectedDiscountIndex
            : 0;

      return {
        ...state,
        selectedPlanIndex,
        selectedPlan: state.plansByType[selectedPlanIndex],
        discounts: _discounts,
        selectedDiscount: _discounts[selectedDiscountIndexAux],
        selectedDiscountIndex: selectedDiscountIndexAux,
      };
    default:
      return state;
  }
};

export const mapDiscount = (discount) => ({
  id: discount.id,
  subscriptionType: discount.billingCycle,
  numberMonths: getMonthsByCycle(discount.billingCycle),
  discountPercentage: discount.discountPercentage,
  applyPromo: discount.applyPromo,
});

export const orderDiscount = (currentDiscount, nextDiscount) =>
  nextDiscount.numberMonths - currentDiscount.numberMonths;

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
