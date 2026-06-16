import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { HeaderStyled } from '../index.style';
import { getPromotionInformationMessage } from '../utils';
import { AddOnExpiredMessage } from '../AddOnExpiredMessage';
import { AddOnCancellationFlow } from '../AddOnCancellationFlow';
import { AddOnType } from '../../../../../doppler-types';

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
        <div className="dp-box-shadow m-b-24">
          <article className="dp-wrapper-plan">
            <header>
              <HeaderStyled className="dp-rowflex">
                <div className="col-lg-9 col-md-12">
                  <div className="dp-title-plan">
                    <h3 className="dp-second-order-title">
                      <span className="p-r-8 m-r-6">
                        {_(`my_plan.subscription_details.addon.eco_ai_plan.title`)}
                      </span>
                      <span className="dpicon icon-sparkle-ia"></span>
                    </h3>
                    {ecoAiPlan.trialExpired && <AddOnExpiredMessage></AddOnExpiredMessage>}
                    {!ecoAiPlan.trialExpired && ecoAiPlan.active && ecoAiPlan.fee === 0 ? (
                      <p>{_(`my_plan.subscription_details.addon.eco_ai_plan.free_label`)}</p>
                    ) : (
                      <p className="p-t-12">
                        {_(`my_plan.subscription_details.addon.eco_ai_plan.description`)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-lg-3 col-md-12">
                  <div className="dp-buttons--plan">
                    <button
                      disabled={ecoAiPlan.active && ecoAiPlan.fee > 0}
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
                              : 'change_plan_button'
                        }`,
                      )}
                    </button>
                    <AddOnCancellationFlow
                      addOnType={AddOnType.EcoAI}
                      canCancel={ecoAiPlan.active && ecoAiPlan.fee > 0}
                    />
                  </div>
                </div>
              </HeaderStyled>
            </header>
            {showPromotionInformation && (
              <div className="dp-wrap-message dp-wrap-info m-t-12 m-b-12">
                <span className="dp-message-icon"></span>
                <div className="dp-content-message dp-content-full">
                  <p>
                    {getPromotionInformationMessage(
                      'eco_ai',
                      appSessionRef.current.userData.user,
                      addOnPromotions,
                    )}
                  </p>
                </div>
              </div>
            )}
          </article>
        </div>
      </>
    );
  },
);
