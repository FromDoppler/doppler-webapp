import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function({ page }) {
  if (page) {
    return (
      <div className="wrapper-loading">
        <div className="loading-page">
          <FormattedMessage id="loading" tagName="p" className="flash" />
        </div>
      </div>
    );
  }
  return (
    <div>
      <FormattedMessage id="loading" />
    </div>
  );
}
