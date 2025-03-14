import React, { useState } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import SafeRedirect from '../SafeRedirect';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Promotional } from '../shared/Promotional/Promotional';
import reportIcon from '../../img/reports-icon.png';
import reportGif from '../../img/reports.gif';
import { useLocation } from 'react-router-dom';
import { TypeformSurvey } from '../TypeformSurvey';
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
    const location = useLocation();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    if (state.isActivatedTrial) {
      return <SafeRedirect to="/ControlPanel/CampaignsPreferences/SiteTrackingSettings" />;
    }

    const activateTrial = async () => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      try {
        const isActivatedTrial = await dopplerLegacyClient.activateSiteTrackingTrial();
        if (isActivatedTrial.success) {
          setState((prev) => ({
            ...prev,
            isActivatedTrial: true,
          }));
        }
      } finally {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
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

    const isShowTypeformSurvey = location.pathname === '/reports';

    return (
      <section className="container-reports">
        {isShowTypeformSurvey && <TypeformSurvey />}
        <div className="dp-wrapper-messages">
          <>
            <FormattedMessage tagName="h2" id="reports.datahub_not_domains_title" />
            <FormattedMessageMarkdown
              className="patch-no-domains"
              linkTarget={'_blank'}
              id="reports.no_domains_MD"
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
                <FormattedMessage id="reports.no_domains_button" />
              </button>
            </div>
          </>
        </div>
      </section>
    );
  },
);
