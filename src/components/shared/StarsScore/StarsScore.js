import React from 'react';

export const StarsScore = ({ score }) => {
  const getStarCssClassName = (actualStarNumber, score) => {
    return actualStarNumber <= score ? 'icon-star' : 'icon-star-filled';
  };
  return (
    <div className="dp-calification">
      <span className={'ms-icon ' + getStarCssClassName(1, score)}></span>
      <span className={'ms-icon ' + getStarCssClassName(2, score)}></span>
      <span className={'ms-icon ' + getStarCssClassName(3, score)}></span>
    </div>
  );
};
