import PropTypes from 'prop-types';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import useTimeout from '../../../../hooks/useTimeout';
import { InjectAppServices } from '../../../../services/pure-di';
import { ACCOUNT_TYPE } from '../../../../hooks/useUserTypeAsQueryParam';
import { getCheckoutErrorMesage } from '../utils';
import { BUY_LANDING_PACK } from '..';

export const DELAY_BEFORE_REDIRECT_TO_SUMMARY = 3000;
const HAS_ERROR = 'HAS_ERROR';
const SAVING = 'SAVING';
const SAVED = 'SAVED';

export const LandingPackCheckoutButton = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient },
    keyTextButton,
    canBuy = false,
    total,
    landingPacks,
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [status, setStatus] = useState('');
    const [messageError, setMessageError] = useState('');
    const createTimeout = useTimeout();
    const query = useQueryParams();
    const accountType = query.get(ACCOUNT_TYPE) ?? '';

    const proceedToBuy = async () => {
      setStatus(SAVING);
      const response = await dopplerBillingUserApiClient.purchaseLandings({
        total,
        landingPacks,
      });

      if (response.success) {
        setStatus(SAVED);
        createTimeout(() => {
          window.location.href = `/checkout-summary?buyType=${BUY_LANDING_PACK}&${ACCOUNT_TYPE}=${accountType}`;
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

LandingPackCheckoutButton.propTypes = {
  canBuy: PropTypes.bool,
  total: PropTypes.number.isRequired,
  keyTextButton: PropTypes.string,
};
