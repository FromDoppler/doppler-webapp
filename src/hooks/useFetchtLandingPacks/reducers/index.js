export const INITIAL_STATE_LANDING_PACKS = {
  landingPacks: [],
  cheapestLandingPack: null,
  loading: false,
  error: null,
};

export const LANDING_PACKS_ACTIONS = {
  FETCHING_STARTED: 'FETCHING_STARTED',
  FINISH_FETCH: 'FINISH_FETCH',
  FETCH_FAILED: 'FETCH_FAILED',
};

export const landingPacksReducer = (state, action) => {
  switch (action.type) {
    case LANDING_PACKS_ACTIONS.FETCHING_STARTED:
      return {
        ...state,
        loading: true,
      };
    case LANDING_PACKS_ACTIONS.FINISH_FETCH:
      const { payload } = action;

      return {
        ...state,
        loading: false,
        error: null,
        landingPacks: payload.landingPacks,
        cheapestLandingPack: payload.landingPacks?.reduce((previous, current) => {
          return current.price < previous.price ? current : previous;
        }),
      };

    case LANDING_PACKS_ACTIONS.FETCH_FAILED:
      const { payload: errorKey } = action;
      return {
        ...state,
        loading: false,
        error: errorKey,
      };
    default:
      return state;
  }
};
