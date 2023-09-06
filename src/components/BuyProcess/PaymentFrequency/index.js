import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

export const PaymentFrequency = ({
  discounts,
  selectedDiscount,
  onSelectDiscount,
  disabled = false,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getDiscountName = (subscriptionType) =>
    _('buy_process.discount_' + subscriptionType.replace('-', '_'));

  return (
    <section>
      <h4>Frecuencia de pago</h4>
      <ul className="dp-payment-frequency">
        {discounts.map((discount, index) => (
          <li
            key={`discount-${index}`}
            className={discount.id === selectedDiscount?.id ? 'dp-active' : ''}
            onClick={() => onSelectDiscount(discount)}
          >
            <p>
              {getDiscountName(discount.subscriptionType)}
              {discount.discountPercentage > 0 && (
                <span className="dp-discount">-{discount.discountPercentage}%</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

PaymentFrequency.propTypes = {
  discounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      discountPercentage: PropTypes.number,
      subscriptionType: PropTypes.string,
    }),
  ),
  selectedDiscount: PropTypes.shape({
    id: PropTypes.number,
  }),
  onSelectDiscount: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
