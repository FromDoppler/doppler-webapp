import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { getPromotionInformationMessage } from '../utils';
import { AddOnExpiredMessage } from '../AddOnExpiredMessage';
import { AddOnType } from '../../../../../doppler-types';
import { AddOnPlanCard } from '../AddOnPlanCard';

export const EcoAIPlan = InjectAppServices(
  ({ buyUrl, ecoAiPlan, isFreeAccount, addOnPromotions, dependencies: { appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const showPromotionInformation = addOnPromotions.length > 0 && !ecoAiPlan.active;

    const changeAddOnPlan = async () => {
      window.location.href = buyUrl;
    };

    return (
      <>
        <AddOnPlanCard
          title={_(`my_plan.subscription_details.addon.eco_ai_plan.title`)}
          iconClassName="dpicon icon-sparkle-ia"
          description={
            ecoAiPlan.trialExpired ? (
              <AddOnExpiredMessage />
            ) : ecoAiPlan.active && ecoAiPlan.fee === 0 ? (
              <p>{_(`my_plan.subscription_details.addon.eco_ai_plan.free_label`)}</p>
            ) : (
              <p className="p-t-12">
                {_(`my_plan.subscription_details.addon.eco_ai_plan.description`)}
              </p>
            )
          }
          actions={
            <>
              <button
                disabled={true}
                type="button"
                aria-label="change-plan"
                onClick={() => changeAddOnPlan()}
                className="dp-button button-medium primary-green dp-w-100 m-b-12"
              >
                {_(
                  `my_plan.subscription_details.${
                    ecoAiPlan.trialExpired
                      ? 'view_plans_button'
                      : (isFreeAccount || addOnPromotions.length > 0) && !ecoAiPlan.active
                        ? 'activate_now_button'
                        : 'buy_button'
                  }`,
                )}
              </button>
            </>
          }
          showPromotionInformation={showPromotionInformation}
          promotionInformation={getPromotionInformationMessage(
            'eco_ai',
            appSessionRef.current.userData.user,
            addOnPromotions,
          )}
          promotionClassName="m-t-12 m-b-12"
          addOnType={AddOnType.EcoAI}
          canCancel={ecoAiPlan.active && ecoAiPlan.fee > 0}
        />
      </>
    );
  },
);
