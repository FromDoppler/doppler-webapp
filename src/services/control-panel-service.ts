import account_information_icon from '../components/ControlPanel/images/account_information_icon.png';
import account_movements_icon from '../components/ControlPanel/images/account_movements_icon.png';
import contact_information_icon from '../components/ControlPanel/images/contact_information_icon.png';
import billing_information_icon from '../components/ControlPanel/images/billing_information_icon.png';
import sms_settings_icon from '../components/ControlPanel/images/sms_settings_icon.png';
import plans_and_specs_icon from '../components/ControlPanel/images/plans_and_specs_icon.png';
import footer_and_header_icon from '../components/ControlPanel/images/footer_and_header_icon.png';
import unsubscription_link_icon from '../components/ControlPanel/images/unsubscription_link_icon.png';
import unopened_mails_config_icon from '../components/ControlPanel/images/unopened_mails_config_icon.png';
import subscribers_scoring_icon from '../components/ControlPanel/images/subscribers_scoring_icon.png';
import bounce_handling_icon from '../components/ControlPanel/images/bounce_handling_icon.png';
import contact_policy_icon from '../components/ControlPanel/images/contact_policy_icon.svg';
import email_parameter_icon from '../components/ControlPanel/images/email_parameter_icon.png';
import site_tracking_icon from '../components/ControlPanel/images/site_tracking_icon.png';
import social_network_icon from '../components/ControlPanel/images/social_network_icon.png';
import rss_preferences_icon from '../components/ControlPanel/images/rss_preferences_icon.png';
import viralization_icon from '../components/ControlPanel/images/viralization_icon.png';
import auto_publish_icon from '../components/ControlPanel/images/auto_publish_icon.png';
import { AppSession } from './app-session';
import { RefObject } from 'react';

const urlControlPanel = process.env.REACT_APP_DOPPLER_LEGACY_URL + '/ControlPanel';
const urlAccountPreferences = `${urlControlPanel}/AccountPreferences`;
const urlCampaignsPreferences = `${urlControlPanel}/CampaignsPreferences`;
const urlSocialPreferences = `${urlControlPanel}/SocialPreferences`;

export interface ControlPanelService {
  getControlPanelSections(): ControlPanelSection[];
}

interface Box {
  linkUrl: string;
  imgSrc: string;
  imgAlt: string;
  iconName: string;
  disabled?: boolean;
}

interface ControlPanelSection {
  title: string;
  boxes: Box[];
}

export class ControlPanelService implements ControlPanelService {
  private readonly appSessionRef: RefObject<AppSession>;

  constructor({ appSessionRef }: { appSessionRef: RefObject<AppSession> }) {
    this.appSessionRef = appSessionRef;
  }

