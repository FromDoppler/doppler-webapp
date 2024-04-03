import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useEffect, useReducer } from 'react';
import {
  INITIAL_STATE_PAYMENT_FREQUENCY,
  PAYMENT_FREQUENCY_ACTIONS,
  paymentFrequencyReducer,
} from './reducers/paymentFrequencyReducer';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { SubscriptionType } from './SubscriptionType';

const subscriptionTypeMap = {
  monthly: 'dp-frequency-monthly',
  quarterly: 'dp-frequency-quarterly',
  'half-yearly': 'dp-frequency-biannual',
  yearly: 'dp-frequency-annual',
};

export const PaymentFrequency = ({
  paymentFrequenciesList,
  onSelectPaymentFrequency,
  currentSubscriptionUser,
  disabled = false,
  showBanner = true,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const query = useQueryParams();
  const paymentFrequencyDefault = query.get('monthPlan');
  const isMonthlySubscription = currentSubscriptionUser === 1;
  const lang = intl.locale;
  const [
    { paymentFrequencies, selectedPaymentFrequency, selectedPaymentFrequencyIndex },
    dispatch,
  ] = useReducer(paymentFrequencyReducer, INITIAL_STATE_PAYMENT_FREQUENCY);

  useEffect(() => {
    dispatch({
      type: PAYMENT_FREQUENCY_ACTIONS.RECEIVE_PAYMENT_FREQUENCIES,
      payload: {
        paymentFrequencies: paymentFrequenciesList,
        currentSubscriptionUser,
        paymentFrequencyDefault,
      },
    });
  }, [paymentFrequenciesList, currentSubscriptionUser, paymentFrequencyDefault]);

  useEffect(() => {
    onSelectPaymentFrequency &&
      selectedPaymentFrequency &&
      onSelectPaymentFrequency({
        selectedPaymentFrequency,
        selectedPaymentFrequencyIndex,
      });
  }, [onSelectPaymentFrequency, selectedPaymentFrequency, selectedPaymentFrequencyIndex]);

  const getDiscountName = (subscriptionType) =>
    _('buy_process.discount_' + subscriptionType.replace('-', '_'));

  const handlePaymentFrequency = (paymentFrequency) => {
    dispatch({
      type: PAYMENT_FREQUENCY_ACTIONS.SELECT_PAYMENT_FREQUENCY,
      payload: paymentFrequency,
    });
  };

  if (!isMonthlySubscription && showBanner) {
    return (
      <SubscriptionType
        period={selectedPaymentFrequency?.numberMonths}
        discountPercentage={selectedPaymentFrequency?.discountPercentage}
      />
    );
  }

  if (paymentFrequencies.length > 0) {
    return (
      <section>
        <h4>{_('buy_process.payment_frequency')}</h4>
        <nav className={`dp-payment-frequency${lang === 'en' ? '-en' : ''}`}>
          {paymentFrequencies.map((discount, index) => (
            <button
              key={`discount-${index}`}
              type="button"
              onClick={() => handlePaymentFrequency(discount)}
              disabled={disabled}
            >
              {getDiscountName(discount.subscriptionType)}
              {discount.discountPercentage > 0 && (
                <span className="dp-discount">-{discount.discountPercentage}%</span>
              )}
            </button>
          ))}
          <div
            className={`animation ${
              subscriptionTypeMap[selectedPaymentFrequency?.subscriptionType]
            }`}
          ></div>
        </nav>
      </section>
    );
  }

  return null;
};

PaymentFrequency.propTypes = {
  paymentFrecuencies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      discountPercentage: PropTypes.number,
      numberMonths: PropTypes.number,
      subscriptionType: PropTypes.string,
    }),
  ),
  onSelectPaymentFrequency: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
