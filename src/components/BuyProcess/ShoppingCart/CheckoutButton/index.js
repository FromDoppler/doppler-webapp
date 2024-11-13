import PropTypes from 'prop-types';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import useTimeout from '../../../../hooks/useTimeout';
import { InjectAppServices } from '../../../../services/pure-di';
import { BUY_MARKETING_PLAN, PaymentMethodType } from '../../../../doppler-types';
import { ACCOUNT_TYPE } from '../../../../hooks/useUserTypeAsQueryParam';
import { getCheckoutErrorMesage } from '../utils';

export const DELAY_BEFORE_REDIRECT_TO_SUMMARY = 3000;
const HAS_ERROR = 'HAS_ERROR';
const SAVING = 'SAVING';
const SAVED = 'SAVED';

export const CheckoutButton = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerLegacyClient },
    keyTextButton,
    canBuy = false,
    planId,
    discount,
    total,
    promotion,
    paymentMethod,
    selectedPlanChat,
    buyType = BUY_MARKETING_PLAN,
    hasChatActive,
    selectedOnSitePlan,
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [status, setStatus] = useState('');
    const [messageError, setMessageError] = useState('');
    const createTimeout = useTimeout();
    const query = useQueryParams();
    const originInbound = query.get('origin_inbound') ?? '';
    const accountType = query.get(ACCOUNT_TYPE) ?? '';

    const proceedToBuy = async () => {
      setStatus(SAVING);

      let additionalServices = [];

      if (selectedPlanChat?.planChat?.planId !== undefined) {
        additionalServices = [
          {
            planId: selectedPlanChat?.planChat?.planId,
            type: 7,
            charge: selectedPlanChat?.total,
          },
        ];
      }

      if (!hasChatActive && selectedPlanChat?.planChat) {
        dopplerLegacyClient.activateConversationPlan();
      }

      const response = await dopplerBillingUserApiClient.purchase({
        planId,
        discountId: discount?.id ?? 0,
        total,
        promocode: promotion?.promocode ?? '',
        originInbound,
        additionalServices,
      });

      if (response.success) {
        setStatus(SAVED);
        createTimeout(() => {
          window.location.href = `/checkout-summary?planId=${planId}&buyType=${buyType}&paymentMethod=${paymentMethod}&${ACCOUNT_TYPE}=${accountType}${
            discount?.subscriptionType ? `&discount=${discount.subscriptionType}` : ''
          }${promotion?.extraCredits ? `&extraCredits=${promotion.extraCredits}` : ''}${
            promotion?.discountPercentage
              ? `&discountPromocode=${promotion.discountPercentage}`
              : ''
          }`;
        }, DELAY_BEFORE_REDIRECT_TO_SUMMARY);
      } else {
        setMessageError(getCheckoutErrorMesage(response.error.response?.data));
        setStatus(HAS_ERROR);
      }
    };

    const disabledBuy = !canBuy || [SAVING, SAVED].includes(status);
    const showMessage = [SAVED, HAS_ERROR].includes(status);

    return (
      <>
        <button
          type="button"
          className={
            'dp-button button-big primary-green' + (status === SAVING ? ' button--loading' : '')
          }
          disabled={disabledBuy}
          onClick={proceedToBuy}
          aria-label="buy"
        >
          {_(keyTextButton)}
        </button>
        <button type="button" className="dp-button button-big dp-secure-payment">
          <span className="ms-icon dpicon iconapp-padlock"></span>
          {_('checkoutProcessForm.purchase_summary.secure_payment_message')}
        </button>
        {showMessage && (
          <StatusMessage
            type={status === SAVED ? 'success' : 'cancel'}
            message={_(
              status === SAVED
                ? 'checkoutProcessForm.purchase_summary.success_message'
                : messageError,
            )}
          />
        )}
      </>
    );
  },
);

export const StatusMessage = ({ type, message }) => (
  <div className={`dp-wrap-message dp-wrap-${type}`} role="alert" aria-label={type}>
    <span className="dp-message-icon" />
    <div className="dp-content-message">
      <p>{message}</p>
    </div>
  </div>
);

CheckoutButton.propTypes = {
  canBuy: PropTypes.bool,
  planId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  discount: PropTypes.shape({
    id: PropTypes.number,
    description: PropTypes.string,
  }),
  promotion: PropTypes.oneOfType([
    PropTypes.shape({
      promocode: PropTypes.string,
      extraCredits: PropTypes.string,
      discountPercentage: PropTypes.number,
    }),
    PropTypes.string,
  ]),
  total: PropTypes.number.isRequired,
  paymentMethod: PropTypes.oneOf([
    PaymentMethodType.creditCard,
    PaymentMethodType.mercadoPago,
    PaymentMethodType.transfer,
  ]),
};
