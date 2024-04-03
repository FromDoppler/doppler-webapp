import { useEffect, useReducer } from 'react';
import {
  INITIAL_STATE_LANDING_PACKS,
  LANDING_PACKS_ACTIONS,
  landingPacksReducer,
} from './reducers/index.js';

export const useFetchLandingPacks = (dopplerAccountPlansApiClient) => {
  const [state, dispatch] = useReducer(landingPacksReducer, INITIAL_STATE_LANDING_PACKS);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: LANDING_PACKS_ACTIONS.FETCHING_STARTED });
      const response = await dopplerAccountPlansApiClient.getLandingPacks();
      if (response.success) {
        dispatch({
          type: LANDING_PACKS_ACTIONS.FINISH_FETCH,
          payload: {
            landingPacks: response.value,
          },
        });
      } else {
        dispatch({ type: LANDING_PACKS_ACTIONS.FETCH_FAILED });
      }
    };

    fetchData();
  }, [dopplerAccountPlansApiClient]);

  return state;
};
