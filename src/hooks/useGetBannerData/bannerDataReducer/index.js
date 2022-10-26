export const INITIAL_STATE_BANNER_DATA = {
  bannerData: null,
  loading: true,
  hasError: false,
};

export const BANNER_DATA_ACTIONS = {
  START_FETCH: 'START_FETCH',
  FINISH_FETCH: 'FINISH_FETCH',
  FAIL_FETCH: 'FAIL_FETCH',
};

export const bannerDataReducer = (state, action) => {
  switch (action.type) {
    case BANNER_DATA_ACTIONS.START_FETCH:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case BANNER_DATA_ACTIONS.FINISH_FETCH:
      const { payload } = action;

      return {
        ...state,
        bannerData: payload,
        loading: false,
        hasError: false,
      };
    case BANNER_DATA_ACTIONS.FAIL_FETCH:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
