import { PLAN_TYPE } from '../../../../doppler-types';

export const INITIAL_STATE_PLAN_TYPES = {
  planTypes: [],
  plansByType: [],
  sliderValuesRange: [],
  loading: false,
  loadingPlansByType: false,
  hasError: false,
};

export const PLAN_TYPES_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  FETCHING_PLANS_BY_TYPE_STARTED: 'FETCHING_PLANS_BY_TYPE_STARTED',
  RECEIVE_PLAN_TYPES: 'RECEIVE_PLAN_TYPES',
  RECEIVE_PLANS_BY_TYPES: 'RECEIVE_PLANS_BY_TYPES',
  FETCH_FAILED: 'FETCH_FAILED',
};

export const planTypesReducer = (state, action) => {
  switch (action.type) {
    case PLAN_TYPES_ACTIONS.FETCHING_STARTED:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case PLAN_TYPES_ACTIONS.FETCHING_PLANS_BY_TYPE_STARTED:
      return {
        ...state,
        loadingPlansByType: true,
        hasError: false,
      };
    case PLAN_TYPES_ACTIONS.RECEIVE_PLAN_TYPES:
      const { payload: planTypes } = action;
      return {
        ...state,
        loading: false,
        planTypes,
      };
    case PLAN_TYPES_ACTIONS.RECEIVE_PLANS_BY_TYPES:
      const { payload: plansByType } = action;
      const sliderValuesRange = plansByType.map(amountByPlanType);

      return {
        ...state,
        loadingPlansByType: false,
        plansByType,
        sliderValuesRange,
      };
    case PLAN_TYPES_ACTIONS.FETCH_FAILED:
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
  }
};
