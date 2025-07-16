import { useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../doppler-types';

export const EmailMarketingPlan = ({ plan }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <article className="dp-wrapper-plan">
      <header>
        <div className="dp-title-plan">
          <h3 className="dp-second-order-title">
            <span className="p-r-8 m-r-6">{_(`my_plan.subscription_details.title`)}</span>
            <span className="dpicon iconapp-email-alert"></span>
          </h3>
          <p>
            {_(`my_plan.subscription_details.plan_type_${plan.planType.replace('-', '_')}_label`)}
          </p>
        </div>
        <div className="dp-buttons--plan">
          <a
            type="button"
            className="dp-button button-medium primary-green dp-w-100 m-b-12"
            href={plan.buttonUrl}
          >
            {_(`my_plan.subscription_details.change_plan_button`)}
          </a>
        </div>
      </header>
      <ul className="dp-item--plan">
        <li>
          {plan.planType === PLAN_TYPE.byContact ? (
            <p>
              <strong>{`${plan.maxSubscribers} ${plan.itemDescription}`}</strong>
            </p>
          ) : (
            plan.planType === PLAN_TYPE.byEmail && (
              <p>{`${plan.remainingCredits} ${_(
                `my_plan.subscription_details.available_emails`,
              )}`}</p>
            )
          )}
          {plan.planType === PLAN_TYPE.byCredit ? (
            <p>{`${plan.remainingCredits} ${plan.description}`}</p>
          ) : (
            plan.planType === PLAN_TYPE.byContact && (
              <p>{`${plan.remainingCredits}/${plan.maxSubscribers} ${
                plan.planType === PLAN_TYPE.byContact || plan.planType === PLAN_TYPE.free
                  ? _(`my_plan.subscription_details.available_contacts`)
                  : ''
              }`}</p>
            )
          )}
        </li>
        {plan.planType === PLAN_TYPE.byContact && (
          <li>
            <p>
              <strong>{_(`my_plan.subscription_details.unlimited_emails`)}</strong>
            </p>
          </li>
        )}
        {plan.planType === PLAN_TYPE.byContact || plan.planType === PLAN_TYPE.byEmail ? (
          <li>
            <p>
              <strong>{_(`my_plan.subscription_details.billing.title`)}</strong>
            </p>
            <p>{_(`my_plan.subscription_details.billing.type_${plan.planSubscription}`)}</p>
          </li>
        ) : (
          plan.planType === PLAN_TYPE.byCredit && (
            <li>
              <p>
                <strong>{_(`my_plan.subscription_details.billing.title`)}</strong>
              </p>
              <p>{_(`my_plan.subscription_details.billing.single_payment`)}</p>
            </li>
          )
        )}
      </ul>
    </article>
  );
};
