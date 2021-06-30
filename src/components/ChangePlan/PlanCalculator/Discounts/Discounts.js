import React, { useState } from 'react';
import { useIntl } from 'react-intl';

export const Discounts = ({ discountsList, handleChange }) => {
  const [selectedDiscount, setSelectedDiscount] = useState(discountsList[0]);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getDiscountDescription = (discountDescription) => {
    switch (discountDescription) {
      case 'monthly':
      case 'quarterly':
      case 'half-yearly':
      case 'yearly':
        return _('plan_calculator.discount_' + discountDescription.replace('-', '_'));
      default:
        return '';
    }
  };

  return (
    <>
      <div className="dp-wrap-subscription">
        <h4>{_('plan_calculator.discount_title')}</h4>
        <ul>
          {discountsList.map((discount, index) => (
            <li key={index}>
              <button
                key={index}
                className={`dp-button button-medium ${
                  discount.id === selectedDiscount.id ? 'btn-active' : ''
                }`}
                onClick={() => {
                  handleChange(discount);
                  setSelectedDiscount(discount);
                }}
              >
                {getDiscountDescription(discount.description)}
              </button>
              {discount.discountPercentage ? (
                <span className="dp-discount">{`${discount.discountPercentage}% OFF`}</span>
              ) : (
                <></>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
