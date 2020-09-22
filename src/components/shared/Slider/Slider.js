import React, { useState } from 'react';

export const Slider = ({ tooltipDescriptions, defaultValue, handleChange }) => {
  const [dataProgress, setDataProgress] = useState(
    (100 / tooltipDescriptions.length) * defaultValue,
  );
  // TODO: add styles
  return (
    <>
      <input
        style={{ marginTop: '100px', padding: '0' }}
        type="range"
        min={0}
        max={tooltipDescriptions.length - 1}
        step={1}
        defaultValue={defaultValue}
        onChange={(e) => {
          setDataProgress((100 / tooltipDescriptions.length) * e.target.value);
          handleChange(e.target.value);
        }}
      />
    </>
  );
};
