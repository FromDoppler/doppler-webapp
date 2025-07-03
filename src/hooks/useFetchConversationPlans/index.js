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

        var chatPlans = response.value.map((cp) => {
          return { ...cp, active: true };
        });

        if (chatPlan && chatPlan.planId > 0) {
          const existsChatPlan =
            response.value.filter((cp) => cp.planId === chatPlan.planId)[0] !== undefined;
          if (!existsChatPlan) {
            chatPlans = [...chatPlans, chatPlan];
          }
        }

        /* Custom conversations plans */
        var customPlansResponse = await dopplerAccountPlansApiClient.getCustomCoversationsPlans();
        var customConversationsPlans = customPlansResponse.value;

        dispatch({
          type: CONVERSATION_PLANS_ACTIONS.RECEIVE_CONVERSATION_PLANS,
          payload: {
            conversationPlans: chatPlans,
            customConversationsPlans: customConversationsPlans,
            currentChatPlan: { conversationsQty: chatPlan.conversationsQty, fee: chatPlan.fee },
          },
        });
      } catch (error) {
        dispatch({ type: CONVERSATION_PLANS_ACTIONS.FETCH_FAILED });
      }
    };

    fetchData();
  }, [dopplerAccountPlansApiClient, chatPlan.conversationQty, chatPlan]);

  const handleSliderValue = (data) => {
    dispatch({
      type: CONVERSATION_PLANS_ACTIONS.SELECT_PLAN,
      payload: data,
    });
  };

  return [state, handleSliderValue];
};
