export const INITIAL_STATE_DELETE_LANDING_PAGES = {
  loading: false,
  error: null,
  success: false,
  initialized: true,
  removed: false,
};

export const DELETE_LANDING_PAGES_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  FINISH_FETCH: 'FINISH_FETCH',
  FETCH_FAILED: 'FETCH_FAILED',
  REMOVED: 'REMOVED',
  INITIALIZE: 'INITIALIZE',
};

export const deleteLandingPagesReducer = (state, action) => {
  switch (action.type) {
    case DELETE_LANDING_PAGES_ACTIONS.FETCHING_STARTED:
      return {
        loading: true,
        error: null,
        success: false,
        initialized: false,
        removed: false,
      };
    case DELETE_LANDING_PAGES_ACTIONS.FINISH_FETCH:
      return {
        loading: false,
        error: null,
        success: true,
        initialized: false,
        removed: true,
      };

    case DELETE_LANDING_PAGES_ACTIONS.FETCH_FAILED:
      const { payload: errorKey } = action;
      return {
        loading: false,
        error: errorKey,
        success: false,
        initialized: false,
        removed: false,
      };

    case DELETE_LANDING_PAGES_ACTIONS.REMOVED:
      return {
        ...state,
        removed: true,
      };

    case DELETE_LANDING_PAGES_ACTIONS.INITIALIZE:
      return { ...INITIAL_STATE_DELETE_LANDING_PAGES, removed: true };
    default:
      return state;
  }
};
