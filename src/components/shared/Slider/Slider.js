import React, { useState } from 'react';

export const Slider = ({ planDescriptions, defaultValue, handleChange }) => {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(defaultValue);
  // TODO: add styles
  return (
    <div>
      <h3>{planDescriptions[selectedPlanIndex]}</h3>
      <input
        style={{ padding: '0' }}
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
    </div>
  );
};
