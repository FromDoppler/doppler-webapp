import { AddOnType } from '../../../../doppler-types';
import { InjectAppServices } from '../../../../services/pure-di';
import { ConversationPlan } from './ConversationPlan';
import { OnSitePlan } from './OnSitePlan';
import { PushNotificationPlan } from './PushNotificationPlan';
import { LandingPagesPlan } from './LandingPagesPlan';
import { FormattedNumber } from 'react-intl';

export const formattedNumber = (value, decimals) => {
  const numberFormatOptions = {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };

  return <FormattedNumber value={value} {...numberFormatOptions} />;
};

export const AddOnPlan = InjectAppServices(({ addOnType, addOnPlan, addOnBuyUrl }) => {
  return (
    <>
      {addOnType === AddOnType.Conversations && (
        <ConversationPlan buyUrl={addOnBuyUrl} conversationPlan={addOnPlan}></ConversationPlan>
      )}
      {addOnType === AddOnType.OnSite && (
        <OnSitePlan buyUrl={addOnBuyUrl} onSitePlan={addOnPlan}></OnSitePlan>
      )}
      {addOnType === AddOnType.PushNotifications && (
        <PushNotificationPlan
          buyUrl={addOnBuyUrl}
          pushNotificationPlan={addOnPlan}
        ></PushNotificationPlan>
      )}
      {addOnType === AddOnType.Landings && (
        <LandingPagesPlan buyUrl={addOnBuyUrl} landingPagesPlan={addOnPlan}></LandingPagesPlan>
      )}
    </>
  );
});
