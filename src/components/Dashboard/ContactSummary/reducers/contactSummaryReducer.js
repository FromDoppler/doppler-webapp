export const ACTIONS_CONTACTS_SUMMARY = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const mapContactSummary = (contactSummary) => [
  {
    id: 1,
    kpiTitleId: 'dashboard.contacts.totalContacts',
    kpiValue: contactSummary.totalSubscribers,
    iconClass: 'book',
    kpiPeriodId: 'dashboard.total',
  },
  {
    id: 2,
    kpiTitleId: 'dashboard.contacts.totalNewContacts',
    kpiValue: contactSummary.newSubscribers,
    iconClass: 'user-new',
  },
  {
    id: 3,
    kpiTitleId: 'dashboard.contacts.totalRemovedContacts',
    kpiValue: contactSummary.removedSubscribers,
    iconClass: 'user-removed',
  },
];

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
