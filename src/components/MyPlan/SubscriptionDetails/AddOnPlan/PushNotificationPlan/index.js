import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { formattedNumber } from '..';
import { useEffect, useState } from 'react';
import { AddOnType } from '../../../../../doppler-types';
import { Loading } from '../../../../Loading/Loading';
import { getPromotionInformationMessage } from '../utils';
import { AddOnPlanCard } from '../AddOnPlanCard';

export const PushNotificationPlan = InjectAppServices(
  ({
    buyUrl,
    pushNotificationPlan,
    isFreeAccount,
    addOnPromotions,
    dependencies: { dopplerAccountPlansApiClient, appSessionRef },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [availableQuantity, setAvailableQuantity] = useState(pushNotificationPlan.quantity);
    const [plan, setPlan] = useState(pushNotificationPlan);
    const [loading, setLoading] = useState(true);
    const showPromotionInformation = addOnPromotions.length > 0 && !pushNotificationPlan.active;
    useEffect(() => {
      const fetchAddOnData = async () => {
        if (!plan.active && (isFreeAccount || addOnPromotions.length > 0)) {
          const getFreeAddOnPlanResponse = await dopplerAccountPlansApiClient.getFreeAddOnPlan(
            AddOnType.PushNotifications,
          );
          if (getFreeAddOnPlanResponse.success) {
            setPlan(getFreeAddOnPlanResponse.value);
            setAvailableQuantity(getFreeAddOnPlanResponse.value.quantity);
          }
        }

        setLoading(false);
      };

      fetchAddOnData();
    }, [dopplerAccountPlansApiClient, plan.active, isFreeAccount, addOnPromotions]);

    if (loading) {
      return <Loading page />;
    }

    return (
      <>
        <AddOnPlanCard
          title={_(`my_plan.subscription_details.addon.push_notification_plan.title`)}
          iconClassName="dpicon iconapp-bell1"
          description={
            !plan.trialExpired && plan.fee === 0 ? (
              <p>
                {_(
                  `my_plan.subscription_details.addon.push_notification_plan.${
                    isFreeAccount && !plan.active ? 'start_free_label' : 'free_label'
                  }`,
                )}
              </p>
            ) : null
          }
          actions={
            <>
              <a
                type="button"
                href={buyUrl}
                className="dp-button button-medium primary-green dp-w-100 m-b-12"
              >
                {_(
                  `my_plan.subscription_details.${
                    plan.trialExpired
                      ? 'view_plans_button'
                      : (isFreeAccount || addOnPromotions.length > 0) && !plan.active
                        ? 'activate_now_button'
                        : 'change_plan_button'
                  }`,
                )}
              </a>
            </>
          }
          showPromotionInformation={showPromotionInformation}
          promotionInformation={getPromotionInformationMessage(
            'push_notification',
            appSessionRef.current.userData.user,
            addOnPromotions,
          )}
          addOnType={AddOnType.PushNotifications}
          canCancel={plan.active && plan.fee > 0}
        >
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
        </AddOnPlanCard>
      </>
    );
  },
);
