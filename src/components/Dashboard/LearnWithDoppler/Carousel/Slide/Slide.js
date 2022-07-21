import React from 'react';

export const Slide = ({ children, active, id }) => {
  return (
    <div id={id} className={`dp-carousel-slide ${active && 'active'}`}>
      {children}
    </div>
  );
};
