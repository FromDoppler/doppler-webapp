import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import * as S from './Discounts.styles';

const monthsOfRenewal = [1, 3, 6, 12];

const DiscountItem = ({
  discountsList,
  month,
  selectedDiscount,
  applyDiscount,
  disabled,
  appliedPromocode,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const discount = discountsList.filter((d) => d.monthsAmmount === month)[0];

  const getDiscountDescription = (monthsAmmount) => {
    switch (monthsAmmount) {
      case 1:
        return _('checkoutProcessForm.discount_monthly');
      case 3:
        return _('checkoutProcessForm.discount_quarterly');
      case 6:
        return _('checkoutProcessForm.discount_half_yearly');
      case 12:
        return _('checkoutProcessForm.discount_yearly');
      default:
        return '';
    }
  };

  var selected =
    selectedDiscount === undefined ? month === 1 : discount && discount.id === selectedDiscount.id;

  return (
    <li key={month}>
      <button
        type="button"
        key={month}
        disabled={!discount || appliedPromocode || disabled}
        className={`dp-button button-medium ${selected && !appliedPromocode ? 'btn-active' : ''}`}
        onClick={() => {
          if (!disabled) {
            applyDiscount(discount);
          }
        }}
      >
        {getDiscountDescription(month)}
      </button>
      {discount && discount.discountPercentage > 0 ? (
        <span className="dp-discount">{`${discount.discountPercentage}% OFF`}</span>
      ) : null}
    </li>
  );
};

export const Discounts = ({
  discountsList,
  sessionPlan,
  selectedPlanDiscount,
  disabled,
  appliedPromocode,
  handleChange,
}) => {
  const [selectedDiscount, setSelectedDiscount] = useState(
    selectedPlanDiscount ?? discountsList[0],
  );
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const applyDiscount = useCallback(
    (planDiscount) => {
      if (planDiscount) {
        if (sessionPlan.planSubscription <= 1) {
          handleChange(planDiscount);
        }

        setSelectedDiscount(planDiscount);
      }
    },
    [handleChange, sessionPlan.planSubscription],
  );

  useEffect(() => {
    if (sessionPlan.planSubscription > 1) {
      const disccountAplied = discountsList.find(
        (discount) => discount.monthsAmmount === sessionPlan.planSubscription,
      );
      applyDiscount(disccountAplied);
    } else {
      const discountFilter = discountsList.find((d) => d.id === selectedDiscount?.id);
      const discount = discountFilter ?? selectedPlanDiscount ?? discountsList[0];
      setSelectedDiscount(discount);
    }
  }, [
    applyDiscount,
    discountsList,
    sessionPlan.planSubscription,
    selectedPlanDiscount,
    selectedDiscount?.id,
  ]);

  console.log('selectedDiscount', selectedDiscount);

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
      ) : (
        <div className="dp-wrap-subscription">
          <label>{_('checkoutProcessForm.discount_title')}</label>
          <ul>
            {monthsOfRenewal.map((month, index) => (
              <DiscountItem
                key={index}
                disabled={disabled}
                month={month}
                discountsList={discountsList}
                selectedDiscount={selectedDiscount}
                applyDiscount={applyDiscount}
                appliedPromocode={appliedPromocode}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
