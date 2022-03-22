import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useQueryParams } from '../../../../../hooks/useQueryParams';
import useTimeout from '../../../../../hooks/useTimeout';
import { InjectAppServices } from '../../../../../services/pure-di';

export const DELAY_BEFORE_REDIRECT_TO_SUMMARY = 3000;
const HAS_ERROR = 'HAS_ERROR';
const SAVING = 'SAVING';
const SAVED = 'SAVED';

export const PlanPurchase = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient },
    canBuy = false,
    planId,
    discount,
    total,
    promotion,
    paymentMethod,
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [status, setStatus] = useState('');
    const createTimeout = useTimeout();
    const query = useQueryParams();
    const originInbound = query.get('origin_inbound') ?? '';

    const proceedToBuy = async () => {
      setStatus(SAVING);
      const response = await dopplerBillingUserApiClient.purchase({
        planId,
        discountId: discount?.id ?? 0,
        total,
        promocode: promotion?.promocode ?? '',
        originInbound,
      });

      if (response.success) {
        setStatus(SAVED);
        createTimeout(() => {
          window.location.href = `/checkout-summary?planId=${planId}&paymentMethod=${paymentMethod}${
            discount?.description ? `&discount=${discount.description}` : ''
          }${promotion?.extraCredits ? `&extraCredits=${promotion.extraCredits}` : ''}${
            promotion?.discountPercentage
              ? `&discountPromocode=${promotion.discountPercentage}`
              : ''
          }`;
        }, DELAY_BEFORE_REDIRECT_TO_SUMMARY);
      } else {
        setStatus(HAS_ERROR);
      }
    };

    const disabledBuy = !canBuy || [SAVING, SAVED].includes(status);
    const showMessage = [SAVED, HAS_ERROR].includes(status);

    return (
      <>
        <div className="dp-cta-pay">
          <BuyPlanButton
            textButton={_('checkoutProcessForm.purchase_summary.buy_button')}
            canBuy={canBuy}
            disabledBuy={disabledBuy}
            proceedToBuy={proceedToBuy}
          />
          <button type="button" className="dp-button button-big">
            <span className="ms-icon icon-lock dp-color-green" />
            {_('checkoutProcessForm.purchase_summary.secure_payment_message')}
          </button>
        </div>
        {showMessage && (
          <StatusMessage
            type={status === SAVED ? 'success' : 'cancel'}
            message={_(
              `checkoutProcessForm.purchase_summary.${
                status === SAVED ? 'success' : 'error'
              }_message`,
            )}
          />
        )}
      </>
    );
  },
);

PlanPurchase.propTypes = {
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
  paymentMethod: PropTypes.oneOf(['CC', 'MP', 'TRANSF']),
};

export const StatusMessage = ({ type, message }) => (
  <>
    <div className={`dp-wrap-message dp-wrap-${type}`} role="alert" aria-label={type}>
      <span className="dp-message-icon" />
      <div className="dp-content-message">
        <p>{message}</p>
      </div>
    </div>
    <hr className="m-t-24 m-b-24" />
  </>
);

export const BuyPlanButton = ({ textButton, status, disabledBuy, proceedToBuy }) => (
  <button
    type="button"
    className={'dp-button button-big primary-green' + (status === SAVING ? ' button--loading' : '')}
    disabled={disabledBuy}
    onClick={proceedToBuy}
  >
    {textButton}
  </button>
);
