export const INITIAL_STATE_PLAN_TYPES = {
  planTypes: [],
  loading: true,
  hasError: false,
};

export const PLAN_TYPES_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  RECEIVE_PLAN_TYPES: 'RECEIVE_PLAN_TYPES',
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
    case PLAN_TYPES_ACTIONS.RECEIVE_PLAN_TYPES:
      const { payload: planTypes } = action;
      return {
        ...state,
        loading: false,
        planTypes,
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
