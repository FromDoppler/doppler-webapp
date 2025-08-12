import { FormattedMessage, useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../doppler-types';
import { CancellationAccount } from '../../CancellationAccount';
import { useState } from 'react';

export const EmailMarketingPlan = ({ plan }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [startCancellationFlow, setStartCancellationFlow] = useState(false);
  const showCancellationAccountButton =
    process.env.REACT_APP_DOPPLER_SHOW_CANCELLATION_ACCOUNT_BUTTON === 'true';

  const startCancellationFlowModal = () => {
    setStartCancellationFlow(true);
  };

  const cancelAccount = () => setStartCancellationFlow(false);

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
          {showCancellationAccountButton && plan.isFreeAccount && (
            <button
              className="dp-button button-medium dp-w-100 btn-cancel"
              onClick={() => startCancellationFlowModal()}
            >
              {_(`my_plan.subscription_details.cancel_subscription_button`)}
            </button>
          )}
        </div>
      </header>
      <ul className="dp-item--plan">
        <li>
          {plan.planType === PLAN_TYPE.byContact || plan.isFreeAccount ? (
            <p>
              <strong>
                <FormattedMessage
                  id={`my_plan.subscription_details.plan_type_subscribers_message`}
                  values={{
                    quantity: plan.maxSubscribers,
                  }}
                />
              </strong>
            </p>
          ) : (
            plan.planType === PLAN_TYPE.byEmail && (
              <strong>
                <FormattedMessage
                  id={`my_plan.subscription_details.plan_type_monthly_deliveries_message`}
                  values={{
                    quantity: plan.remainingCredits,
                  }}
                />
              </strong>
            )
          )}
          {plan.planType === PLAN_TYPE.byCredit ? (
            <p>
              <FormattedMessage
                id={`my_plan.subscription_details.plan_type_prepaid_message`}
                values={{
                  quantity: plan.remainingCredits,
                }}
              />
            </p>
          ) : plan.planType === PLAN_TYPE.byContact || plan.isFreeAccount ? (
            <p className="plan-item">{`${plan.remainingCredits}/${plan.maxSubscribers} ${_(
              `my_plan.subscription_details.available_contacts`,
            )}`}</p>
          ) : (
            plan.planType === PLAN_TYPE.byEmail && (
              <p className="plan-item">{`${plan.remainingCredits}/${plan.maxSubscribers} ${_(
                `my_plan.subscription_details.available_emails`,
              )}`}</p>
            )
          )}
        </li>
        <li>
          <p>
            <strong>
              {_(
                `my_plan.subscription_details.${
                  plan.planType === PLAN_TYPE.byContact || plan.isFreeAccount
                    ? 'unlimited_emails'
                    : 'unlimited_contacts'
                }`,
              )}
            </strong>
          </p>
        </li>
        {plan.planType === PLAN_TYPE.byContact || plan.planType === PLAN_TYPE.byEmail ? (
          <li>
            <p>
              <strong>{_(`my_plan.subscription_details.billing.title`)}</strong>
            </p>
            <p className="plan-item">
              {_(`my_plan.subscription_details.billing.type_${plan.planSubscription}`)}
            </p>
          </li>
        ) : (
          plan.planType === PLAN_TYPE.byCredit && (
            <li>
              <p>
                <strong>{_(`my_plan.subscription_details.billing.title`)}</strong>
              </p>
              <p className="plan-item">
                {_(`my_plan.subscription_details.billing.single_payment`)}
              </p>
            </li>
          )
        )}
      </ul>
      {startCancellationFlow && (
        <CancellationAccount handleCancelAccount={cancelAccount}></CancellationAccount>
      )}
    </article>
  );
};
