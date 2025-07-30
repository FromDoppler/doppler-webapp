import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import { GrayCard } from '../GrayCard';
import { Conversations } from './Conversations';
import { CustomReports } from './CustomReports';
import { DedicatedEnvironment } from './DedicatedEnvironment';
import { DedicatedIP } from './DedicatedIP';
import { LandingPages } from './LandingPages';
import { LayoutService } from './LayoutService';
import { ListConditioning } from './ListConditioning';
import { OnSite } from './OnSite';
import { PushNotification } from './PushNotification';
import { Sms } from './Sms';
import { TransactionalEmails } from './TransactionalEmails';
import { Collaborators } from './Collaborators';

export const AddOns = InjectAppServices(({ dependencies: { appSessionRef } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const { sms, landings, chat, onSite, pushNotification, plan } =
    appSessionRef.current.userData.user;

  var hasLandings = landings?.landingPacks.filter((lp) => lp.packageQty > 0).length > 0;
  var hasSms = sms.remainingCredits > 0;
  var hasConversations = chat.plan?.active;
  var hasOnsite = onSite.plan?.active;
  var hasPushNotification = pushNotification.plan?.active;
  const canBuyPushNotificationPlan =
    process.env.REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN === 'true';

  const goToRequestConsulting = () => {
    window.location.href = '/additional-services';
  };

  const goToAddtionalService = () => {
    window.location.href = '/my-plan?selected-tab=addOns';
  };

  return (
    <div className="dp-container col-p-l-0 col-p-r-0">
      <div className="dp-rowflex">
        <div className="col-lg-8 col-md-12 m-b-24">
          {!hasConversations && !plan.isFreeAccount && (
            <Conversations conversation={chat}></Conversations>
          )}
          {!hasPushNotification && !plan.isFreeAccount && canBuyPushNotificationPlan && (
            <PushNotification pushNotification={pushNotification}></PushNotification>
          )}
          {!hasOnsite && !plan.isFreeAccount && <OnSite onSite={onSite}></OnSite>}
          {!hasSms && <Sms sms={sms} isFreeAccount={plan.isFreeAccount}></Sms>}
          <TransactionalEmails></TransactionalEmails>
          {!hasLandings && <LandingPages></LandingPages>}
          <Collaborators></Collaborators>
          <ListConditioning></ListConditioning>
          <CustomReports></CustomReports>
          <LayoutService></LayoutService>
          <DedicatedEnvironment></DedicatedEnvironment>
          <DedicatedIP></DedicatedIP>
        </div>
        <div className="col-lg-4 col-sm-12">
          <div className="dp-box-shadow">
            <GrayCard
              title={_(`my_plan.addons.cards.card_1.title`)}
              subtitle={_(`my_plan.addons.cards.card_1.subtitle`)}
              description={_(`my_plan.addons.cards.card_1.description`)}
              button={_(`my_plan.addons.cards.card_1.button`)}
              handleClick={() => goToRequestConsulting()}
            ></GrayCard>
          </div>
          <div className="dp-box-shadow m-t-18 m-b-18">
            <GrayCard
              title={_(`my_plan.addons.cards.card_2.title`)}
              subtitle={_(`my_plan.addons.cards.card_2.subtitle`)}
              description={_(`my_plan.addons.cards.card_2.description`)}
              button={_(`my_plan.addons.cards.card_2.button`)}
              handleClick={() => goToAddtionalService()}
            ></GrayCard>
          </div>
        </div>
      </div>
    </div>
  );
});
