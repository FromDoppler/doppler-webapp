import PropTypes from 'prop-types';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import useTimeout from '../../../../hooks/useTimeout';
import { InjectAppServices } from '../../../../services/pure-di';
import { PaymentMethodType } from '../../../../doppler-types';
import { ACCOUNT_TYPE } from '../../../../hooks/useUserTypeAsQueryParam';

export const DELAY_BEFORE_REDIRECT_TO_SUMMARY = 3000;
const HAS_ERROR = 'HAS_ERROR';
const SAVING = 'SAVING';
const SAVED = 'SAVED';

export const BuyButton = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient },
    textButton,
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
    const accountType = query.get(ACCOUNT_TYPE) ?? '';

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
          window.location.href = `/checkout-summary?planId=${planId}&paymentMethod=${paymentMethod}&${ACCOUNT_TYPE}=${accountType}${
            discount?.description ? `&discount=${discount.description}` : ''
          }${promotion?.extraCredits ? `&extraCredits=${promotion.extraCredits}` : ''}${
            promotion?.discountPercentage
              ? `&discountPromocode=${promotion.discountPercentage}`
              : ''
          }`;
        }, DELAY_BEFORE_REDIRECT_TO_SUMMARY);
      } else {
        // TODO: implement error handling
        setStatus(HAS_ERROR);
      }
    };

    const disabledBuy = !canBuy || [SAVING, SAVED].includes(status);

    return (
      <button
        type="button"
        className={
          'dp-button button-big primary-green' + (status === SAVING ? ' button--loading' : '')
        }
        disabled={disabledBuy}
        onClick={proceedToBuy}
        aria-label="buy"
      >
        {textButton}
      </button>
    );
  },
);

BuyButton.propTypes = {
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
