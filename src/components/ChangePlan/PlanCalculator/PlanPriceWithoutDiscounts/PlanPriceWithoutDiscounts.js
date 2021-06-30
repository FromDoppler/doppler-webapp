import React from 'react';
import { useIntl } from 'react-intl';
import { getPlanFee, thousandSeparatorNumber } from '../../../../utils';

export const PlanPriceWithoutDiscounts = ({ planData }) => {
  const intl = useIntl();
  const formatedFee = thousandSeparatorNumber(intl.defaultLocale, getPlanFee(planData.plan));
  return (
    <>
      {planData.discount?.discountPercentage ? (
        <span className="dp-price-old">
          <span className="dp-price-old-money">US$</span>
          <span className="dp-price-old-amount">{formatedFee}</span>
        </span>
      ) : (
        <></>
      )}
    </>
  );
};
