import React from 'react';
import { useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../../doppler-types';
import { unitPriceDecimals } from '../../../../../utils';
import PropTypes from 'prop-types';

export const PricePerExtraEmail = ({ selectedPlan }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const extraEmailPrice = selectedPlan?.extraEmailPrice
    ? unitPriceDecimals(selectedPlan.extraEmailPrice)
    : 0;

  return (
    <>
      {selectedPlan.type === PLAN_TYPE.byEmail || selectedPlan.type === PLAN_TYPE.byCredit ? (
        <p className="dp-cost-per-email">
          {_('plan_calculator.cost_per_email')}{' '}
          <span className="dp-price-large-money">
            <strong>US${extraEmailPrice}</strong>
          </span>
        </p>
      ) : (
        <></>
      )}
    </>
  );
};

PricePerExtraEmail.propTypes = {
  selectedPlan: PropTypes.object,
};
