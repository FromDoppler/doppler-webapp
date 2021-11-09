import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../doppler-types';
import { PricePerExtraEmail } from './PricePerExtraEmail';
import { PricePerMonth } from './PricePerMonth';
import { PriceWithDiscount } from './PriceWithDiscount';
import { PriceWithoutDiscount } from './PriceWithoutDiscount';

export const PlanPrice = ({ selectedPlan, selectedDiscount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  if (!selectedPlan) {
    return <></>;
  }

  return (
    <div className="dp-price--wrapper">
      <PriceWithoutDiscount selectedPlan={selectedPlan} selectedDiscount={selectedDiscount} />
      <PricePerMonth
        selectedPlan={selectedPlan}
        discountPercentage={selectedDiscount?.discountPercentage}
      />
      <div className="dp-agreement">
        <PriceWithDiscount selectedPlan={selectedPlan} selectedDiscount={selectedDiscount} />
        <PricePerExtraEmail selectedPlan={selectedPlan} />
        {selectedPlan.type === PLAN_TYPE.byCredit ? (
          <p className="dp-plan-disclaimer">
            {_('plan_calculator.discount_clarification_prepaid')}
          </p>
        ) : (
          <p className="dp-plan-disclaimer">{_('plan_calculator.discount_clarification')}</p>
        )}
      </div>
    </div>
  );
};

PlanPrice.propTypes = {
  selectedPlan: PropTypes.object,
  selectedDiscount: PropTypes.object,
};
