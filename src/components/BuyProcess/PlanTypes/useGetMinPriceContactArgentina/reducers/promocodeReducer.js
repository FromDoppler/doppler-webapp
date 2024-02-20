export const INITIAL_STATE_PROMOCODE = {
  promotion: {
    isValid: false,
  },
  loading: false,
  error: null,
  amountDetailsData: null,
};

export const PROMOCODE_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  FINISH_FETCH: 'FINISH_FETCH',
  SAVE_MIN_PRICE: 'SAVE_MIN_PRICE',
  FETCH_FAILED: 'FETCH_FAILED',
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
        amountDetailsData: null,
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
      };
    case PROMOCODE_ACTIONS.SAVE_MIN_PRICE:
      const { amountDetailsData } = action.payload;

      return {
        ...state,
        amountDetailsData,
      };

    case PROMOCODE_ACTIONS.FETCH_FAILED:
      const { payload: errorKey } = action;
      return {
        ...state,
        loading: false,
        error: errorKey,
        amountDetailsData: null,
      };
    default:
      return state;
  }
};
