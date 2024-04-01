export const INITIAL_STATE_PROMOCODE = {
  promotion: {
    isValid: false,
  },
  loading: false,
  error: null,
  validated: false,
  promocodeApplied: false,
  initialized: true,
};

export const PROMOCODE_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  FINISH_FETCH: 'FINISH_FETCH',
  PROMOCODE_APPLIED: 'PROMOCODE_APPLIED',
  FETCH_FAILED: 'FETCH_FAILED',
  INITIALIZE_STATE: 'INITIALIZE_STATE',
};

export const promocodeReducer = (state, action) => {
  switch (action.type) {
    case PROMOCODE_ACTIONS.FETCHING_STARTED:
      return {
        promotion: {
          isValid: false,
        },
        loading: true,
        error: null,
        validated: false,
        promocodeApplied: false,
        initialized: false,
      };
    case PROMOCODE_ACTIONS.FINISH_FETCH:
      const { payload } = action;

      return {
        ...state,
        loading: false,
        error: null,
        promotion: {
          ...payload,
          isValid: payload.discountPercentage > 0 || payload.extraCredits > 0,
        },
        validated: true,
      };
    case PROMOCODE_ACTIONS.PROMOCODE_APPLIED:
      return state.initialized
        ? state
        : {
            ...state,
            promocodeApplied: true,
          };

    case PROMOCODE_ACTIONS.INITIALIZE_STATE:
      return INITIAL_STATE_PROMOCODE;

    case PROMOCODE_ACTIONS.FETCH_FAILED:
      const { payload: errorKey } = action;
      return {
        ...state,
        loading: false,
        error: errorKey,
        validated: false,
        promocodeApplied: false,
        initialized: false,
      };
    default:
      return state;
  }
};
