import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  COMPLETED_STATUS,
  INFO_BY_STATE,
  PENDING_STATUS,
  WARNING_STATUS,
} from '../reducers/firstStepsReducer';

export const ActionBox = ({ status, titleId, descriptionId, textStep, link, trackingId }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div
      className={`dp-postcard ${INFO_BY_STATE[status].classNames}`}
      role="alert"
      aria-label="step"
    >
      <header>
        <span className="dp-iconpostcard">{status === PENDING_STATUS ? textStep : ''}</span>
        <FormattedMessage
          id={titleId}
          values={{
            Link: (chunk) => (
              <h4>
                <a href={_(link)} id={trackingId}>
                  {chunk}
                </a>
              </h4>
            ),
          }}
        />
      </header>
      <article>
        <FormattedMessage
          id={descriptionId}
          values={{
            Paragraph: (chunk) => <p>{chunk}</p>,
            Link: (chunk) => (
              <a href={_(link)} id={trackingId}>
                {chunk}
              </a>
            ),
            Bold: (chunk) => <strong>{chunk}</strong>,
          }}
        />
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
