import React from 'react';
import PropTypes from 'prop-types';
import {
  COMPLETED_STATUS,
  INFO_BY_STATE,
  PENDING_STATUS,
  WARNING_STATUS,
} from '../reducers/firstStepsReducer';

export const ActionBox = ({ status, title, description, textStep }) => {
  return (
    <div className={`dp-step ${INFO_BY_STATE[status].classNames}`} role="alert" aria-label="step">
      <h4>
        <span className="dp-iconstep">{status === PENDING_STATUS ? textStep : ''}</span>
        {title}
      </h4>
      <small dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
};

ActionBox.propTypes = {
  status: PropTypes.oneOf([PENDING_STATUS, COMPLETED_STATUS, WARNING_STATUS]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  textStep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
