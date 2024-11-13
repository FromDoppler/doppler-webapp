import { useEffect, useReducer } from 'react';
import {
  ONSITE_PLANS_ACTIONS,
  INITIAL_STATE_ONSITE_PLANS,
  onSitePlansReducer,
} from './onSitePlansReducer';

export const useOnSitePlans = (dopplerAccountPlansApiClient, appSessionRef) => {
  const [state, dispatch] = useReducer(onSitePlansReducer, INITIAL_STATE_ONSITE_PLANS);
  const sessionPlan = appSessionRef.current.userData.user;
  const onSitePlan = sessionPlan.onSite.plan;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ONSITE_PLANS_ACTIONS.FETCHING_STARTED });
        const response = await dopplerAccountPlansApiClient.getOnSitePlans();

        var plans = response.value.map((osp) => {
          return { ...osp, active: true };
        });

        if (onSitePlan && onSitePlan.planId > 0) {
          const existsOnSitePlan =
            response.value.filter((cp) => cp.planId === onSitePlan.planId)[0] !== undefined;
          if (!existsOnSitePlan) {
            plans = [...plans, onSitePlan];
          }
        }

        /* Custom conversations plans */
        var customPlansResponse = await dopplerAccountPlansApiClient.getCustomOnSitePlans();
        var customOnSitePlans = customPlansResponse.value;

        dispatch({
          type: ONSITE_PLANS_ACTIONS.RECEIVE_ONSITE_PLANS,
          payload: {
            onSitePlans: plans,
            customOnSitePlans: customOnSitePlans,
            currentOnSitePlan: { printQty: onSitePlan?.printQty ?? 0 },
          },
        });
      } catch (error) {
        dispatch({ type: ONSITE_PLANS_ACTIONS.FETCH_FAILED });
      }
    };

    fetchData();
  }, [dopplerAccountPlansApiClient, onSitePlan]);

  const handleSliderValue = (data) => {
    dispatch({
      type: ONSITE_PLANS_ACTIONS.SELECT_PLAN,
      payload: data,
    });
  };

  return [state, handleSliderValue];
};
