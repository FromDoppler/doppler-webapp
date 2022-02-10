import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../doppler-types';
import { PricePerExtraEmail } from './PricePerExtraEmail';
import { PriceWithDiscount } from './PriceWithDiscount';
import { OldPrice } from './OldPrice';
import { TotalPrice } from './TotalPrice';

export const PlanPrice = ({ selectedPlan, selectedDiscount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  if (!selectedPlan) {
    return <></>;
  }

  return (
    <div className="dp-price--wrapper">
      {selectedDiscount?.discountPercentage > 0 && <OldPrice selectedPlan={selectedPlan} />}
      <TotalPrice
        selectedPlan={selectedPlan}
        discountPercentage={selectedDiscount?.discountPercentage}
      />
      <div className="dp-agreement">
        {selectedDiscount?.discountPercentage > 0 && (
          <PriceWithDiscount selectedPlan={selectedPlan} selectedDiscount={selectedDiscount} />
        )}
        {selectedPlan.type !== PLAN_TYPE.byContact && (
          <PricePerExtraEmail selectedPlan={selectedPlan} />
        )}
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
