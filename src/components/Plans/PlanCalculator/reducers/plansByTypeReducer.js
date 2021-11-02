import { PLAN_TYPE } from '../../../../doppler-types';

export const INITIAL_STATE_PLANS_BY_TYPE = {
  plansByType: [],
  sliderValuesRange: [],
  loading: false,
  hasError: false,
};

export const PLANS_BY_TYPE_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  RECEIVE_PLANS_BY_TYPE: 'RECEIVE_PLANS_BY_TYPE',
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

      return {
        ...state,
        loading: false,
        plansByType,
        sliderValuesRange,
      };
    case PLANS_BY_TYPE_ACTIONS.FETCH_FAILED:
      return {
        ...state,
        loading: false,
        hasError: true,
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
