import { InjectAppServices } from '../../../services/pure-di';
import { Stepper } from '../Stepper';

export const defaultSteps = [
  {
    id: 1,
    label: 'Plan marketing',
    icon: 'dpicon iconapp-email-alert',
    pathname: '/plan-selection/premium',
  },
  {
    id: 2,
    label: 'Plan conversaciones',
    icon: 'dpicon iconapp-chatting',
    pathname: '/plan-chat',
  },
  {
    id: 3,
    label: 'Finaliza tu compra',
    icon: 'dpicon iconapp-fast-money',
    pathname: '/checkout/premium',
  },
  {
    id: 4,
    label: 'Disfruta Doppler',
    icon: 'dpicon iconapp-launch',
    pathname: '/checkout-summary',
  },
];

export const BuyProcessLayout = InjectAppServices(
  ({ children, dependencies: { appSessionRef } }) => {
    const chat = appSessionRef.current.userData.user.chat;

    let steps;
    if (chat && !chat.active) {
      steps = defaultSteps.filter((s) => s.id !== 2);
    } else {
      steps = defaultSteps;
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
