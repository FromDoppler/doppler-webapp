import { PLAN_TYPE } from '../../../../doppler-types';

export const INITIAL_STATE_CHECKOUT_SUMMARY = {
  billingCountry: '',
  paymentMethod: '',
  planType: PLAN_TYPE.byCredit,
  discount: '',
  quantity: '',
  extraCredits: 0,
  remainingCredits: 0,
  loading: false,
  hasError: false,
  chatUserPlan: null,
};

export const CHECKOUT_SUMMARY_ACTIONS = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const getQuantity = (planType, plan) => {
  switch (planType) {
    case PLAN_TYPE.byCredit:
    case PLAN_TYPE.byEmail:
      return plan?.emailQty;
    case PLAN_TYPE.byContact:
      return plan?.subscribersQty;
    default:
      return 0;
  }
};

export const checkoutSummaryReducer = (state, action) => {
  switch (action.type) {
    case CHECKOUT_SUMMARY_ACTIONS.START_FETCH:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case CHECKOUT_SUMMARY_ACTIONS.FINISH_FETCH:
      const {
        payload: {
          billingInformation,
          currentUserPlan,
          extraCredits,
          discount,
          paymentMethod,
          chatUserPlan,
        },
      } = action;
      const planType = currentUserPlan.planType;

      return {
        loading: false,
        hasError: false,
        billingCountry: billingInformation.country,
        paymentMethod,
        planType,
        discount: discount ?? '',
        quantity: getQuantity(planType, currentUserPlan),
        extraCredits,
        remainingCredits: currentUserPlan.remainingCredits,
        chatUserPlan,
      };

    case CHECKOUT_SUMMARY_ACTIONS.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
