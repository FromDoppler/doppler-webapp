import account_information_icon from '../components/ControlPanel/images/account_information_icon.png';
import account_movements_icon from '../components/ControlPanel/images/account_movements_icon.png';
import contact_information_icon from '../components/ControlPanel/images/contact_information_icon.png';
import billing_information_icon from '../components/ControlPanel/images/billing_information_icon.png';
import sms_settings_icon from '../components/ControlPanel/images/sms_settings_icon.png';
import plans_and_specs_icon from '../components/ControlPanel/images/plans_and_specs_icon.png';
import footer_and_header_icon from '../components/ControlPanel/images/footer_and_header_icon.png';
import unsubscription_link_icon from '../components/ControlPanel/images/unsubscription_link_icon.png';
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
import eventbrite_icon from '../components/ControlPanel/images/eventbrite_icon.png';
import facebook_lead_ads_icon from '../components/ControlPanel/images/facebook_lead_ads_icon.png';
import go_to_webinar_icon from '../components/ControlPanel/images/go_to_webinar_icon.png';
import hubspot_icon from '../components/ControlPanel/images/hubspot_icon.png';
import optin_monster_icon from '../components/ControlPanel/images/optin_monster_icon.png';
import salesforce_icon from '../components/ControlPanel/images/salesforce_icon.png';
import zapier_icon from '../components/ControlPanel/images/zapier_icon.png';
import facebook_icon from '../components/ControlPanel/images/facebook_icon.png';
import infor_icon from '../components/ControlPanel/images/infor_icon.png';
import lander__icon from '../components/ControlPanel/images/lander__icon.png';
import learnpress_icon from '../components/ControlPanel/images/learnpress_icon.png';
import payu_icon from '../components/ControlPanel/images/payu_icon.png';
import viewed_icon from '../components/ControlPanel/images/viewed_icon.png';
import wix_icon from '../components/ControlPanel/images/wix_icon.png';
import wizell_icon from '../components/ControlPanel/images/wizell_icon.png';
import xintel_icon from '../components/ControlPanel/images/xintel_icon.png';
import mercadolibre_icon from '../components/ControlPanel/images/mercadolibre_icon.png';
import mercado_shops_icon from '../components/ControlPanel/images/mercadoshops_icon.png';
import dynamics_icon from '../components/ControlPanel/images/dynamics_icon.png';
import mitienda_icon from '../components/ControlPanel/images/mitienda-icon.png';
import tiendup_icon from '../components/ControlPanel/images/tiendup_icon.png';

import { AppSession } from './app-session';
import { RefObject } from 'react';

const urlBase = process.env.REACT_APP_DOPPLER_LEGACY_URL;
const urlControlPanel = `${urlBase}/ControlPanel`;
const urlIntegrations = `${urlBase}/Integration/Integration`;
const urlAccountPreferences = `${urlControlPanel}/AccountPreferences`;
const urlCampaignsPreferences = `${urlControlPanel}/CampaignsPreferences`;
const urlSocialPreferences = `${urlControlPanel}/SocialPreferences`;
const urlAdvancedPreferences = `${urlControlPanel}/AdvancedPreferences`;
const urlSitesHelp = process.env.REACT_APP_DOPPLER_HELP_URL;

export interface ControlPanelService {
  getControlPanelSections(_: (id: string, values?: any) => string): ControlPanelSection[];
}

interface Box {
  linkUrl: string;
  imgSrc: string;
  imgAlt: string;
  iconName: string;
  disabled?: boolean;
  hidden?: boolean;
  status?: string;
  targetBlank?: boolean;
  name?: string;
  ribbonColor?: string;
  ribbonText?: string;
}

interface ControlPanelSection {
  title: string;
  showStatus?: boolean;
  anchorLink: string;
  boxes: Box[];
}

export class ControlPanelService implements ControlPanelService {
  private readonly appSessionRef: RefObject<AppSession>;

