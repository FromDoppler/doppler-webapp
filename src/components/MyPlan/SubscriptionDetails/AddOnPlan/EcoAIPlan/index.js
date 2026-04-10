import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../../services/pure-di';
import { HeaderStyled } from '../index.style';
import { getPromotionInformationMessage } from '../utils';
import { AddOnType } from '../../../../../doppler-types';
import { useState } from 'react';
import useTimeout from '../../../../../hooks/useTimeout';
import { getCheckoutErrorMesage } from '../../../../BuyProcess/ShoppingCart/utils';
import { StatusMessage } from '../../../../BuyProcess/ShoppingCart/CheckoutButton';

export const DELAY_BEFORE_REDIRECT_TO_MY_PLAN = 3000;
const HAS_ERROR = 'HAS_ERROR';
const SAVING = 'SAVING';
const SAVED = 'SAVED';

export const EcoAIPlan = InjectAppServices(
  ({
    buyUrl,
    ecoAiPlan,
    addOnPromotions,
    dependencies: { appSessionRef, dopplerBillingUserApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const createTimeout = useTimeout();
    const [messageError, setMessageError] = useState('');
    const [status, setStatus] = useState('');
    const showPromotionInformation = addOnPromotions.length > 0 && !ecoAiPlan.active;
    const user = appSessionRef.current.userData.user;
    const { plan } = user;

    const cancelAddOnPlan = async () => {
      setStatus(SAVING);
      const addOnType = AddOnType.EcoAI;
      const response = await dopplerBillingUserApiClient.cancellationAddOnPlan(addOnType);
      if (response.success) {
        setStatus(SAVED);
        createTimeout(() => {
          window.location.href = `/my-plan`;
        }, DELAY_BEFORE_REDIRECT_TO_MY_PLAN);
      } else {
        setMessageError(getCheckoutErrorMesage(response.error.response?.data));
        setStatus(HAS_ERROR);
      }
    };

    const showMessage = [SAVED, HAS_ERROR].includes(status);

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
                    <span className="dpicon icon-sparkle-ia"></span>
                  </h3>
                  <p>{_(`my_plan.subscription_details.addon.eco_ai_plan.subtitle`)}</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-12">
                <div className="dp-buttons--plan">
                  <a
                    type="button"
                    href={buyUrl}
                    className="dp-button button-medium primary-green dp-w-100 m-b-12"
                  >
                    {_(`my_plan.subscription_details.change_plan_button`)}
                  </a>
                  {ecoAiPlan.active && (
                    <button
                      className="dp-button button-medium dp-w-100 btn-cancel"
                      onClick={() => cancelAddOnPlan()}
                    >
                      {_(`my_plan.subscription_details.cancel_subscription_button`)}
                    </button>
                  )}
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
              <div className="dp-rowflex">
                <div className="col-lg-12 col-md-12">
                  <p>
                    <strong>
                      {_(`my_plan.subscription_details.addon.eco_ai_plan.description`)}
                    </strong>
                  </p>
                </div>
              </div>
            </li>
            <li>
              <p>
                <strong>{_(`my_plan.subscription_details.billing.title`)}</strong>
              </p>
              <p className="plan-item">
                {_(`my_plan.subscription_details.billing.type_${plan.planSubscription}`)}
              </p>
            </li>
            {showMessage && (
              <li>
                <StatusMessage
                  type={status === SAVED ? 'success' : 'cancel'}
                  message={
                    status === SAVED
                      ? 'checkoutProcessForm.purchase_summary.success_message'
                      : messageError
                  }
                />
              </li>
            )}
          </ul>
        </article>
      </div>
    );
  },
);
