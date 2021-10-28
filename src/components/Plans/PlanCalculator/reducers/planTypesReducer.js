export const INITIAL_STATE_PLAN_TYPES = {
  planTypes: [],
  loading: false,
};

export const PLAN_TYPES_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  RECEIVE_PLAN_TYPES: 'RECEIVE_PLAN_TYPES',
};

export const planTypesReducer = (state, action) => {
  switch (action.type) {
    case PLAN_TYPES_ACTIONS.FETCHING_STARTED:
      return {
        ...state,
        loading: true,
      };
    case PLAN_TYPES_ACTIONS.RECEIVE_PLAN_TYPES:
      const { payload: planTypes } = action;
      return {
        ...state,
        loading: false,
        planTypes,
      };
    default:
      return state;
  }
};
