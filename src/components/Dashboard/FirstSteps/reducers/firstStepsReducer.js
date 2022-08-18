import { mapSystemUsageSummary } from '..';
import { fakeSystemUsageSummary } from '../../../../services/dashboardService/SystemUsageSummary.double';

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

/* 
TODO: change action names 
FETCHING_STARTED -> START_FETCH
RECEIVE_FIRST_STEPS -> FINISH_FETCH 
FETCH_FAILED -> FAIL_FETCH 
*/
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
