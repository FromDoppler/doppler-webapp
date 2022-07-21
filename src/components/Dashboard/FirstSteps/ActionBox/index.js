import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';
import {
  COMPLETED_STATUS,
  INFO_BY_STATE,
  PENDING_STATUS,
  WARNING_STATUS,
} from '../reducers/firstStepsReducer';

export const ActionBox = ({ status, titleId, descriptionId, textStep, trackingId }) => {
  return (
    <div
      className={`dp-postcard ${INFO_BY_STATE[status].classNames}`}
      role="alert"
      aria-label="step"
      id={trackingId}
    >
      <header>
        <span className="dp-iconpostcard">{status === PENDING_STATUS ? textStep : ''}</span>
        <FormattedMessageMarkdown id={titleId} />
      </header>
      <article>
        <FormattedMessageMarkdown id={descriptionId} />
      </article>
    </div>
  );
};

ActionBox.propTypes = {
  status: PropTypes.oneOf([PENDING_STATUS, COMPLETED_STATUS, WARNING_STATUS]).isRequired,
  titleId: PropTypes.string.isRequired,
  descriptionId: PropTypes.string,
  textStep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
