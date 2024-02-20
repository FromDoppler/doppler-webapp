import { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  INITIAL_STATE_PROMOCODE,
  PROMOCODE_ACTIONS,
  promocodeReducer,
} from './reducers/promocodeReducer.js';

const validationsErrorKey = {
  requiredField: 'validation_messages.error_required_field',
  invalidPromocode: 'checkoutProcessForm.purchase_summary.promocode_error_message',
};

export const useGetMinPriceContactArgentina = (
  planService,
  dopplerAccountPlansApiClient,
  planTypes,
  isArgentina,
) => {
  const [state, dispatch] = useReducer(promocodeReducer, INITIAL_STATE_PROMOCODE);
  const minPlanRef = useRef(null);

  const validatePromocode = useCallback(
    async (contactPlanId) => {
      dispatch({ type: PROMOCODE_ACTIONS.FETCHING_STARTED });
      const validateData = await dopplerAccountPlansApiClient.validatePromocode(
        contactPlanId,
        process.env.REACT_APP_PROMOCODE_ARGENTINA,
      );

      if (validateData.success) {
        dispatch({
          type: PROMOCODE_ACTIONS.FINISH_FETCH,
          payload: {
            ...validateData.value,
            promocode: process.env.REACT_APP_PROMOCODE_ARGENTINA,
            planType: 'subscribers',
          },
        });
      } else {
        dispatch({
          type: PROMOCODE_ACTIONS.FETCH_FAILED,
          payload: validationsErrorKey.invalidPromocode,
        });
      }
    },
    [dopplerAccountPlansApiClient],
  );

  useEffect(() => {
    const fetchPlansByContacts = async () => {
      try {
        const _plansByType = await planService.getPlansByType('subscribers');
        const minPlan = _plansByType[0];
        minPlanRef.current = minPlan;
        await validatePromocode(minPlan.id);
      } catch (error) {
        dispatch({
          type: PROMOCODE_ACTIONS.FETCH_FAILED,
          payload: validationsErrorKey.invalidPromocode,
        });
      }
    };

    if (planTypes.length > 0 && isArgentina) {
      fetchPlansByContacts();
    }
  }, [planService, validatePromocode, planTypes, isArgentina]);

  useEffect(() => {
    const fetchData = async () => {
      const amountDetailsData = await dopplerAccountPlansApiClient.getPlanBillingDetailsData(
        minPlanRef.current.id,
        'Marketing',
        0,
        process.env.REACT_APP_PROMOCODE_ARGENTINA,
      );
      dispatch({
        type: PROMOCODE_ACTIONS.SAVE_MIN_PRICE,
        payload: {
          amountDetailsData: amountDetailsData.value,
        },
      });
    };

    if (minPlanRef.current?.id && state.promotion.isValid && !state.amountDetailsData) {
      fetchData();
    }
  }, [dopplerAccountPlansApiClient, state]);

  return state;
};
