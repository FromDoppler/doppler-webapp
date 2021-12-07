export const ACTIONS_CAMPAIGNS_SUMMARY = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const mapCampaignsSummary = (campaignsSummary) => [
  {
    id: 1,
    kpiTitleId: 'dashboard.campaigns.totalCampaigns',
    kpiValue: campaignsSummary.totalSentEmails,
    iconClass: 'deliveries',
  },
  {
    id: 2,
    kpiTitleId: 'dashboard.campaigns.totalOpen',
    kpiValue: `${campaignsSummary.totalOpenClicks}%`,
    iconClass: 'open-rate',
  },
  {
    id: 3,
    kpiTitleId: 'dashboard.campaigns.totalCtr',
    kpiValue: `${campaignsSummary.clickThroughRate}%`,
    iconClass: 'ctr',
  },
];

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