  public getControlPanelSections(): ControlPanelSection[] {
    const account =
      this.appSessionRef.current?.status === 'authenticated'
        ? this.appSessionRef.current.userData
        : 'none';
    const isClientManager = account !== 'none' ? account.user.hasClientManager : false;
    const siteTrackingEnabled = account !== 'none' ? account.features.siteTrackingEnabled : false;

    return [
      {
        title: 'control_panel.account_preferences.title',
        boxes: [
          {
            linkUrl: `${urlAccountPreferences}/GetAccountInformation`,
            imgSrc: account_information_icon,
            imgAlt: 'control_panel.account_preferences.account_information_title',
            iconName: 'control_panel.account_preferences.account_information_title',
          },
          {
            linkUrl: `${urlAccountPreferences}/GetAccountHistory`,
            imgSrc: account_movements_icon,
            imgAlt: 'control_panel.account_preferences.account_movements_title',
            iconName: 'control_panel.account_preferences.account_movements_title',
          },
          {
            linkUrl: `${urlAccountPreferences}/GetContactInformation`,
            imgSrc: contact_information_icon,
            imgAlt: 'control_panel.account_preferences.contact_information_title',
            iconName: 'control_panel.account_preferences.contact_information_title',
          },
          {
            linkUrl: isClientManager
              ? `${urlAccountPreferences}/GetBillingInformation`
              : `${urlAccountPreferences}/BillingInformationSettings`,
            imgSrc: billing_information_icon,
            imgAlt: 'control_panel.account_preferences.billing_information_title',
            iconName: 'control_panel.account_preferences.billing_information_title',
          },
          {
            linkUrl: `${urlAccountPreferences}/GetSmsConfiguration`,
            imgSrc: sms_settings_icon,
            imgAlt: 'control_panel.account_preferences.sms_settings_title',
            iconName: 'control_panel.account_preferences.sms_settings_title',
            disabled: isClientManager,
          },
          {
            linkUrl: 'AccountPreferences/plan-selection',
            imgSrc: plans_and_specs_icon,
            imgAlt: 'control_panel.account_preferences.plans_and_specs_title',
            iconName: 'control_panel.account_preferences.plans_and_specs_title',
          },
        ],
      },
      {
        title: 'control_panel.campaign_preferences.title',
        boxes: [
          {
            linkUrl: `${urlCampaignsPreferences}/GetFootAndHeaderPreferences`,
            imgSrc: footer_and_header_icon,
            imgAlt: 'control_panel.campaign_preferences.footer_and_header_preferences_title',
            iconName: 'control_panel.campaign_preferences.footer_and_header_preferences_title',
          },
          {
            linkUrl: `${urlCampaignsPreferences}/GetUnsubscriberLink`,
            imgSrc: unsubscription_link_icon,
            imgAlt: 'control_panel.campaign_preferences.unsubscription_link_title',
            iconName: 'control_panel.campaign_preferences.unsubscription_link_title',
          },
          {
            linkUrl: `${urlCampaignsPreferences}/GetUnopenedMailsConfiguration`,
            imgSrc: unopened_mails_config_icon,
            imgAlt: 'control_panel.campaign_preferences.unopened_mails_config_title',
            iconName: 'control_panel.campaign_preferences.unopened_mails_config_title',
          },
          {
            linkUrl: `${urlCampaignsPreferences}/GetSubscribersScoringConfiguration`,
            imgSrc: subscribers_scoring_icon,
            imgAlt: 'control_panel.campaign_preferences.subscribers_scoring_title',
            iconName: 'control_panel.campaign_preferences.subscribers_scoring_title',
          },
          {
            linkUrl: `${urlCampaignsPreferences}/GetUserReboundsCleanConfiguration`,
            imgSrc: bounce_handling_icon,
            imgAlt: 'control_panel.campaign_preferences.bounce_handling_title',
            iconName: 'control_panel.campaign_preferences.bounce_handling_title',
          },
          {
            linkUrl: '/sending-preferences/contact-policy',
            imgSrc: contact_policy_icon,
            imgAlt: 'control_panel.campaign_preferences.contact_policy_title',
            iconName: 'control_panel.campaign_preferences.contact_policy_title',
          },
          {
            linkUrl: `${urlCampaignsPreferences}/GetEmailParameterConfiguration`,
            imgSrc: email_parameter_icon,
            imgAlt: 'control_panel.campaign_preferences.email_parameter_title',
            iconName: 'control_panel.campaign_preferences.email_parameter_title',
          },
          siteTrackingEnabled
            ? {
                linkUrl: `${urlCampaignsPreferences}/SiteTrackingSettings`,
                imgSrc: site_tracking_icon,
                imgAlt: 'control_panel.campaign_preferences.site_tracking_title',
                iconName: 'control_panel.campaign_preferences.site_tracking_title',
              }
            : { linkUrl: '', imgSrc: '', imgAlt: '', iconName: '' },
        ],
      },
      {
        title: 'control_panel.social_preferences.title',
        boxes: [
          {
            linkUrl: `${urlSocialPreferences}/GetSocialNetworkShareXUsers`,
            imgSrc: social_network_icon,
            imgAlt: 'control_panel.social_preferences.social_network_title',
            iconName: 'control_panel.social_preferences.social_network_title',
          },
          {
            linkUrl: `${urlSocialPreferences}/GetRssPreferences`,
            imgSrc: rss_preferences_icon,
            imgAlt: 'control_panel.social_preferences.rss_preferences_title',
            iconName: 'control_panel.social_preferences.rss_preferences_title',
          },
          {
            linkUrl: `${urlSocialPreferences}/GetSocialNetworkCustomizations`,
            imgSrc: viralization_icon,
            imgAlt: 'control_panel.social_preferences.viralization_title',
            iconName: 'control_panel.social_preferences.viralization_title',
          },
          {
            linkUrl: `${urlSocialPreferences}/GetAutoPublishPreferences`,
            imgSrc: auto_publish_icon,
            imgAlt: 'control_panel.social_preferences.auto_publish_title',
            iconName: 'control_panel.social_preferences.auto_publish_title',
          },
        ],
      },
    ];
  }
}
