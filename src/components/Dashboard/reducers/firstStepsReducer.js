import { fakeSystemUsageSummary } from '../../../services/dashboardService/SystemUsageSummary.double';

export const PENDING_STATUS = 0;
export const COMPLETED_STATUS = 1;
export const UNKNOWN_STATUS = 2;

export const initFirstStepsReducer = (state) => ({
  ...state,
  firstStepsData: mapSystemUsageSummary(state.firstStepsData),
});

export const INITIAL_STATE_FIRST_STEPS = {
  firstStepsData: fakeSystemUsageSummary,
  loading: false,
  hasError: false,
};

export const FIRST_STEPS_ACTIONS = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const firstStepsReducer = (state, action) => {
  switch (action.type) {
    case FIRST_STEPS_ACTIONS.START_FETCH:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case FIRST_STEPS_ACTIONS.FINISH_FETCH:
      const { payload: firstStepsData } = action;
      return {
        ...state,
        loading: false,
        hasError: false,
        firstStepsData,
      };
    case FIRST_STEPS_ACTIONS.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};

const isFirstStepsCompleted = (systemUsageSummary) => {
  const {
    hasListsCreated,
    hasCampaingsCreated,
    hasDomainsReady,
    hasCampaingsSent,
    reportsSectionLastVisit,
  } = systemUsageSummary;

  return (
    hasListsCreated === true &&
    hasCampaingsCreated === true &&
    hasDomainsReady === true &&
    hasCampaingsSent === true &&
    reportsSectionLastVisit
  );
};

const getListCreatedStep = (hasListsCreated) => ({
  status: hasListsCreated
    ? COMPLETED_STATUS
    : hasListsCreated === false
      ? PENDING_STATUS
      : UNKNOWN_STATUS,
  titleId: 'dashboard.first_steps.has_list_created_title',
  descriptionId: 'dashboard.first_steps.has_list_created_description_MD',
  textStep: 1,
  trackingId: 'dashboard-firstSteps-line1',
  link: 'dashboard.first_steps.has_list_created_url',
});

const getDomainsReadyStep = (hasDomainsReady) => ({
  status: hasDomainsReady
    ? COMPLETED_STATUS
    : hasDomainsReady === false
      ? PENDING_STATUS
      : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_domains_ready_title`,
  descriptionId: 'dashboard.first_steps.has_domains_ready_description_MD',
  textStep: 2,
  trackingId: 'dashboard-firstSteps-line2',
  link: 'dashboard.first_steps.has_domains_ready_url',
});

const getCampaingsCreatedAndSentStep = (hasCampaingsCreatedAndSent) => ({
  status: hasCampaingsCreatedAndSent
    ? COMPLETED_STATUS
    : hasCampaingsCreatedAndSent === false
      ? PENDING_STATUS
      : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_campaings_created_title`,
  descriptionId: 'dashboard.first_steps.has_campaings_created_description_MD',
  textStep: 3,
  trackingId: 'dashboard-firstSteps-line3',
  link: 'dashboard.first_steps.has_campaings_created_url',
});

const getCampaingsSentStep = (hasCampaingsSent, reportsSectionLastVisit) => ({
  status:
    hasCampaingsSent && reportsSectionLastVisit
      ? COMPLETED_STATUS
      : hasCampaingsSent === false || !reportsSectionLastVisit
        ? PENDING_STATUS
        : UNKNOWN_STATUS,
  titleId: `dashboard.first_steps.has_campaings_sent_title`,
  descriptionId: 'dashboard.first_steps.has_campaings_sent_description_MD',
  textStep: 4,
  trackingId: 'dashboard-firstSteps-line4',
  link: 'dashboard.first_steps.has_campaings_sent_url',
});

export const mapSystemUsageSummary = (systemUsageSummary) => {
  const {
    hasListsCreated,
    hasCampaingsCreated,
    hasDomainsReady,
    hasCampaingsSent,
    reportsSectionLastVisit,
    firstStepsClosedSince,
  } = systemUsageSummary;

  return {
    completed: isFirstStepsCompleted(systemUsageSummary),
    firstStepsClosedSince,
    firstSteps: [
      getListCreatedStep(hasListsCreated),
      getDomainsReadyStep(hasDomainsReady),
      getCampaingsCreatedAndSentStep(hasCampaingsCreated && hasCampaingsSent),
      getCampaingsSentStep(hasCampaingsSent, reportsSectionLastVisit),
    ],
  };
};
