import React from 'react';

export const Slider = ({ min, max, step, defaultValue, handleChange }) => {
  // TODO: add styles
  return (
    <input
      style={{ marginTop: '100px', padding: '0' }}
      type="range"
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};
