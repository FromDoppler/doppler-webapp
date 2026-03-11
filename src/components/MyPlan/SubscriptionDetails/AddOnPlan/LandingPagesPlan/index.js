import { FormattedMessage, useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';

export const LandingPagesPlan = InjectAppServices(
  ({ buyUrl, landingPagesPlan, addOnPromotion, dependencies: { appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const showPromotionInformation = addOnPromotion !== undefined && !landingPagesPlan.active;

    const user = appSessionRef.current.userData.user;
    const expirationDate = new Date(addOnPromotion?.expirationDate);
    const formatter = new Intl.DateTimeFormat(user.lang === 'es' ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return (
      <div className="dp-box-shadow m-b-24">
        <article className="dp-wrapper-plan">
          <header>
            <div className="dp-title-plan">
              <h3 className="dp-second-order-title">
                <span className="p-r-8 m-r-6">
                  {_('my_plan.subscription_details.addon.landings_plan.title')}
                </span>
                <span className={`dpicon iconapp-landing-page`}></span>
              </h3>
              <p>{_('my_plan.subscription_details.addon.landings_plan.subtitle')}</p>
            </div>
            <div className="dp-buttons--plan">
              <a
                type="button"
                href={buyUrl}
                className="dp-button button-medium primary-green dp-w-100 m-b-12"
              >
                {_(`my_plan.subscription_details.view_other_packs`)}
              </a>
            </div>
          </header>
          {showPromotionInformation && (
            <div className="dp-wrap-message dp-wrap-info m-t-12">
              <span className="dp-message-icon"></span>
              <div className="dp-content-message dp-content-full">
                <p>
                  <FormattedMessage
                    id={`${
                      addOnPromotion.idAddOnPlan !== undefined
                        ? 'my_plan.subscription_details.addon.landings_plan.addon_promotion_one_plan_message'
                        : 'my_plan.subscription_details.addon.landings_plan.addon_promotion_all_plans_message'
                    }`}
                    values={{
                      discount: addOnPromotion.discount,
                      quantity: addOnPromotion.quantity.replace('PACK ', ''),
                      expirationDate: formatter.format(new Date(expirationDate)),
                      bold: (chunks) => <b>{chunks}</b>,
                    }}
                  />
                </p>
              </div>
            </div>
          )}
          <ul className="dp-item--plan">
            {landingPagesPlan.landingPacks.map((lp, index) => (
              <li key={index}>
                <p>
                  <strong>
                    <FormattedMessage
                      id={`my_plan.subscription_details.addon.landings_plan.landings_packs_message`}
                      values={{
                        landingPack: lp.landingsQty,
                        landingQty: lp.packageQty,
                      }}
                    />
                  </strong>
                </p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    );
  },
);
