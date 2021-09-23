import React from 'react';

export const Slide = ({ children, active }) => {
  return <div className={`dp-carousel-slide ${active && 'active'}`}>{children}</div>;
};
