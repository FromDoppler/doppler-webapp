import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function({ page }) {
  if (page) {
    return (
      <div className="wrapper-loading">
        <div className="loading-page">
          <p id="loading" className="flash">
            &nbsp;
          </p>
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
