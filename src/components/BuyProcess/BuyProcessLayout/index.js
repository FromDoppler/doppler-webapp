import {
  BUY_ECO_IA_PLAN,
  BUY_CHAT_PLAN,
  BUY_LANDING_PACK,
  BUY_MARKETING_PLAN,
  BUY_ONSITE_PLAN,
  BUY_PUSH_NOTIFICATION_PLAN,
} from '../../../doppler-types';
import { useLocation } from 'react-router-dom';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { InjectAppServices } from '../../../services/pure-di';
import { Stepper } from '../Stepper';

export const getSteps = (buyType, user, pathname) => {
  const currentPathname = pathname.includes('/new-plan-selection')
    ? '/new-plan-selection'
    : '/plan-selection/premium';
  const steps = [
    {
      id: 1,
      label: 'buy_process.stepper.email_marketing_plan_step',
      icon: 'dpicon iconapp-email-alert',
      pathname: currentPathname,
      visible: buyType === BUY_MARKETING_PLAN.toString(),
    },
    {
      id: 2,
      label: 'buy_process.stepper.conversation_plan_step',
      icon: 'dpicon iconapp-chatting',
      pathname: '/buy-conversation',
      visible: buyType === BUY_CHAT_PLAN.toString(),
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
      id: 6,
      label: 'buy_process.stepper.eco_ai_plan_step',
      icon: 'dpicon iconapp-chatting',
      pathname: '/buy-ecoia-plan',
      visible: buyType === BUY_ECO_IA_PLAN.toString(),
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
    const { pathname } = useLocation();
    const query = useQueryParams();
    const buyType = query.get('buyType') ?? '1';
    let steps = getSteps(buyType, appSessionRef.current.userData.user, pathname).filter(
      (s) => s.visible === true,
    );
    const isNewPlanSelection = pathname === '/new-plan-selection';

    if (isNewPlanSelection) {
      return (
        <>
          <div className="dp-container">
            <Stepper steps={steps} />
            <hr />
          </div>
          {children}
        </>
      );
    }

    return (
      <div className="dp-container">
        <Stepper steps={steps} />
        <hr />
        {children}
      </div>
    );
  },
);
