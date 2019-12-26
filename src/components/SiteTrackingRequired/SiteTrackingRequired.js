import React, { useState } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import SafeRedirect from '../SafeRedirect';

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
      dopplerLegacyClient,
    },
  }) => {
    const [state, setState] = useState({});

    if (state.isActivatedTrial) {
      return <SafeRedirect to="/ControlPanel/CampaignsPreferences/SiteTrackingSettings" />;
    }

    const activateTrial = async () => {
      setState({ isLoading: true });
      try {
        const isActivatedTrial = await dopplerLegacyClient.activateSiteTrackingTrial();
        if (isActivatedTrial.success) {
          setState({ isActivatedTrial: true });
        }
      } finally {
        setState({ isLoading: false });
      }
    };

    return (
      <section className="container-reports bg-message--grey">
        <div className="dp-wrapper-messages">
          {reason === SiteTrackingNotAvailableReasons.freeAccount ? (
            // Free accounts cannot enable trial, they should buy
            <>
              <FormattedMessage tagName="h2" id="reports.upgrade_account_free_title" />
              <FormattedHTMLMessage tagName="div" id="reports.upgrade_account_free_HTML" />
            </>
          ) : reason === SiteTrackingNotAvailableReasons.trialNotAccepted ? (
            // Any paid account can enable the trial
            <>
              <FormattedMessage tagName="h2" id="reports.allow_enable_trial_title" />
              <FormattedHTMLMessage tagName="div" id="reports.allow_enable_trial_HTML" />
              <div className="dp-messages-actions">
                <button
                  onClick={activateTrial}
                  className={
                    'dp-button button-medium primary-green' +
                    ((state.isLoading && ' button--loading') || '')
                  }
                  disabled={state.isLoading}
                >
                  <FormattedMessage id="reports.allow_enable_trial_button" />
                </button>
              </div>
            </>
          ) : (
            // SiteTrackingNotAvailableReasons.featureDisabled
            // SiteTrackingNotAvailableReasons.thereAreNotDomains
            // SiteTrackingNotAvailableReasons.noDatahubId
            <>
              <FormattedMessage tagName="h2" id="reports.datahub_not_domains_title" />
              <FormattedHTMLMessage className="patch-no-domains" id="reports.no_domains_HTML" />
              <div className="dp-messages-actions">
                <FormattedMessage id="reports.no_domains_button_destination">
                  {(url) => (
                    <a href={url} className="dp-button button-medium primary-green">
                      <FormattedMessage id="reports.no_domains_button" />
                    </a>
                  )}
                </FormattedMessage>
              </div>
            </>
          )}
        </div>
      </section>
    );
  },
);
