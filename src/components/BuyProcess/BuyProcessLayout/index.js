import { Stepper } from '../Stepper';

export const defaultSteps = [
  {
    label: 'Plan marketing',
    icon: 'dpicon iconapp-email-alert',
    pathname: '/plan-selection/premium',
  },
  {
    label: 'Plan conversaciones',
    icon: 'dpicon iconapp-chatting',
    pathname: '/plan-chat',
  },
  {
    label: 'Finaliza tu compra',
    icon: 'dpicon iconapp-fast-money',
    pathname: '/checkout/premium',
  },
  {
    label: 'Disfruta Doppler',
    icon: 'dpicon iconapp-launch',
    pathname: '/checkout-summary',
  },
];

export const BuyProcessLayout = ({ children }) => {
  return (
    <div className="dp-container">
      <Stepper steps={defaultSteps} />
      <hr />
      {children}
    </div>
  );
};
