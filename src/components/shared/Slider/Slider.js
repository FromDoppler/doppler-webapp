import React, { useState } from 'react';
import { useIntl } from 'react-intl';

export const Slider = ({ planDescriptions, defaultValue, handleChange }) => {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(defaultValue);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <div className="dp-calc-quantity">
        <h3>{planDescriptions[selectedPlanIndex].amount}</h3>
        <h4>{_(planDescriptions[selectedPlanIndex].descriptionId)}</h4>
      </div>
      <div className="dp-calc-slider progress-bar">
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
        <div
          className="progress-anchor"
          style={{ width: (selectedPlanIndex * 100) / (planDescriptions.length - 1) + '%' }}
        ></div>
        <div className="dp-indicator">
          <span>
            <strong>{planDescriptions[0].amount}</strong>
          </span>
          <span>
            <strong>{planDescriptions[planDescriptions.length - 1].amount}</strong>
          </span>
        </div>
      </div>
    </>
  );
};
