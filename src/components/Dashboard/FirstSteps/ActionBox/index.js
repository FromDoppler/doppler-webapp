import React from 'react';
import PropTypes from 'prop-types';
import {
  COMPLETED_STATUS,
  INFO_BY_STATE,
  PENDING_STATUS,
  WARNING_STATUS,
} from '../reducers/firstStepsReducer';
import { useIntl } from 'react-intl';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';

export const ActionBox = ({ status, titleId, descriptionId, textStep }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className={`dp-step ${INFO_BY_STATE[status].classNames}`} role="alert" aria-label="step">
      <h4>
        <span className="dp-iconstep">{status === PENDING_STATUS ? textStep : ''}</span>
        {_(titleId)}
      </h4>
      <FormattedMessageMarkdown id={descriptionId} />
    </div>
  );
};

ActionBox.propTypes = {
  status: PropTypes.oneOf([PENDING_STATUS, COMPLETED_STATUS, WARNING_STATUS]).isRequired,
  titleId: PropTypes.string.isRequired,
  descriptionId: PropTypes.string,
  textStep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
