import React from 'react';
import { useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../../doppler-types';
import { getPlanFee, thousandSeparatorNumber } from '../../../../../utils';

export const PricePerMonth = ({ selectedPlan, discountPercentage }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const planFee = getPlanFee(selectedPlan);
  const planFeeWithDiscount = thousandSeparatorNumber(
    intl.defaultLocale,
    discountPercentage ? planFee * (1 - discountPercentage / 100) : planFee,
  );

  return (
    <>
      <h2 className="dp-price-large">
        <span className="dp-price-large-money">US$</span>
        <span className="dp-price-large-amount" data-testid="dp-price-amount">
          {planFeeWithDiscount}
        </span>
      </h2>
      {selectedPlan.type !== PLAN_TYPE.byCredit ? (
        <span className="dp-for-time">{_('plan_calculator.per_month')}</span>
      ) : (
        ''
      )}
    </>
  );
};
