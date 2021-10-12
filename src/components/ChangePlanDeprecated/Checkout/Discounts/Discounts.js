import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import * as S from './Discounts.styles';

export const Discounts = ({
  discountsList,
  sessionPlan,
  selectedPlanDiscount,
  disabled,
  handleChange,
}) => {
  const [selectedDiscount, setSelectedDiscount] = useState(
    selectedPlanDiscount ?? discountsList[0],
  );
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

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

  const getDiscountDescription = (discountDescription) => {
    switch (discountDescription) {
      case 'monthly':
      case 'quarterly':
      case 'half-yearly':
      case 'yearly':
        return _('checkoutProcessForm.discount_' + discountDescription.replace('-', '_'));
      default:
        return '';
    }
  };

  return (
    <>
      {sessionPlan.planSubscription > 1 ? (
        <>
          <S.DiscountTitle className="p-t-24">
            {_(
              'checkoutProcessForm.discount_subscription_' +
                selectedDiscount.description.replace('-', '_'),
            )}
          </S.DiscountTitle>
          <S.DiscountSubtitle className="dp-discount m-t-12">
            <strong>{selectedDiscount.discountPercentage}% OFF</strong>{' '}
            {_('checkoutProcessForm.discount_subscription_subtitle')}
          </S.DiscountSubtitle>
        </>
      ) : discountsList.length ? (
        <div className="dp-wrap-subscription">
          <label>{_('checkoutProcessForm.discount_title')}</label>
          <ul>
            {discountsList.map((discount, index) => (
              <li key={index}>
                <button
                  type="button"
                  key={index}
                  className={`dp-button button-medium ${
                    discount.id === selectedDiscount.id ? 'btn-active' : ''
                  }`}
                  onClick={() => {
                    if (!disabled) {
                      applyDiscount(discount);
                    }
                  }}
                >
                  {getDiscountDescription(discount.description)}
                </button>
                {discount?.discountPercentage > 0 ? (
                  <span className="dp-discount">{`${discount.discountPercentage}% OFF`}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};
