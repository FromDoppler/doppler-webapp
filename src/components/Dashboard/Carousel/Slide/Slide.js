import React from 'react';

const Slide = ({ title, description, link }) => {
  return (
    <div className="dp-carousel-slide active" data-order="first">
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link}>
        <span className="ms-icon icon-arrow-next"></span>Ver más
      </a>
    </div>
  );
};

export default Slide;
