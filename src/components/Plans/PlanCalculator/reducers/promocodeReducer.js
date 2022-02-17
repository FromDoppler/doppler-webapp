export const INITIAL_STATE_PROMOCODE = {
  promotion: {
    isValid: false,
  },
  loading: false,
  hasError: false,
};

export const PROMOCODE_ACTIONS = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const promocodeReducer = (state, action) => {
  switch (action.type) {
    case PROMOCODE_ACTIONS.START_FETCH:
      return {
        promotion: {
          isValid: false,
        },
        loading: true,
        hasError: false,
      };
    case PROMOCODE_ACTIONS.FINISH_FETCH:
      const { payload } = action;

      return {
        ...state,
        loading: false,
        hasError: false,
        promotion: {
          ...payload,
          isValid: payload.discountPercentage > 0 || payload.extraCredits > 0,
        },
      };
    case PROMOCODE_ACTIONS.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
