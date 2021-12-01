import { mapSystemUsageSummary } from '..';

export const PENDING_STATUS = 0;
export const COMPLETED_STATUS = 1;
export const WARNING_STATUS = 2;
export const UNKNOWN_STATUS = 3;

// TODO: move to ActionBox component
export const INFO_BY_STATE = {
  [PENDING_STATUS]: {
    classNames: 'dp-postcard--number',
  },
  [COMPLETED_STATUS]: {
    classNames: 'dp-postcard--success',
  },
  [WARNING_STATUS]: {
    classNames: 'dp-postcard--warning',
  },
};

// TODO: change name to systemUsageSummaryFake and move to FirstSteps component client
export const firstStepsFake = {
  hasListsCreated: false,
  hasDomainsReady: false,
  hasCampaingsCreated: false,
  hasCampaingsSent: false,
};

export const initFirstStepsReducer = (state) => ({
  ...state,
  firstStepsData: mapSystemUsageSummary(state.firstStepsData),
});

export const INITIAL_STATE_FIRST_STEPS = {
  firstStepsData: firstStepsFake,
  loading: false,
  hasError: false,
};

/* 
TODO: change action names 
FETCHING_STARTED -> START_FETCH
RECEIVE_FIRST_STEPS -> FINISH_FETCH 
FETCH_FAILED -> FAIL_FETCH 
*/
export const FIRST_STEPS_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  RECEIVE_FIRST_STEPS: 'RECEIVE_FIRST_STEPS',
  FETCH_FAILED: 'FETCH_FAILED',
};

export const firstStepsReducer = (state, action) => {
  switch (action.type) {
    case FIRST_STEPS_ACTIONS.FETCHING_STARTED:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case FIRST_STEPS_ACTIONS.RECEIVE_FIRST_STEPS:
      const { payload: firstStepsData } = action;
      return {
        ...state,
        loading: false,
        hasError: false,
        firstStepsData,
      };
    case FIRST_STEPS_ACTIONS.FETCH_FAILED:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
