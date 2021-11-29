import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';
import { useIntl } from 'react-intl';

export const Notification = ({ iconClass, titleId, descriptionId }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className={`dp-step ${iconClass}`} role="alert" aria-label="notification">
      <h4>
        <span className="dp-iconstep" />
        {_(titleId)}
      </h4>
      <FormattedMessageMarkdown id={descriptionId} />
    </div>
  );
};

Notification.propTypes = {
  iconClass: PropTypes.string.isRequired,
  titleId: PropTypes.string.isRequired,
  descriptionId: PropTypes.string,
};
