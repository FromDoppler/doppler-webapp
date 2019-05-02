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
      <div className="dp-wrapper-messages">
        {reason === SiteTrackingNotAvailableReasons.freeAccount ? (
          // Free accounts cannot enable trial, they should buy
          <>
            <FormattedMessage tagName="h2" id="reports.upgrade_account_free_title" />
            <FormattedHTMLMessage
              tagName="div"
              id="reports.upgrade_account_free_HTML"
              values={{ dopplerBaseUrl: dopplerLegacyUrl }}
            />
          </>
        ) : reason === SiteTrackingNotAvailableReasons.trialNotAccepted ? (
          // Any paid account can enable the trial
          <>
            <FormattedMessage tagName="h2" id="reports.allow_enable_trial_title" />
            <FormattedHTMLMessage tagName="div" id="reports.allow_enable_trial_HTML" />
            <div className="dp-messages-actions">
              {/* TODO: implement this action DBR-227 */}
              <button className="dp-button button-medium primary-green">
                <FormattedMessage id="reports.allow_enable_trial_button" />
              </button>
            </div>
          </>
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
