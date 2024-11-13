import React, { useEffect, useRef, useState } from 'react';
import useInterval from '../../../../../hooks/useInterval';

const DEFAULT_TIME_INTERVAL = 6000;
export const CheckoutSummaryCarousel = ({
  id,
  children,
  ariaLabel,
  numberOfItems,
  slideActiveDefault,
  showDots = true,
  timeInterval = DEFAULT_TIME_INTERVAL,
}) => {
  const [activeSlide, setActiveSlide] = useState(slideActiveDefault ?? 0);
  const createInterval = useInterval();
  const intervalIdRef = useRef(null);
  const pauseCarouselRef = useRef(false);
  const activeSlideRef = useRef(null);
  activeSlideRef.current = activeSlide;

  useEffect(() => {
    const intervalId = createInterval(() => {
      if (!pauseCarouselRef.current) {
        const nextActiveSlider =
          activeSlideRef.current >= numberOfItems - 1 ? 0 : activeSlideRef.current + 1;
        setActiveSlide(nextActiveSlider);
      }
    }, timeInterval);
    intervalIdRef.current = intervalId;
  }, [createInterval, timeInterval, numberOfItems, children]);

  const changeSlide = (e) => {
    handleStop();
    setActiveSlide(parseInt(e.target.value));
  };

  const handleMouseOver = () => {
    pauseCarouselRef.current = true;
  };

  const handleMouseOut = () => {
    pauseCarouselRef.current = false;
  };

  const handleStop = () => {
    clearInterval(intervalIdRef.current);
  };

  const slides = children({ activeSlide, handleStop });
  const mouseEvents = {
    onMouseOver: handleMouseOver,
    onMouseOut: handleMouseOut,
  };

  return (
    <div
      className="dp-carousel dp-modal-cancel"
      id={`carousel${id}`}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="dp-carousel-wrappers" {...mouseEvents}>
        <div className="dp-carousel-content">{slides}</div>
      </div>
      {showDots && (
        <div className="dp-carousel-dots">
          {slides.map((child, index) => (
            <input
              key={`${id}${index}`}
              className="dp-carousel-dot"
              checked={activeSlide === index}
              type="radio"
              value={index}
              onChange={changeSlide}
              {...mouseEvents}
            />
          ))}
        </div>
      )}
    </div>
  );
};
