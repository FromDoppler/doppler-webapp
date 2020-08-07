import React from 'react';

const CardAction = ({ url, children }) => {
  return (
    <a href={url} className="dp-button button-medium primary-green">
      {children}
    </a>
  );
};

export default CardAction;
