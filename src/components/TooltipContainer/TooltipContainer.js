// TooltipContainer.js
import React from 'react';
import * as S from './TooltipContainer.styles';

export const TooltipContainer = ({ visible, content, children, orientation }) => {
  return (
    <div className="dp-tooltip-container">
      {children}
      <S.HiddenTooltip className={`dp-tooltip-${orientation} ${visible ? '' : 'hidden'}`}>
        <span> {content} </span>
      </S.HiddenTooltip>
    </div>
  );
};
