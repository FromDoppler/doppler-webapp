import React from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedHTMLMessage } from 'react-intl';

/**
 * @param { Object } props
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
function DatahubRequired({
  dependencies: {
    appConfiguration: { dopplerLegacyUrl },
  },
}) {
  return (
    <section className="container-reports">
      <div className="wrapper-kpi">
        {/* TODO: review this solution, probably styles, content and behavior are wrong */}
        <FormattedHTMLMessage
          id="reports.datahub_not_active_HTML"
          values={{ dopplerBaseUrl: dopplerLegacyUrl }}
        />
      </div>
    </section>
  );
}

export default InjectAppServices(DatahubRequired);
