import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';

export const OverlaySection = ({ messageKey, textLinkKey, urlKey }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <FormattedMessageMarkdown id={messageKey} />
      <FormattedMessage
        id={textLinkKey}
        values={{
          Link: (chunk) => (
            <a href={_(urlKey)} className="dp-button button-medium primary-green m-t-18">
              <strong>{chunk}</strong>
            </a>
          ),
        }}
      />
    </>
  );
};
