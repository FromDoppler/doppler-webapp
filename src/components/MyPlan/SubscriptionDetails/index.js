import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import { GrayCard } from '../GrayCard';
import { EmailMarketingPlan } from './EmailMarketingPlan';
import { AddOnPlan } from './AddOnPlan';
import { AddOnType } from '../../../doppler-types';
import { SmsPlan } from './SmsPlan';

export const getAddons = (user) => {
  const { chat, landings, onSite, pushNotification } = user;

  var hasLandings = landings?.landingPacks.filter((lp) => lp.packageQty > 0).length > 0;
  const addOns = [
    {
      addOnType: AddOnType.Conversations,
      addOnPlan: {
        quantity: chat.plan.conversationsQty,
        active: chat.plan.active,
        fee: chat.plan.fee,
      },
      active: chat.plan.active,
      buyUrl: '/buy-conversation?buyType=2',
    },
    {
      addOnType: AddOnType.Landings,
      addOnPlan: { landingPacks: landings?.landingPacks, active: hasLandings },
      active: hasLandings,
      buyUrl: '/landing-packages?buyType=3',
    },
    {
      addOnType: AddOnType.OnSite,
      addOnPlan: {
        quantity: onSite.plan.quantity,
        active: onSite.plan.active,
        fee: onSite.plan.fee,
      },
      active: onSite.plan.active,
      buyUrl: '/buy-onsite-plans?buyType=4',
    },
    {
      addOnType: AddOnType.PushNotifications,
      addOnPlan: {
        quantity: pushNotification.plan.quantity,
        active: pushNotification.plan.active,
        fee: pushNotification.plan.fee,
      },
      active: pushNotification.plan.active,
      buyUrl: '/buy-push-notification-plans?buyType=5',
    },
  ];

  return addOns;
};

export const SubscriptionDetails = InjectAppServices(({ dependencies: { appSessionRef } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const requestConsulting = () => {
    window.location.href = '/additional-services';
  };

  const { plan, sms } = appSessionRef.current.userData.user;
  const addOns = getAddons(appSessionRef.current.userData.user).filter((a) => a.active);

  return (
    <div className="dp-container col-p-l-0 col-p-r-0">
      <div className="dp-rowflex">
        <div className="col-lg-9 col-md-12 m-b-24">
          <div className="dp-box-shadow m-b-24">
            <EmailMarketingPlan plan={plan}></EmailMarketingPlan>
          </div>
          {sms.smsEnabled && (
            <div className="dp-box-shadow m-b-24">
              <SmsPlan sms={sms}></SmsPlan>
            </div>
          )}
          {addOns.map((addon, index) => (
            <AddOnPlan
              key={`addon-${index}`}
              addOnType={addon.addOnType}
              addOnPlan={addon.addOnPlan}
              addOnBuyUrl={addon.buyUrl}
            ></AddOnPlan>
          ))}
        </div>
        <div className="col-lg-3 col-sm-12">
          <div className="dp-box-shadow">
            <GrayCard
              title={_(`my_plan.subscription_details.cards.card_1.title`)}
              subtitle={_(`my_plan.subscription_details.cards.card_1.subtitle`)}
              description={_(`my_plan.subscription_details.cards.card_1.description`)}
              button={_(`my_plan.subscription_details.cards.card_1.button`)}
              handleClick={() => requestConsulting()}
            ></GrayCard>
          </div>
        </div>
      </div>
    </div>
  );
});
