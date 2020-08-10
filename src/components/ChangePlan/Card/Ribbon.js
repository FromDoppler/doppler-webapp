import React from 'react';

const Ribbon = ({ children, position }) => {
  return <div className={`dp-ribbon dp-ribbon-${position}`}>{children}</div>;
};

export default Ribbon;
