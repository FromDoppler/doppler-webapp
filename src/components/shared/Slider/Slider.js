import React, { useState } from 'react';
import * as S from './Slider.styles';

export const Slider = ({ tooltipDescriptions, defaultValue, handleChange }) => {
  const [currentTooltipDescription, setCurrentTooltipDescription] = useState(
    tooltipDescriptions[defaultValue],
  );
  const [dataProgress, setDataProgress] = useState(
    (100 / tooltipDescriptions.length) * defaultValue,
  );
  // TODO: add styles
  return (
    <>
      <S.SliderTooltip dataProgress={dataProgress}>
        <span>{currentTooltipDescription}</span>
      </S.SliderTooltip>
      <input
        style={{ marginTop: '100px', padding: '0' }}
        type="range"
        min={0}
        max={tooltipDescriptions.length - 1}
        step={1}
        defaultValue={defaultValue}
        onChange={(e) => {
          setCurrentTooltipDescription(tooltipDescriptions[e.target.value]);
          setDataProgress((100 / tooltipDescriptions.length) * e.target.value);
          handleChange(e.target.value);
        }}
      />
    </>
  );
};
