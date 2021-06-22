import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { compactNumber, thousandSeparatorNumber } from '../../../utils';

export const Slider = ({ planDescriptions, defaultValue, handleChange }) => {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(defaultValue);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <div className="dp-calc-quantity">
        <h3>
          {thousandSeparatorNumber(intl.defaultLocale, planDescriptions[selectedPlanIndex].amount)}
        </h3>
        <h4>{_(planDescriptions[selectedPlanIndex].descriptionId)}</h4>
      </div>
      <div className="dp-calc-slider progress-bar">
        {planDescriptions.length > 1 ? (
          <input
            className="range-slider"
            type="range"
            min={0}
            max={planDescriptions.length - 1}
            step={1}
            defaultValue={defaultValue}
            onChange={(e) => {
              handleChange(e.target.value);
              setSelectedPlanIndex(e.target.value);
            }}
          />
        ) : (
          <input
            className="range-slider"
            type="range"
            disabled
            min="0"
            max="1"
            step="1"
            defaultValue="1"
          />
        )}
        <div
          className="progress-anchor"
          style={
            planDescriptions.length > 1
              ? { width: (selectedPlanIndex * 100) / (planDescriptions.length - 1) + '%' }
              : { width: '100%' }
          }
        ></div>
        <div className="dp-indicator">
          {planDescriptions.length > 1 ? (
            <span>
              <strong>{compactNumber(planDescriptions[0].amount)}</strong>
            </span>
          ) : (
            <span></span>
          )}
          <span>
            <strong>{compactNumber(planDescriptions[planDescriptions.length - 1].amount)}</strong>
          </span>
        </div>
      </div>
    </>
  );
};
