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
import bigquery_icon from '../components/ControlPanel/images/bigquery_icon.png';
import bmw_crm_icon from '../components/ControlPanel/images/bmw_crm_icon.png';
import easycommerce_icon from '../components/ControlPanel/images/easycommerce_icon.svg';
import google_analitics_icon from '../components/ControlPanel/images/google_analitics_icon.png';
import magento_icon from '../components/ControlPanel/images/magento_icon.png';
import prestashop_icon from '../components/ControlPanel/images/prestashop_icon.png';
import shopify_icon from '../components/ControlPanel/images/shopify_icon.png';
import Tiendanube_icon from '../components/ControlPanel/images/Tiendanube_icon.svg';
import tokko_icon from '../components/ControlPanel/images/tokko_icon.png';
import Typeform_icon from '../components/ControlPanel/images/Typeform_icon.png';
import Unbounce_icon from '../components/ControlPanel/images/Unbounce_icon.svg';
import vtex_icon from '../components/ControlPanel/images/vtex_icon.svg';
import woocommerce_icon from '../components/ControlPanel/images/woocommerce_icon.png';
import zoho_icon from '../components/ControlPanel/images/zoho_icon.png';
import custom_domain_icon from '../components/ControlPanel/images/custom_domain_icon.png';
import domain_key_icon from '../components/ControlPanel/images/domain_key_icon.png';
import doppler_api_icon from '../components/ControlPanel/images/doppler_api_icon.png';
import { AppSession } from './app-session';
import { RefObject } from 'react';

const urlBase = process.env.REACT_APP_DOPPLER_LEGACY_URL;
const urlControlPanel = `${urlBase}/ControlPanel`;
const urlIntegrations = `${urlBase}/Integration/Integration`;
const urlAccountPreferences = `${urlControlPanel}/AccountPreferences`;
const urlCampaignsPreferences = `${urlControlPanel}/CampaignsPreferences`;
const urlSocialPreferences = `${urlControlPanel}/SocialPreferences`;
const urlAdvancedPreferences = `${urlControlPanel}/AdvancedPreferences`;

export interface ControlPanelService {
  getControlPanelSections(): ControlPanelSection[];
}

interface Box {
  linkUrl: string;
  imgSrc: string;
  imgAlt: string;
  iconName: string;
  disabled?: boolean;
  hidden?: boolean;
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
          {
            linkUrl: `${urlCampaignsPreferences}/SiteTrackingSettings`,
            imgSrc: site_tracking_icon,
            imgAlt: 'control_panel.campaign_preferences.site_tracking_title',
            iconName: 'control_panel.campaign_preferences.site_tracking_title',
            hidden: !siteTrackingEnabled,
          },
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
      {
        title: 'control_panel.advanced_preferences.title',
        boxes: [
          {
            linkUrl: `${urlAdvancedPreferences}/GetDopplerApiInformation`,
            imgSrc: doppler_api_icon,
            imgAlt: 'control_panel.advanced_preferences.api_key',
            iconName: 'control_panel.advanced_preferences.api_key',
          },
          {
            linkUrl: `${urlAdvancedPreferences}/dkim`,
            imgSrc: domain_key_icon,
            imgAlt: 'control_panel.advanced_preferences.domain_key',
            iconName: 'control_panel.advanced_preferences.domain_key',
          },
          {
            linkUrl: `${urlAdvancedPreferences}/CustomDomains`,
            imgSrc: custom_domain_icon,
            imgAlt: 'control_panel.advanced_preferences.custom_domain',
            iconName: 'control_panel.advanced_preferences.custom_domain',
          },
        ],
      },
      {
        title: 'control_panel.native_integrations.title',
        boxes: [
          {
            linkUrl: `${urlAdvancedPreferences}/GetGoogleAnaliyticPreferences`,
            imgSrc: google_analitics_icon,
            imgAlt: 'control_panel.native_integrations.google_Analityc_title',
            iconName: 'control_panel.native_integrations.google_Analityc_title',
          },
          {
            linkUrl: `${urlIntegrations}/ZohoSection`,
            imgSrc: zoho_icon,
            imgAlt: 'control_panel.native_integrations.zoho_title',
            iconName: 'control_panel.native_integrations.zoho_title',
          },
          {
            linkUrl: `${urlIntegrations}/TokkoSection`,
            imgSrc: tokko_icon,
            imgAlt: 'control_panel.native_integrations.tokko_title',
            iconName: 'control_panel.native_integrations.tokko_title',
          },
          {
            linkUrl: `${urlIntegrations}/TiendaNubeSection`,
            imgSrc: Tiendanube_icon,
            imgAlt: 'control_panel.native_integrations.tiendanube_title',
            iconName: 'control_panel.native_integrations.tiendanube_title',
          },
          {
            linkUrl: `${urlIntegrations}/VtexSection`,
            imgSrc: vtex_icon,
            imgAlt: 'control_panel.native_integrations.vtex_title',
            iconName: 'control_panel.native_integrations.vtex_title',
          },
          {
            linkUrl: `${urlIntegrations}/PrestashopSection`,
            imgSrc: prestashop_icon,
            imgAlt: 'control_panel.native_integrations.prestashop_title',
            iconName: 'control_panel.native_integrations.prestashop_title',
          },
          {
            linkUrl: '/integrations/shopify',
            imgSrc: shopify_icon,
            imgAlt: 'control_panel.native_integrations.shopify_title',
            iconName: 'control_panel.native_integrations.shopify_title',
          },
          {
            linkUrl: `${urlIntegrations}/WebHookIntegration?integrationType=Unbounce`,
            imgSrc: Unbounce_icon,
            imgAlt: 'control_panel.native_integrations.unbounce_title',
            iconName: 'control_panel.native_integrations.unbounce_title',
          },
          {
            linkUrl: `${urlIntegrations}/MagentoSection`,
            imgSrc: magento_icon,
            imgAlt: 'control_panel.native_integrations.magento_title',
            iconName: 'control_panel.native_integrations.magento_title',
          },
          {
            linkUrl: `${urlIntegrations}/WebHookIntegration?integrationType=Typeform`,
            imgSrc: Typeform_icon,
            imgAlt: 'control_panel.native_integrations.typeform_title',
            iconName: 'control_panel.native_integrations.typeform_title',
          },
          {
            linkUrl: `${urlIntegrations}/WooCommerceSection`,
            imgSrc: woocommerce_icon,
            imgAlt: 'control_panel.native_integrations.woocommerce_title',
            iconName: 'control_panel.native_integrations.woocommerce_title',
          },
          {
            linkUrl: `${urlIntegrations}/EasycommerceSection`,
            imgSrc: easycommerce_icon,
            imgAlt: 'control_panel.native_integrations.easycommerce_title',
            iconName: 'control_panel.native_integrations.easycommerce_title',
          },
          {
            linkUrl: `${urlIntegrations}/BmwCrmSection`,
            imgSrc: bmw_crm_icon,
            imgAlt: 'control_panel.native_integrations.bmw_rsp_crm_title',
            iconName: 'control_panel.native_integrations.bmw_rsp_crm_title',
          },
          {
            linkUrl: '/integrations/big-query',
            imgSrc: bigquery_icon,
            imgAlt: 'control_panel.native_integrations.big_query_title',
            iconName: 'control_panel.native_integrations.big_query_title',
          },
        ],
      },
    ];
  }
}
