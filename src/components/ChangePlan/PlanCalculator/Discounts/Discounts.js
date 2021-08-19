import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import * as S from './Discounts.styles';

export const Discounts = ({ discountsList, sessionPlan, handleChange }) => {
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

  const applyDiscount = useCallback(
    (planDiscount) => {
      handleChange(planDiscount);
      setSelectedDiscount(planDiscount);
    },
    [handleChange],
  );

  useEffect(() => {
    if (sessionPlan.planSubscription > 1) {
      const disccountAplied = discountsList.find(
        (discount) => discount.monthsAmmount === sessionPlan.planSubscription,
      );
      applyDiscount(disccountAplied);
    }
  }, [applyDiscount, discountsList, sessionPlan.planSubscription]);

  return (
    <>
      {sessionPlan.planSubscription > 1 ? (
        <>
          <S.DiscountTitle className="p-t-24">
            {_(
              'plan_calculator.discount_subscription_' +
                selectedDiscount.description.replace('-', '_'),
            )}
          </S.DiscountTitle>
          <S.DiscountSubtitle className="dp-discount m-t-12">
            <strong>{selectedDiscount.discountPercentage}% OFF</strong>{' '}
            {_('plan_calculator.discount_subscription_subtitle')}
          </S.DiscountSubtitle>
        </>
      ) : (
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
                      applyDiscount(discount);
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
      )}
    </>
  );
};
