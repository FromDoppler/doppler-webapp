import React from 'react';

const PreviewPost = ({ post }) => {
  const { title, description, link } = post;
  return (
    <>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link}>
        <span className="ms-icon icon-arrow-next"></span>Ver más
      </a>
    </>
  );
};

export default PreviewPost;
