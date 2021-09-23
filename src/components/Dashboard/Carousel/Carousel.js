import React, { useState } from 'react';

export const Carousel = ({ id, children, slideActiveDefault, color }) => {
  const [activeSlide, setActiveSlide] = useState(slideActiveDefault ?? 0);

  const changeSlide = (e) => setActiveSlide(parseInt(e.target.value));

  const slides = children({ activeSlide });

  return (
    <div className="dp-carousel" id={`carousel${id}`}>
      <div className={`dp-carousel-wrapper dp-carousel-${color}`}>
        <div className="dp-carousel-content">{slides}</div>
      </div>
      <div className="dp-carousel-dots">
        {slides.map((child, index) => (
          <input
            key={`${id}${index}`}
            className="dp-carousel-dot"
            checked={activeSlide === index}
            type="radio"
            value={index}
            onChange={changeSlide}
          />
        ))}
      </div>
    </div>
  );
};
