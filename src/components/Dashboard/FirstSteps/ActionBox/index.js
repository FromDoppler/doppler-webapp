import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { COMPLETED_STATUS, PENDING_STATUS } from '../../reducers/firstStepsReducer';

export const ActionBox = ({ status, titleId, descriptionId, textStep, link, trackingId }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div role="alert" aria-label="step">
      {status === COMPLETED_STATUS ? (
        <span className="dp-stepper-number dp-checked" />
      ) : (
        <span className="dp-stepper-number">{textStep}</span>
      )}
      <h4 className={status === COMPLETED_STATUS ? 'dp-crossed-text' : ''}>
        <FormattedMessage id={titleId} />
      </h4>
      {status !== COMPLETED_STATUS && (
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
      )}
    </div>
  );
};

ActionBox.propTypes = {
  status: PropTypes.oneOf([PENDING_STATUS, COMPLETED_STATUS]).isRequired,
  titleId: PropTypes.string.isRequired,
  descriptionId: PropTypes.string,
  textStep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
