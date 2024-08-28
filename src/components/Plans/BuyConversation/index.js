import { InjectAppServices } from '../../../services/pure-di';
import { Navigate } from 'react-router-dom';

export const BuyConversation = InjectAppServices(({ dependencies: { appSessionRef } }) => {
  const sessionPlan = appSessionRef.current.userData.user;
  const { planType, planDiscount, planSubscription, idPlan } = sessionPlan.plan;

  let urlToRedirect = sessionPlan.chat.active
    ? `/plan-chat/premium/${planType}?buyType=2` +
      `&selected-plan=${idPlan}` +
      `${planDiscount ? `&discountId=${planDiscount}` : ''}` +
      `${planSubscription ? `&monthPlan=${planSubscription}` : ''}`
    : `/dashboard`;

  return <Navigate to={urlToRedirect} />;
});
