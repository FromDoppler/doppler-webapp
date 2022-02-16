import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

export const Discounts = ({ discounts, selectedDiscount, onSelectDiscount, disabled }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getDiscountName = (subscriptionType) => {
    return _('plan_calculator.discount_' + subscriptionType.replace('-', '_'));
  };

  return (
    <>
      <div className="dp-wrap-subscription">
        <h4>{_('plan_calculator.discount_title')}</h4>
        <ul aria-label="discounts">
          {discounts.map((discount) => (
            <li key={discount.id}>
              <button
                disabled={disabled}
                className={`dp-button button-medium ${
                  discount.id === selectedDiscount?.id ? 'btn-active' : ''
                }`}
                onClick={() => onSelectDiscount(discount)}
              >
                {getDiscountName(discount.subscriptionType)}
              </button>
              {discount.discountPercentage > 0 && (
                <span
                  className={`dp-discount ${disabled ? 'dp--disabled' : ''}`}
                >{`${discount.discountPercentage}% OFF`}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

Discounts.propTypes = {
  discounts: PropTypes.array.isRequired,
  selectedDiscount: PropTypes.object,
  disabled: PropTypes.bool,
};
