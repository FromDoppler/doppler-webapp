import { useEffect, useReducer } from 'react';
import {
  ADDON_PLANS_ACTIONS,
  INITIAL_STATE_ADDON_PLANS,
  addOnPlansReducer,
} from './addOnPlansReducer';
import { AddOnType } from '../../doppler-types';

export const useAddOnPlans = (addOnType, dopplerAccountPlansApiClient, appSessionRef) => {
  const [state, dispatch] = useReducer(addOnPlansReducer, INITIAL_STATE_ADDON_PLANS);
  const sessionPlan = appSessionRef.current.userData.user;
  const addOnPlan =
    AddOnType.OnSite === addOnType ? sessionPlan.onSite.plan : sessionPlan.pushNotification.plan;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ADDON_PLANS_ACTIONS.FETCHING_STARTED });
        const response = await dopplerAccountPlansApiClient.getAddOnPlans(addOnType);

        var plans = response.value.map((aop) => {
          return { ...aop, active: true };
        });

        if (addOnPlan && addOnPlan.planId > 1) {
          const existsAddOnPlan =
            response.value.filter((aop) => aop.planId === addOnPlan.planId)[0] !== undefined;
          if (!existsAddOnPlan) {
            plans = [...plans, addOnPlan];
          }
        }

        /* Custom addon plans */
        var customPlansResponse = await dopplerAccountPlansApiClient.getCustomAddOnPlans(addOnType);
        var customAddOnPlans = customPlansResponse.value;

        dispatch({
          type: ADDON_PLANS_ACTIONS.RECEIVE_ADDON_PLANS,
          payload: {
            addOnPlans: plans,
            customAddOnPlans: customAddOnPlans,
            currentAddOnPlan: {
              quantity: addOnPlan ? (addOnPlan.fee > 0 ? addOnPlan.quantity ?? 0 : 0) : 0,
            },
          },
        });
      } catch (error) {
        dispatch({ type: ADDON_PLANS_ACTIONS.FETCH_FAILED });
      }
    };

    fetchData();
  }, [dopplerAccountPlansApiClient, addOnPlan]);

  const handleSliderValue = (data) => {
    dispatch({
      type: ADDON_PLANS_ACTIONS.SELECT_PLAN,
      payload: data,
    });
  };

  return [state, handleSliderValue];
};
