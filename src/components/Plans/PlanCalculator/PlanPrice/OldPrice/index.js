import React from 'react';
import { useIntl } from 'react-intl';
import { getPlanFee, thousandSeparatorNumber } from '../../../../../utils';
import PropTypes from 'prop-types';

export const OldPrice = ({ selectedPlan }) => {
  const intl = useIntl();

  const formatedFee = thousandSeparatorNumber(intl.defaultLocale, getPlanFee(selectedPlan));
  return (
    <>
      <span className="dp-price-old" data-testid="old-price">
        <span className="dp-price-old-money">US$</span>
        <span className="dp-price-old-amount">{formatedFee}</span>
      </span>
    </>
  );
};

OldPrice.propTypes = {
  selectedPlan: PropTypes.object,
};
