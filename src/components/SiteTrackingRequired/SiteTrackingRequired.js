@@ -0,0 +1,47 @@
import React from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

export default InjectAppServices(
  /**
   * @param { Object } props
   * @param { import('../../services/pure-di').AppServices } props.dependencies
   */
  ({
    dependencies: {
      appSessionRef,
      appConfiguration: { dopplerLegacyUrl },
    },
  }) => {
    const isFreeAccount =
      appSessionRef.current.userData !== undefined
        ? appSessionRef.current.userData.user.plan.isFreeAccount
        : false;

    return (
      <section className="container-reports">
        <div className="wrapper-kpi">
          {isFreeAccount ? (
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
  },
);
