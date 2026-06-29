import { FormattedMessage, useIntl } from 'react-intl';
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
import { EcoAI } from './EcoAI';
import { AddOnType } from '../../../doppler-types';
import { Link } from 'react-router-dom';

export const BuyEmailMaeketingPlanMessage = () => {
  return (
    <div className="dp-wrap-message dp-wrap-info m-b-24">
      <span className="dp-message-icon"></span>
      <div className="dp-content-message dp-content-full">
        <p>
          <FormattedMessage
            id={'my_plan.addons.free_user_message'}
            values={{
              bold: (chunks) => <b>{chunks}</b>,
              br: <br />,
            }}
          />
        </p>
        <Link to="/new-plan-selection" className="dp-message-link">
          <FormattedMessage id="my_plan.addons.free_user_buy_plan_message" />
        </Link>
      </div>
    </div>
  );
};

export const AddOns = InjectAppServices(({ dependencies: { appSessionRef } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const { sms, chat, onSite, pushNotification, plan, addOnPlans } =
    appSessionRef.current.userData.user;
  const ecoIA = addOnPlans?.filter((aop) => aop.plan?.addOnTypeId === AddOnType.EcoAI)[0];

  const canBuyPushNotificationPlan =
    process.env.REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN === 'true';

  const goToRequestConsulting = () => {
    window.location.href = '/additional-services';
  };

  const canBuyAIAgentPlan = appSessionRef?.current?.userData?.features?.ecoIAEnabled;

  return (
    <div className="dp-container col-p-l-0 col-p-r-0">
      <div className="dp-rowflex">
        <div className="col-lg-8 col-md-12 m-b-24">
          {plan.isFreeAccount && <BuyEmailMaeketingPlanMessage></BuyEmailMaeketingPlanMessage>}
          {canBuyAIAgentPlan && <EcoAI ecoIA={ecoIA}></EcoAI>}
          <Conversations conversation={chat}></Conversations>
          {canBuyPushNotificationPlan && (
            <PushNotification pushNotification={pushNotification}></PushNotification>
          )}
          <OnSite onSite={onSite}></OnSite>
          {<Sms sms={sms} isFreeAccount={plan.isFreeAccount}></Sms>}
          <TransactionalEmails></TransactionalEmails>
          {<LandingPages></LandingPages>}
          <Collaborators isFreeAccount={plan.isFreeAccount}></Collaborators>
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
              description={
                <FormattedMessage
                  id={'my_plan.addons.cards.card_1.description'}
                  values={{
                    br: <br />,
                  }}
                />
              }
              button={_(`my_plan.addons.cards.card_1.button`)}
              handleClick={() => goToRequestConsulting()}
            ></GrayCard>
          </div>
        </div>
      </div>
    </div>
  );
});