  constructor({ appSessionRef }: { appSessionRef: RefObject<AppSession> }) {
    this.appSessionRef = appSessionRef;
  }

  public getControlPanelSections(_: (id: string, values?: any) => string): ControlPanelSection[] {
    const account =
      this.appSessionRef.current?.status === 'authenticated'
        ? this.appSessionRef.current.userData
        : 'none';
    const isClientManager = account !== 'none' ? account.user.hasClientManager : false;
    const isFreeAccount = account !== 'none' ? account.user.plan.isFreeAccount : false;

    return [
      {
        title: 'control_panel.account_preferences.title',
        anchorLink: 'account-preferences',
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
            disabled: isFreeAccount,
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
            disabled: isFreeAccount,
          },
          {
            linkUrl: `${urlAccountPreferences}/GetSmsConfiguration`,
            imgSrc: sms_settings_icon,
            imgAlt: 'control_panel.account_preferences.sms_settings_title',
            iconName: 'control_panel.account_preferences.sms_settings_title',
            disabled: isFreeAccount || isClientManager,
          },
          {
            linkUrl: 'AccountPreferences/plan-selection',
            imgSrc: plans_and_specs_icon,
            imgAlt: 'control_panel.account_preferences.plans_and_specs_title',
            iconName: 'control_panel.account_preferences.plans_and_specs_title',
            hidden: true,
          },
        ],
      },
      {
        title: 'control_panel.campaign_preferences.title',
        anchorLink: 'campaign-preferences',
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
          },
        ],
      },
      {
        title: 'control_panel.social_preferences.title',
        anchorLink: 'social-preferences',
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
        anchorLink: 'advanced-preferences',
        showStatus: false,
        boxes: [
          {
            name: 'ApiKey',
            linkUrl: `${urlAdvancedPreferences}/GetDopplerApiInformation`,
            imgSrc: doppler_api_icon,
            imgAlt: 'control_panel.advanced_preferences.api_key',
            iconName: 'control_panel.advanced_preferences.api_key',
          },
          {
            name: 'DKIM',
            linkUrl: `${urlAdvancedPreferences}/dkim`,
            imgSrc: domain_key_icon,
            imgAlt: 'control_panel.advanced_preferences.domain_key',
            iconName: 'control_panel.advanced_preferences.domain_key',
          },
          {
            name: 'CustomDomain',
            linkUrl: `${urlAdvancedPreferences}/CustomDomains`,
            imgSrc: custom_domain_icon,
            imgAlt: 'control_panel.advanced_preferences.custom_domain',
            iconName: 'control_panel.advanced_preferences.custom_domain',
          },
        ],
      },
      {
        title: 'control_panel.native_integrations.title',
        showStatus: true,
        anchorLink: 'native-integrations',
        boxes: [
          {
            name: 'GoogleAnaliytic',
            linkUrl: `${urlAdvancedPreferences}/GetGoogleAnaliyticPreferences`,
            imgSrc: google_analitics_icon,
            imgAlt: 'control_panel.native_integrations.google_Analityc_title',
            iconName: 'control_panel.native_integrations.google_Analityc_title',
          },
          {
            name: 'Zoho',
            linkUrl: `${urlIntegrations}/ZohoSection`,
            imgSrc: zoho_icon,
            imgAlt: 'control_panel.native_integrations.zoho_title',
            iconName: 'control_panel.native_integrations.zoho_title',
          },
          {
            name: 'TokkoBroker',
            linkUrl: `${urlIntegrations}/TokkoSection`,
            imgSrc: tokko_icon,
            imgAlt: 'control_panel.native_integrations.tokko_title',
            iconName: 'control_panel.native_integrations.tokko_title',
          },
          {
            name: 'Tiendanube',
            linkUrl: `${urlIntegrations}/TiendaNubeSection`,
            imgSrc: Tiendanube_icon,
            imgAlt: 'control_panel.native_integrations.tiendanube_title',
            iconName: 'control_panel.native_integrations.tiendanube_title',
          },
          {
            name: 'Vtex',
            linkUrl: `${urlIntegrations}/VtexSection`,
            imgSrc: vtex_icon,
            imgAlt: 'control_panel.native_integrations.vtex_title',
            iconName: 'control_panel.native_integrations.vtex_title',
          },
          {
            name: 'Prestashop',
            linkUrl: `${urlIntegrations}/PrestashopSection`,
            imgSrc: prestashop_icon,
            imgAlt: 'control_panel.native_integrations.prestashop_title',
            iconName: 'control_panel.native_integrations.prestashop_title',
          },
          {
            name: 'Shopify',
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
            name: 'Magento',
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
            name: 'Woocommerce',
            linkUrl: `${urlIntegrations}/WooCommerceSection`,
            imgSrc: woocommerce_icon,
            imgAlt: 'control_panel.native_integrations.woocommerce_title',
            iconName: 'control_panel.native_integrations.woocommerce_title',
          },
          {
            name: 'Easycommerce',
            linkUrl: `${urlIntegrations}/EasycommerceSection`,
            imgSrc: easycommerce_icon,
            imgAlt: 'control_panel.native_integrations.easycommerce_title',
            iconName: 'control_panel.native_integrations.easycommerce_title',
          },
          {
            name: 'BmwRspCrm',
            linkUrl: `${urlIntegrations}/BmwCrmSection`,
            imgSrc: bmw_crm_icon,
            imgAlt: 'control_panel.native_integrations.bmw_rsp_crm_title',
            iconName: 'control_panel.native_integrations.bmw_rsp_crm_title',
          },
          {
            name: 'BigQuery',
            linkUrl: '/integrations/big-query',
            imgSrc: bigquery_icon,
            imgAlt: 'control_panel.native_integrations.big_query_title',
            iconName: 'control_panel.native_integrations.big_query_title',
          },
          {
            name: 'MercadoLibre',
            linkUrl: `${urlIntegrations}/MercadoLibreSection`,
            imgSrc: mercadolibre_icon,
            imgAlt: 'control_panel.native_integrations.mercadolibre_title',
            iconName: 'control_panel.native_integrations.mercadolibre_title',
            ribbonColor: 'violet',
            ribbonText: 'promotional_ribbons.new',
          },
          {
            name: 'MercadoShops',
            linkUrl: `${urlIntegrations}/MercadoShopsSection`,
            imgSrc: mercado_shops_icon,
            imgAlt: 'control_panel.native_integrations.mercadoshops_title',
            iconName: 'control_panel.native_integrations.mercadoshops_title',
            ribbonColor: 'violet',
            ribbonText: 'promotional_ribbons.new',
          },
          {
            name: 'MiTienda',
            linkUrl: `${urlIntegrations}/MiTiendaSection`,
            imgSrc: mitienda_icon,
            imgAlt: 'control_panel.native_integrations.mitienda_title',
            iconName: 'control_panel.native_integrations.mitienda_title',
            ribbonColor: 'violet',
            ribbonText: 'promotional_ribbons.new',
          },
        ],
      },
      {
        title: 'control_panel.zapier_integrations.title',
        anchorLink: 'zapier-integrations',
        boxes: [
          {
            linkUrl: `${urlSitesHelp}/es/integracion-con-zapier-glosario`,
            imgSrc: zapier_icon,
            imgAlt: 'control_panel.zapier_integrations.zapier',
            iconName: 'control_panel.zapier_integrations.zapier',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-doppler-con-facebookleadads-utilizando-zapier`,
            imgSrc: facebook_lead_ads_icon,
            imgAlt: 'control_panel.zapier_integrations.lead_ads',
            iconName: 'control_panel.zapier_integrations.lead_ads',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-doppler-con-optinmonster-utilizando-zapier`,
            imgSrc: optin_monster_icon,
            imgAlt: 'control_panel.zapier_integrations.optin_monster',
            iconName: 'control_panel.zapier_integrations.optin_monster',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-doppler-con-hubspot-a-traves-de-zapier`,
            imgSrc: hubspot_icon,
            imgAlt: 'control_panel.zapier_integrations.hubspot',
            iconName: 'control_panel.zapier_integrations.hubspot',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-doppler-con-salesforce-a-traves-de-zapier`,
            imgSrc: salesforce_icon,
            imgAlt: 'control_panel.zapier_integrations.salesforce',
            iconName: 'control_panel.zapier_integrations.salesforce',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-doppler-con-eventbrite-a-traves-de-zapier`,
            imgSrc: eventbrite_icon,
            imgAlt: 'control_panel.zapier_integrations.eventbrite',
            iconName: 'control_panel.zapier_integrations.eventbrite',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/integrar-doppler-con-gotowebinar-via-zapier`,
            imgSrc: go_to_webinar_icon,
            imgAlt: 'control_panel.zapier_integrations.go_to_webinar',
            iconName: 'control_panel.zapier_integrations.go_to_webinar',
            targetBlank: true,
          },
        ],
      },
      {
        title: 'control_panel.external_integrations.title',
        anchorLink: 'external-integrations',
        boxes: [
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-doppler-con-payu`,
            imgSrc: payu_icon,
            imgAlt: 'control_panel.external_integrations.payU_title',
            iconName: 'control_panel.external_integrations.payU_title',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-doppler-con-infor-crm`,
            imgSrc: infor_icon,
            imgAlt: 'control_panel.external_integrations.infor_title',
            iconName: 'control_panel.external_integrations.infor_title',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-wizell-con-doppler`,
            imgSrc: wizell_icon,
            imgAlt: 'control_panel.external_integrations.wizell_title',
            iconName: 'control_panel.external_integrations.wizell_title',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-doppler-con-xintel`,
            imgSrc: xintel_icon,
            imgAlt: 'control_panel.external_integrations.xintel_title',
            iconName: 'control_panel.external_integrations.xintel_title',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/insertar-formulario-en-wix`,
            imgSrc: wix_icon,
            imgAlt: 'control_panel.external_integrations.wix_title',
            iconName: 'control_panel.external_integrations.wix_title',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/en/como-integrar-doppler-y-lander`,
            imgSrc: lander__icon,
            imgAlt: 'control_panel.external_integrations.lander_title',
            iconName: 'control_panel.external_integrations.lander_title',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-formularios-de-wordpress-con-doppler`,
            imgSrc: learnpress_icon,
            imgAlt: 'control_panel.external_integrations.leanrpress_title',
            iconName: 'control_panel.external_integrations.leanrpress_title',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-videos-en-tus-campanas`,
            imgSrc: viewed_icon,
            imgAlt: 'control_panel.external_integrations.viewed_title',
            iconName: 'control_panel.external_integrations.viewed_title',
            targetBlank: true,
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-publicar-un-formulario-en-una-facebook-tab`,
            imgSrc: facebook_icon,
            imgAlt: 'control_panel.external_integrations.facebook_title',
            iconName: 'control_panel.external_integrations.facebook_title',
            targetBlank: true,
          },
          {
            linkUrl: _('control_panel.external_integrations.dynamics_link_url'),
            imgSrc: dynamics_icon,
            imgAlt: 'control_panel.external_integrations.dynamics_title',
            iconName: 'control_panel.external_integrations.dynamics_title',
            targetBlank: true,
            ribbonColor: 'violet',
            ribbonText: 'promotional_ribbons.new',
          },
          {
            linkUrl: `${urlSitesHelp}/es/como-integrar-doppler-con-tiendup`,
            imgSrc: tiendup_icon,
            imgAlt: 'control_panel.external_integrations.tiendup_title',
            iconName: 'control_panel.external_integrations.tiendup_title',
            targetBlank: true,
            ribbonColor: 'violet',
            ribbonText: 'promotional_ribbons.new',
          },
        ],
      },
    ];
  }
}
