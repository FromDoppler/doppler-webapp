import React, { useState } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import SafeRedirect from '../SafeRedirect';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Promotional } from '../shared/Promotional/Promotional';
import reportIcon from '../../img/reports-icon.png';
import reportGif from '../../img/reports.gif';
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
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

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

    if (reason === SiteTrackingNotAvailableReasons.freeAccount) {
      return (
        <Promotional
          title={_('reports.promotional.title')}
          description={<FormattedMessageMarkdown id={'reports.promotional.description_MD'} />}
          features={[
            <FormattedMessageMarkdown id={'reports.promotional.features.feature_1'} />,
            <FormattedMessageMarkdown id={'reports.promotional.features.feature_2'} />,
            <FormattedMessageMarkdown id={'reports.promotional.features.feature_3'} />,
          ]}
          paragraph={_('reports.promotional.paragraph')}
          actionText={_('reports.promotional.link_text')}
          actionUrl={_('contact_policy.promotional.upgrade_plan_url')}
          logoUrl={reportIcon}
          previewUrl={reportGif}
        />
      );
    }

    return (
      <section className="container-reports bg-message--grey">
        <div className="dp-wrapper-messages">
          {reason === SiteTrackingNotAvailableReasons.trialNotAccepted ? (
            // Any paid account can enable the trial
            <>
              <FormattedMessage tagName="h2" id="reports.allow_enable_trial_title" />
              <FormattedMessageMarkdown
                tagName="div"
                linkTarget={'_blank'}
                id="reports.allow_enable_trial_MD"
              />
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
              <FormattedMessageMarkdown
                className="patch-no-domains"
                linkTarget={'_blank'}
                id="reports.no_domains_MD"
              />
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
