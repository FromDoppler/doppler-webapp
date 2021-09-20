import React from 'react';
import Slide from './Slide/Slide';

const Carousel = ({ title, description, link }) => {
  return (
    <div className="dp-carousel" id="carousel1" role="carousel">
      <div className="dp-carousel-wrapper dp-carousel-orange">
        <div className="dp-carousel-content">
          <Slide></Slide>
          <Slide></Slide>
        </div>
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
