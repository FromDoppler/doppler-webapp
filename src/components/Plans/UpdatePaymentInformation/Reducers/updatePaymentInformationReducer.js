export const INITIAL_STATE_UPDATE_PAYMENT_INFORMATION = {
  paymentMethod: {},
  loading: false,
  hasError: false,
};

export const UPDATE_PAYMENT_INFORMATION_ACTIONS = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const updatePaymentInformationReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_PAYMENT_INFORMATION_ACTIONS.START_FETCH:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case UPDATE_PAYMENT_INFORMATION_ACTIONS.FINISH_FETCH:
      const {
        payload: { paymentMethod },
      } = action;

      return {
        loading: false,
        hasError: false,
        paymentMethod,
      };

    case UPDATE_PAYMENT_INFORMATION_ACTIONS.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
