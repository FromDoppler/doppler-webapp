import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import { Features } from './Features';
import { GrayCard } from '../GrayCard';
import { PLAN_TYPE } from '../../../doppler-types';

export const SubscriptionDetails = InjectAppServices(({ dependencies: { appSessionRef } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const { plan } = appSessionRef.current.userData.user;

  const buyPlan = () => {
    window.location.href = plan.buttonUrl;
  };

  const requestConsulting = () => {
    window.location.href = '/upgrade-suggestion-form';
  };

  return (
    <div className="dp-container col-p-l-0 col-p-r-0">
      <div className="dp-rowflex">
        <div className="col-lg-8 col-md-12 m-b-24">
          <div className="dp-box-shadow m-b-24">
            <article className="dp-wrapper-plan">
              <header>
                <div className="dp-title-plan">
                  <h3 className="dp-second-order-title">
                    <span className="p-r-8 m-r-6">{_(`my_plan.subscription_details.title`)}</span>
                    <span className="dpicon iconapp-email-alert"></span>
                  </h3>
                  <p>
                    {_(
                      `my_plan.subscription_details.plan_type_${plan.planType.replace(
                        '-',
                        '_',
                      )}_label`,
                    )}
                  </p>
                </div>
                <div className="dp-buttons--plan">
                  <button
                    type="button"
                    className="dp-button button-medium primary-green dp-w-100 m-b-12"
                    onClick={() => buyPlan()}
                  >
                    {_(`my_plan.subscription_details.change_plan_button`)}
                  </button>
                </div>
              </header>
              <ul className="dp-item--plan">
                <li>
                  {(plan.planType === PLAN_TYPE.byContact ||
                    plan.planType === PLAN_TYPE.byEmail) && (
                    <p>
                      <strong>{`${plan.maxSubscribers} ${plan.itemDescription}`}</strong>
                    </p>
                  )}
                  {plan.planType === PLAN_TYPE.byCredit ? (
                    <p>{`${plan.remainingCredits} ${plan.description}`}</p>
                  ) : (
                    <p>{`${plan.remainingCredits}/${plan.maxSubscribers} ${plan.description}`}</p>
                  )}
                </li>
                {plan.planType === PLAN_TYPE.byContact && (
                  <li>
                    <p>
                      <strong>{_(`my_plan.subscription_details.unlimited_emails`)}</strong>
                    </p>
                  </li>
                )}
                {(plan.planType === PLAN_TYPE.byContact || plan.planType === PLAN_TYPE.byEmail) && (
                  <li>
                    <p>
                      <strong>{_(`my_plan.subscription_details.billing.title`)}</strong>
                    </p>
                    <p>{_(`my_plan.subscription_details.billing.type_${plan.planSubscription}`)}</p>
                  </li>
                )}
              </ul>
              <Features></Features>
            </article>
          </div>
        </div>
        <div className="col-lg-4 col-sm-12">
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
