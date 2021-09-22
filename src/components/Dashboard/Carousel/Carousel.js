import React from 'react';

const Carousel = ({ children }) => {
  return (
    <div className="dp-carousel" id="carousel1">
      <div className="dp-carousel-wrapper dp-carousel-orange">
        <div className="dp-carousel-content">{children}</div>
      </div>
      <div className="dp-carousel-dots">
        <input
          className="dp-carousel-dot"
          checked
          type="radio"
          value="first"
          id="first"
          name="carousel1"
        />
        <input
          className="dp-carousel-dot"
          type="radio"
          value="second"
          id="second"
          name="carousel1"
        />
      </div>
    </div>
  );
};

export default Carousel;
