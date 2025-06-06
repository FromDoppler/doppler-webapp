import {
  BUY_CHAT_PLAN,
  BUY_LANDING_PACK,
  BUY_MARKETING_PLAN,
  BUY_ONSITE_PLAN,
  BUY_PUSH_NOTIFICATION_PLAN,
} from '../../../doppler-types';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { InjectAppServices } from '../../../services/pure-di';
import { Stepper } from '../Stepper';

export const getSteps = (buyType, user) => {
  const chat = user.chat;

  const steps = [
    {
      id: 1,
      label: 'buy_process.stepper.email_marketing_plan_step',
      icon: 'dpicon iconapp-email-alert',
      pathname: '/plan-selection/premium',
      visible: buyType === BUY_MARKETING_PLAN.toString(),
    },
    {
      id: 2,
      label: 'buy_process.stepper.conversation_plan_step',
      icon: 'dpicon iconapp-chatting',
      pathname: '/plan-chat',
      visible:
        (buyType === BUY_MARKETING_PLAN.toString() || buyType === BUY_CHAT_PLAN.toString()) &&
        chat !== null,
    },
    {
      id: 3,
      label: 'buy_process.stepper.landings_plan_step',
      icon: 'dpicon iconapp-chatting',
      pathname: '/landing-packages',
      visible: buyType === BUY_LANDING_PACK.toString(),
    },
    {
      id: 4,
      label: 'buy_process.stepper.onsite_plan_step',
      icon: 'dpicon iconapp-chatting',
      pathname: '/buy-onsite-plans',
      visible: buyType === BUY_ONSITE_PLAN.toString(),
    },
    {
      id: 5,
      label: 'buy_process.stepper.push_notification_plan_step',
      icon: 'dpicon iconapp-chatting',
      pathname: '/buy-push-notification-plans',
      visible: buyType === BUY_PUSH_NOTIFICATION_PLAN.toString(),
    },
    {
      id: 5,
      label: 'buy_process.stepper.finalize_purchase_step',
      icon: 'dpicon iconapp-fast-money',
      pathname: '/checkout/premium',
      visible: true,
    },
    {
      id: 6,
      label: 'buy_process.stepper.enjoy_doppler_step',
      icon: 'dpicon iconapp-launch',
      pathname: '/checkout-summary',
      visible: true,
    },
  ];

  return steps;
};

export const BuyProcessLayout = InjectAppServices(
  ({ children, dependencies: { appSessionRef } }) => {
    const query = useQueryParams();
    const buyType = query.get('buyType') ?? '1';
    let steps = getSteps(buyType, appSessionRef.current.userData.user).filter(
      (s) => s.visible === true,
    );

    return (
      <div className="dp-container">
        <Stepper steps={steps} />
        <hr />
        {children}
      </div>
    );
  },
);
