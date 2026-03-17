import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { formattedNumber } from '..';
import { useEffect, useState } from 'react';
import { AddOnType } from '../../../../../doppler-types';
import { Loading } from '../../../../Loading/Loading';
import { HeaderStyled } from '../index.style';
import { AddOnExpiredMessage } from '../AddOnExpiredMessage';
import { getPromotionInformationMessage } from '../utils';

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
      <div className="dp-box-shadow m-b-24">
        <article className="dp-wrapper-plan">
          <header>
            <HeaderStyled className="dp-rowflex">
              <div className="col-lg-9 col-md-12">
                <div className="dp-title-plan">
                  <h3 className="dp-second-order-title">
                    <span className="p-r-8 m-r-6">
                      {_(`my_plan.subscription_details.addon.push_notification_plan.title`)}
                    </span>
                    <span className={`dpicon iconapp-bell1`}></span>
                  </h3>
                  {plan.trialExpired && <AddOnExpiredMessage></AddOnExpiredMessage>}
                  {!plan.trialExpired && plan.fee === 0 && (
                    <p>
                      {_(
                        `my_plan.subscription_details.addon.push_notification_plan.${
                          isFreeAccount && !plan.active ? 'start_free_label' : 'free_label'
                        }`,
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-lg-3 col-md-12">
                <div className="dp-buttons--plan">
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
                </div>
              </div>
            </HeaderStyled>
          </header>
          {showPromotionInformation && (
            <div className="dp-wrap-message dp-wrap-info m-t-12">
              <span className="dp-message-icon"></span>
              <div className="dp-content-message dp-content-full">
                <p>
                  <p>
                    {getPromotionInformationMessage(
                      'push_notification',
                      appSessionRef.current.userData.user,
                      addOnPromotions,
                    )}
                  </p>
                </p>
              </div>
            </div>
          )}
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
    );
  },
);
