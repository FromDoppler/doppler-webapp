import React from 'react';
import PropTypes from 'prop-types';

export const Notification = ({ iconClass, title, description }) => {
  return (
    <div className={`dp-step ${iconClass}`} role="alert" aria-label="notification">
      <h4>
        <span className="dp-iconstep" />
        {title}
      </h4>
      <small dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
};

Notification.propTypes = {
  iconClass: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};
