import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../doppler-types';
import { compactNumber, thousandSeparatorNumber } from '../../../../utils';

export const Slider = ({ planType, values, selectedPlanIndex, handleChange }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const amountPlans = values.length;

  return (
    <>
      <div className="dp-calc-quantity">
        <h3>{thousandSeparatorNumber(intl.defaultLocale, values[selectedPlanIndex])}</h3>
        <h4>{_(`plans.${planType.replace('-', '_')}_amount_description`)}</h4>
      </div>
      <div className="dp-calc-slider progress-bar">
        <input
          className="range-slider"
          type="range"
          disabled={amountPlans === 0}
          min={0}
          max={amountPlans > 1 ? amountPlans - 1 : 1}
          step={1}
          value={selectedPlanIndex}
          onChange={handleChange}
        />
        <div
          className="progress-anchor"
          style={
            amountPlans > 1
              ? { width: `${(selectedPlanIndex * 100) / (amountPlans - 1)}%` }
              : { width: '100%' }
          }
        />
        <div className="dp-indicator">
          {amountPlans > 1 ? (
            <span role="feed">
              <strong>{compactNumber(values[0])}</strong>
            </span>
          ) : (
            <span />
          )}
          <span>
            <strong>{compactNumber(values[amountPlans - 1])}</strong>
          </span>
        </div>
      </div>
    </>
  );
};

Slider.propTypes = {
  planType: PropTypes.oneOf([PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit])
    .isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedPlanIndex: PropTypes.number.isRequired,
  handleChange: PropTypes.func,
};
