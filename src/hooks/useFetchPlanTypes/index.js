import { useEffect, useReducer } from 'react';
import {
  INITIAL_STATE_PLAN_TYPES,
  PLAN_TYPES_ACTIONS,
  planTypesReducer,
} from './planTypesReducer/index.js';

export const useFetchPlanTypes = (planService) => {
  const [state, dispatch] = useReducer(planTypesReducer, INITIAL_STATE_PLAN_TYPES);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: PLAN_TYPES_ACTIONS.FETCHING_STARTED });
        const _planTypes = await planService.getDistinctPlans();
        dispatch({ type: PLAN_TYPES_ACTIONS.RECEIVE_PLAN_TYPES, payload: _planTypes });
      } catch (error) {
        dispatch({ type: PLAN_TYPES_ACTIONS.FETCH_FAILED });
      }
    };
    fetchData();
  }, [planService]);

  return state;
};
