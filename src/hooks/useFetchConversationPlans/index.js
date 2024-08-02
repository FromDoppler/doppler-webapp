import { useEffect, useReducer } from 'react';
import {
  CONVERSATION_PLANS_ACTIONS,
  INITIAL_STATE_CONVERSATION_PLANS,
  conversationPlansReducer,
} from './conversationPlansReducer';

export const useConversationPlans = (dopplerAccountPlansApiClient, appSessionRef) => {
  const [state, dispatch] = useReducer(conversationPlansReducer, INITIAL_STATE_CONVERSATION_PLANS);
  const sessionPlan = appSessionRef.current.userData.user;

  const chatPlan = sessionPlan.chat.plan;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: CONVERSATION_PLANS_ACTIONS.FETCHING_STARTED });
        const response = await dopplerAccountPlansApiClient.getCoversationsPLans();
        dispatch({
          type: CONVERSATION_PLANS_ACTIONS.RECEIVE_CONVERSATION_PLANS,
          payload: {
            conversationPlans: response.value,
            currentChatPlan: { conversationsQty: chatPlan.conversationQty },
          },
        });
      } catch (error) {
        dispatch({ type: CONVERSATION_PLANS_ACTIONS.FETCH_FAILED });
      }
    };

    fetchData();
  }, [dopplerAccountPlansApiClient, chatPlan.conversationQty]);

  const handleSliderValue = (data) => {
    dispatch({
      type: CONVERSATION_PLANS_ACTIONS.SELECT_PLAN,
      payload: data,
    });
  };

  return [state, handleSliderValue];
};
