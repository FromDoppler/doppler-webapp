import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { formattedNumber } from '..';
import { HeaderStyled } from '../index.style';
import { AddOnExpiredMessage } from '../AddOnExpiredMessage';
import { getPromotionInformationMessage } from '../utils';

export const EcoAIPlan = InjectAppServices(
  ({ buyUrl, ecoAiPlan, isFreeAccount, addOnPromotions, dependencies: { appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const showPromotionInformation = addOnPromotions.length > 0 && !ecoAiPlan.active;

    return (
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
                    <span className={`dpicon iconapp-online-clothing`}></span>
                  </h3>
                  {ecoAiPlan.trialExpired && <AddOnExpiredMessage></AddOnExpiredMessage>}
                  {!ecoAiPlan.trialExpired && ecoAiPlan.fee === 0 && (
                    <p>
                      {_(
                        `my_plan.subscription_details.addon.eco_ai_plan.${
                          isFreeAccount && !ecoAiPlan.active ? 'start_free_label' : 'free_label'
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
                        ecoAiPlan.trialExpired
                          ? 'view_plans_button'
                          : (isFreeAccount || addOnPromotions.length > 0) && !ecoAiPlan.active
                            ? 'view_plans_button'
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
                  {getPromotionInformationMessage(
                    'eco_ai',
                    appSessionRef.current.userData.user,
                    addOnPromotions,
                  )}
                </p>
              </div>
            </div>
          )}
          <ul className="dp-item--plan">
            <li>
              <p>
                <strong>
                  <FormattedMessage
                    id={'my_plan.subscription_details.addon.eco_ai_plan.plan_message'}
                    values={{
                      total: ecoAiPlan.quantity,
                    }}
                  />
                </strong>
              </p>
              <div className="dp-rowflex">
                <div className="col-lg-5 col-md-12">
                  <p className="plan-item">
                    <FormattedMessage
                      id={`my_plan.subscription_details.addon.eco_ai_plan.available_message`}
                      values={{
                        available: ecoAiPlan.quantity,
                        total: ecoAiPlan.quantity,
                      }}
                    />
                  </p>
                </div>
                <div className="col-lg-4 col-md-12">
                  <p className="plan-item m-l-12">
                    {!isFreeAccount && ecoAiPlan.fee > 0 ? (
                      <FormattedMessage
                        id={`my_plan.subscription_details.addon.eco_ai_plan.additional_impression_message`}
                        values={{
                          price: formattedNumber(ecoAiPlan.additional, 4),
                        }}
                      />
                    ) : (
                      <FormattedMessage
                        id={`my_plan.subscription_details.addon.eco_ai_plan.free_additional_impression_message`}
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
