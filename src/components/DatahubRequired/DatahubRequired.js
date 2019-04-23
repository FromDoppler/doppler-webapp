import React from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

/**
 * @param { Object } props
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
function DatahubRequired({
  dependencies: {
    appConfiguration: { dopplerLegacyUrl },
  },
}) {
  const freeAccount = true;

  return (
    <section className="container-reports">
      <div className="wrapper-kpi">
        {freeAccount ? (
          <div>
            <FormattedMessage tagName="h3" id="reports.upgrade_account_free_title" />
            <FormattedHTMLMessage
              tagName="div"
              id="reports.upgrade_account_free_HTML"
              values={{ dopplerBaseUrl: dopplerLegacyUrl }}
            />
          </div>
        ) : (
          <div>
            <FormattedMessage tagName="h3" id="reports.datahub_not_active_title" />
            <FormattedHTMLMessage
              tagName="div"
              id="reports.datahub_not_active_HTML"
              values={{ dopplerBaseUrl: dopplerLegacyUrl }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default InjectAppServices(DatahubRequired);
