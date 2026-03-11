import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { Loading } from '../../../../Loading/Loading';
import { useEffect, useState } from 'react';
import { formattedNumber } from '..';
import { AddOnType } from '../../../../../doppler-types';
import { HeaderStyled } from '../index.style';
import { AddOnExpiredMessage } from '../AddOnExpiredMessage';

export const OnSitePlan = InjectAppServices(
  ({
    buyUrl,
    onSitePlan,
    isFreeAccount,
    addOnPromotion,
    dependencies: { dopplerPopupHubApiClient, dopplerAccountPlansApiClient, appSessionRef },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [loading, setLoading] = useState(true);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [plan, setPlan] = useState(onSitePlan);
    const showPromotionInformation = addOnPromotion !== undefined && !onSitePlan.active;

    const user = appSessionRef.current.userData.user;
    const expirationDate = new Date(addOnPromotion?.expirationDate);
    const formatter = new Intl.DateTimeFormat(user.lang === 'es' ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

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
          if (isFreeAccount || addOnPromotion) {
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
      addOnPromotion,
      isFreeAccount,
    ]);

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
                      {_(`my_plan.subscription_details.addon.onsite_plan.title`)}
                    </span>
                    <span className={`dpicon iconapp-online-clothing`}></span>
                  </h3>
                  {plan.trialExpired && <AddOnExpiredMessage></AddOnExpiredMessage>}
                  {!plan.trialExpired && plan.fee === 0 && (
                    <p>
                      {_(
                        `my_plan.subscription_details.addon.onsite_plan.${
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
                          : (isFreeAccount || addOnPromotion) && !plan.active
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
                  <FormattedMessage
                    id={`${
                      addOnPromotion.idAddOnPlan !== undefined
                        ? 'my_plan.subscription_details.addon.onsite_plan.addon_promotion_one_plan_message'
                        : 'my_plan.subscription_details.addon.onsite_plan.addon_promotion_all_plans_message'
                    }`}
                    values={{
                      discount: addOnPromotion.discount,
                      quantity: addOnPromotion.quantity,
                      expirationDate: formatter.format(new Date(expirationDate)),
                      bold: (chunks) => <b>{chunks}</b>,
                    }}
                  />
                </p>
              </div>
            </div>
          )}
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
        </article>
      </div>
    );
  },
);
