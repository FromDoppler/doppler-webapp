import React from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';

export const SiteTrackingNotAvailableReasons = {
  freeAccount: 'freeAccount',
  trialNotAccepted: 'trialNotAccepted',
  featureDisabled: 'featureDisabled',
  thereAreNotDomains: 'thereAreNotDomains',
  noDatahubId: 'noDatahubId',
};

export const SiteTrackingRequired = InjectAppServices(
  /**
   * @param { Object } props
   * @param { import('../../services/pure-di').AppServices } props.dependencies
   */
  ({
    reason,
    dependencies: {
      appConfiguration: { dopplerLegacyUrl },
    },
  }) => (
    <section className="container-reports">
      <div className="wrapper-kpi">
        {reason === SiteTrackingNotAvailableReasons.freeAccount ? (
          // Free accounts cannot enable trial, they should buy
          <div>
            <FormattedMessage tagName="h3" id="reports.upgrade_account_free_title" />
            <FormattedHTMLMessage
              tagName="div"
              id="reports.upgrade_account_free_HTML"
              values={{ dopplerBaseUrl: dopplerLegacyUrl }}
            />
          </div>
        ) : reason === SiteTrackingNotAvailableReasons.trialNotAccepted ? (
          // Any paid account can enable the trial
          <div>
            <FormattedMessage tagName="h3" id="reports.datahub_not_active_title" />
            <FormattedHTMLMessage
              tagName="div"
              id="reports.datahub_not_active_HTML"
              values={{ dopplerBaseUrl: dopplerLegacyUrl }}
            />
          </div>
        ) : (
          // SiteTrackingNotAvailableReasons.featureDisabled
          // SiteTrackingNotAvailableReasons.thereAreNotDomains
          // SiteTrackingNotAvailableReasons.noDatahubId
          <FormattedHTMLMessage
            className="patch-no-domains"
            id="reports.no_domains_HTML"
            values={{ dopplerBaseUrl: dopplerLegacyUrl }}
          />
        )}
      </div>
    </section>
  ),
);
