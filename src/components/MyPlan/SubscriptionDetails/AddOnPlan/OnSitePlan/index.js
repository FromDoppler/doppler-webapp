import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { Loading } from '../../../../Loading/Loading';
import { useEffect, useState } from 'react';
import { formattedNumber } from '..';
import { AddOnType } from '../../../../../doppler-types';
import { AddOnExpiredMessage } from '../AddOnExpiredMessage';
import { getPromotionInformationMessage } from '../utils';
import { AddOnCancellationFlow } from '../AddOnCancellationFlow';
import { AddOnPlanCard } from '../AddOnPlanCard';

export const OnSitePlan = InjectAppServices(
  ({
    buyUrl,
    onSitePlan,
    isFreeAccount,
    addOnPromotions,
    dependencies: { dopplerPopupHubApiClient, dopplerAccountPlansApiClient, appSessionRef },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [loading, setLoading] = useState(true);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [plan, setPlan] = useState(onSitePlan);
    const showPromotionInformation = addOnPromotions.length > 0 && !onSitePlan.active;
    useEffect(() => {
      const fetchAddOnData = async () => {
        if (plan.active) {
          var getImpressionsResponse = await dopplerPopupHubApiClient.getImpressions();
          if (getImpressionsResponse.success) {
            setAvailableQuantity(plan.quantity - getImpressionsResponse.value);
          } else {
            setAvailableQuantity(plan.quantity);
          }
        } else {
          if (isFreeAccount || addOnPromotions.length > 0) {
            const getFreeAddOnPlanResponse = await dopplerAccountPlansApiClient.getFreeAddOnPlan(
              AddOnType.OnSite,
            );
            if (getFreeAddOnPlanResponse.success) {
              setPlan(getFreeAddOnPlanResponse.value);
              setAvailableQuantity(getFreeAddOnPlanResponse.value.quantity);
            }
          }
        }

        setLoading(false);
      };

      fetchAddOnData();
    }, [
      dopplerPopupHubApiClient,
      dopplerAccountPlansApiClient,
      plan.active,
      plan.quantity,
      addOnPromotions,
      isFreeAccount,
    ]);

    if (loading) {
      return <Loading page />;
    }

    return (
      <>
        <AddOnPlanCard
          title={_(`my_plan.subscription_details.addon.onsite_plan.title`)}
          iconClassName="dpicon iconapp-online-clothing"
          description={
            !plan.trialExpired && plan.fee === 0 ? (
              <p>
                {_(
                  `my_plan.subscription_details.addon.onsite_plan.${
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
              <AddOnCancellationFlow
                addOnType={AddOnType.OnSite}
                canCancel={plan.active && plan.fee > 0}
              />
            </>
          }
          showPromotionInformation={showPromotionInformation}
          promotionInformation={getPromotionInformationMessage(
            'onsite',
            appSessionRef.current.userData.user,
            addOnPromotions,
          )}
        >
          <ul className="dp-item--plan">
            <li>
              <p>
                <strong>
                  <FormattedMessage
                    id={'my_plan.subscription_details.addon.onsite_plan.plan_message'}
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
                      id={`my_plan.subscription_details.addon.onsite_plan.available_message`}
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
                        id={`my_plan.subscription_details.addon.onsite_plan.additional_impression_message`}
                        values={{
                          price: formattedNumber(plan.additional, 4),
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        id={`my_plan.subscription_details.addon.onsite_plan.free_additional_impression_message`}
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
