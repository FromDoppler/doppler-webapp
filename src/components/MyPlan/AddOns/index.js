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

export const AddOns = InjectAppServices(({ dependencies: { appSessionRef } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const { sms, landings, chat, onSite, pushNotification } = appSessionRef.current.userData.user;

  var hasLandings = landings?.landingPacks.filter((lp) => lp.packageQty > 0).length > 0;
  var hasSms = sms.remainingCredits > 0;
  var hasConversations = chat.plan?.active;
  var hasOnsite = onSite.plan?.active;
  var hasPushNotification = pushNotification.plan?.active;

  const goToRequestConsulting = () => {
    window.location.href = '/additional-services';
  };

  return (
    <div className="dp-container col-p-l-0 col-p-r-0">
      <div className="dp-rowflex">
        <div className="col-lg-9 col-md-12 m-b-24">
          <ListConditioning></ListConditioning>
          <CustomReports></CustomReports>
          {!hasSms && <Sms sms={sms}></Sms>}
          <LayoutService></LayoutService>
          <DedicatedEnvironment></DedicatedEnvironment>
          <DedicatedIP></DedicatedIP>
          <TransactionalEmails></TransactionalEmails>
          {!hasLandings && <LandingPages></LandingPages>}
          {!hasConversations && <Conversations conversation={chat}></Conversations>}
          {!hasOnsite && <OnSite onSite={onSite}></OnSite>}
          {!hasPushNotification && (
            <PushNotification pushNotification={pushNotification}></PushNotification>
          )}
        </div>
        <div className="col-lg-3 col-sm-12">
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
              handleClick={() => goToRequestConsulting()}
            ></GrayCard>
          </div>
        </div>
      </div>
    </div>
  );
});
