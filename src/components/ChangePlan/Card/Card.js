import React from 'react';

const Card = ({ children, cssClass }) => {
  return <div class={`dp-card ${cssClass}`}>{children}</div>;
};

export default Card;
