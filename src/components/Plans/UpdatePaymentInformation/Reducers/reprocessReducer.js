export const INITIAL_STATE_REPROCESS = {
  declinedInvoices: { invoices: [] },
  loading: false,
  hasError: false,
};

export const REPROCESS_ACTIONS = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const reprocessReducer = (state, action) => {
  switch (action.type) {
    case REPROCESS_ACTIONS.START_FETCH:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case REPROCESS_ACTIONS.FINISH_FETCH:
      const {
        payload: { declinedInvoices },
      } = action;

      return {
        loading: false,
        hasError: false,
        declinedInvoices,
      };

    case REPROCESS_ACTIONS.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
