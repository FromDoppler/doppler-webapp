import React from 'react';
import { useIntl } from 'react-intl';
import { getPlanFee, thousandSeparatorNumber } from '../../../../../utils';
import PropTypes from 'prop-types';

export const PriceWithDiscount = ({ selectedPlan, selectedDiscount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const discountPercentage = selectedDiscount?.discountPercentage;
  const monthsAmmount = selectedDiscount?.numberMonths;
  const planFee = Math.round(getPlanFee(selectedPlan));
  const planFeeWithDiscount = thousandSeparatorNumber(
    intl.defaultLocale,
    planFee * (1 - discountPercentage / 100) * monthsAmmount,
  );

  if (!discountPercentage) {
    return <></>;
  }

  return (
    <p>
      {_(
        'plan_calculator.with_' + selectedDiscount.subscriptionType.replace('-', '_') + '_discount',
      )}
      <strong>
        {' '}
        US$
        {planFeeWithDiscount}
      </strong>
    </p>
  );
};

PriceWithDiscount.propTypes = {
  selectedPlan: PropTypes.object,
  selectedDiscount: PropTypes.object,
};
