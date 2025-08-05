import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { formattedNumber } from '..';
import { useEffect, useState } from 'react';
import { AddOnType } from '../../../../../doppler-types';
import { Loading } from '../../../../Loading/Loading';

export const Collaborators = InjectAppServices(
  ({
    buyUrl,
    pushNotificationPlan,
    isFreeAccount,
    dependencies: { dopplerUserApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [availableQuantity, setAvailableQuantity] = useState(pushNotificationPlan.quantity);
    const [collaborators, setCollaborators] = useState(['a']); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
          const fetchData = async () => {
            if (!isFreeAccount) {
                const invitations = await dopplerUserApiClient.getCollaborationInvites();
                if (invitations.success) {
                    setCollaborators(invitations.value);
                }
            }

            setLoading(false);
          };
    
          fetchData();
        }, [dopplerUserApiClient]);

    if (loading) {
      return <Loading page />;
    }

    return (
    {collaborators.lenght > 0 && (
      <div className="dp-box-shadow m-b-24">
        <article className="dp-wrapper-plan">
          <header>
            <div className="dp-title-plan">
              <h3 className="dp-second-order-title">
                <span className="p-r-8 m-r-6">
                  {_(`my_plan.subscription_details.addon.push_notification_plan.title`)}
                </span>
                <span className={`dpicon iconapp-bell1`}></span>
              </h3>
              {plan.fee === 0 && (
                <p>
                  {_(
                    `my_plan.subscription_details.addon.onsite_plan.${
                      isFreeAccount && !plan.active ? 'start_free_label' : 'free_label'
                    }`,
                  )}
                </p>
              )}
            </div>
            <div className="dp-buttons--plan">
              <a
                type="button"
                href={buyUrl}
                className="dp-button button-medium primary-green dp-w-100 m-b-12"
              >
                {_(
                  `my_plan.subscription_details.${
                    isFreeAccount && !plan.active ? 'start_test_button' : 'change_plan_button'
                  }`,
                )}
              </a>
            </div>
          </header>
          <ul className="dp-item--plan">
            <li>
              <p>
                <strong>
                  <FormattedMessage
                    id={'my_plan.subscription_details.addon.push_notification_plan.plan_message'}
                    values={{
                      total: plan.quantity,
                    }}
                  />
                </strong>
              </p>
              <div className="dp-rowflex">
                <div className="col-lg-5 col-md-12">
                  <p className="plan-item">
                    <FormattedMessage
                      id={`my_plan.subscription_details.addon.push_notification_plan.available_message`}
                      values={{
                        available: availableQuantity,
                        total: plan.quantity,
                      }}
                    />
                  </p>
                </div>
                <div className="col-lg-4 col-md-12">
                  <p className="plan-item m-l-12">
                    {!isFreeAccount && plan.fee > 0 ? (
                      <FormattedMessage
                        id={`my_plan.subscription_details.addon.push_notification_plan.additional_email_message`}
                        values={{
                          price: formattedNumber(plan.additional, 4),
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        id={`my_plan.subscription_details.addon.push_notification_plan.free_additional_email_message`}
                      />
                    )}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </article>
      </div>
      )}
    );
  },
);
