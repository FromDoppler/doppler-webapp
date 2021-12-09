import { mapCampaignsSummary } from '../../../../services/campaignSummary';

export const ACTIONS_CAMPAIGNS_SUMMARY = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const initCampaignSummaryReducer = (state) => ({
  ...state,
  kpis: mapCampaignsSummary(state.kpis),
});

export const campaignSummaryReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS_CAMPAIGNS_SUMMARY.START_FETCH:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case ACTIONS_CAMPAIGNS_SUMMARY.FINISH_FETCH:
      return {
        ...state,
        loading: false,
        kpis: action.payload,
      };
    case ACTIONS_CAMPAIGNS_SUMMARY.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
