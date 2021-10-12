import React from 'react';
import { useIntl } from 'react-intl';
import { getPlanFee, thousandSeparatorNumber } from '../../../../utils';

export const PlanPricePerMonth = ({ planData }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const discountPercentage = planData.discount?.discountPercentage;
  const planFee = getPlanFee(planData.plan);
  const planFeeWithDiscount = thousandSeparatorNumber(
    intl.defaultLocale,
    discountPercentage ? planFee * (1 - discountPercentage / 100) : planFee,
  );

  return (
    <>
      <h2 className="dp-price-large">
        <span className="dp-price-large-money">US$</span>
        <span className="dp-price-large-amount">{planFeeWithDiscount}</span>
      </h2>
      <span className="dp-for-time">{_('plan_calculator.per_month')}</span>
    </>
  );
};
