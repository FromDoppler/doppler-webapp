import { mapContactSummary } from '../../../../services/contactSummary';

export const ACTIONS_CONTACTS_SUMMARY = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const initContactSummaryReducer = (state) => ({
  ...state,
  kpis: mapContactSummary(state.kpis),
});

export const contactSummaryReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS_CONTACTS_SUMMARY.START_FETCH:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case ACTIONS_CONTACTS_SUMMARY.FINISH_FETCH:
      return {
        ...state,
        loading: false,
        kpis: action.payload,
      };
    case ACTIONS_CONTACTS_SUMMARY.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
