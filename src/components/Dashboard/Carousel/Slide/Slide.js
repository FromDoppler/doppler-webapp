import React from 'react';

const Slide = ({ children }) => {
  return (
    <div className="dp-carousel-slide active" data-order="first">
      {children}
    </div>
  );
};

export default Slide;
