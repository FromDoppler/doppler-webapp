import axios, { AxiosStatic } from 'axios';
import { HttpDopplerLegacyClient, DopplerLegacyClient } from './doppler-legacy-client';
import { SessionManager } from './session-manager';
import React, { createContext, ReactNode, RefObject, MutableRefObject } from 'react';
import { DatahubClient, HttpDatahubClient } from './datahub-client';
import { AppSession, createAppSessionRef } from './app-session';
import { ShopifyClient, HttpShopifyClient } from './shopify-client';
import { BigQueryClient, HttpBigQueryClient } from './big-query-client';
import { DopplerApiClient, HttpDopplerApiClient } from './doppler-api-client';
import { DopplerSitesClient, HttpDopplerSitesClient } from './doppler-sites-client';
import { IpinfoClient, HttpIpinfoClient } from './ipinfo-client';
import { ExperimentalFeatures } from './experimental-features';
import { DopplerBillingApiClient, HttpDopplerBillingApiClient } from './doppler-billing-api-client';
import { DopplerUserApiClient, HttpDopplerUserApiClient } from './doppler-user-api-client';
import { DopplerBeplicApiClient, HttpDopplerBeplicApiClient } from './doppler-beplic-api-client';
import {
  DopplerPopupHubApiClient,
  HttpDopplerPopupHubApiClient,
} from './doppler-popup-hub-api-client';
import { CaptchaUtilsService } from '../components/form-helpers/captcha-utils';
import { UtmCookiesManager } from './utm-cookies-manager';
import {
  DopplerContactPolicyApiClient,
  HttpDopplerContactPolicyApiClient,
} from './doppler-contact-policy-api-client';
import { HttpStaticDataClient, StaticDataClient } from './static-data-client';
import {
  DopplerBillingUserApiClient,
  HttpDopplerBillingUserApiClient,
} from './doppler-billing-user-api-client';
import {
  DopplerAccountPlansApiClient,
  HttpDopplerAccountPlansApiClient,
} from './doppler-account-plans-api-client';
import { PlanService } from './planService';
import { HttpSystemUsageSummaryClient } from './dashboardService/SystemUsageSummary';
import { ControlPanelService } from './control-panel-service';
import { HttpReportClient, ReportClient } from './reports';
import { CampaignSummaryService } from './campaignSummary';
import { ContactSummaryService } from './contactSummary';
import { SessionMfeSessionManager } from './sessionmfe-session-manager';
import {
  DopplerSystemUsageApiClient,
  HttpDopplerSystemUsageApiClient,
} from './doppler-system-usage-api-client';

interface AppConfiguration {
  dopplerBillingApiUrl: string;
  dopplerSystemUsageApiUrl: string;
  dopplerLegacyUrl: string;
  dopplerSitesUrl: string;
  dopplerContactPolicyApiUrl: string;
  datahubUrl: string;
  dopplerLegacyKeepAliveMilliseconds: number;
  recaptchaPublicKey: string;
  useLegacy?: {
    login: boolean;
    signup: boolean;
    forgotPassword: boolean;
  };
}

/**
 * Services able to be injected
 */
export interface AppServices {
  window: Window;
  appSessionRef: RefObject<AppSession>;
  axiosStatic: AxiosStatic;
  appConfiguration: AppConfiguration;
  datahubClient: DatahubClient;
  dopplerLegacyClient: DopplerLegacyClient;
  sessionManager: SessionManager;
  localStorage: Storage;
  shopifyClient: ShopifyClient;
  bigQueryClient: BigQueryClient;
  reportClient: ReportClient;
  dopplerSitesClient: DopplerSitesClient;
  experimentalFeatures: ExperimentalFeatures;
  dopplerApiClient: DopplerApiClient;
  ipinfoClient: IpinfoClient;
  dopplerBillingApiClient: DopplerBillingApiClient;
  dopplerUserApiClient: DopplerUserApiClient;
  dopplerBeplicApiClient: DopplerBeplicApiClient;
  dopplerPopupHubApiClient: DopplerPopupHubApiClient;
  captchaUtilsService: CaptchaUtilsService;
  utmCookiesManager: UtmCookiesManager;
  dopplerContactPolicyApiClient: DopplerContactPolicyApiClient;
  staticDataClient: StaticDataClient;
  dopplerBillingUserApiClient: DopplerBillingUserApiClient;
  dopplerSystemUsageApiClient: DopplerSystemUsageApiClient;
  dopplerAccountPlansApiClient: DopplerAccountPlansApiClient;
  planService: PlanService;
  campaignSummaryService: CampaignSummaryService;
  contactSummaryService: ContactSummaryService;
  systemUsageSummary: HttpSystemUsageSummaryClient;
  controlPanelService: ControlPanelService;
}

/**
 * Application composition root for AppServices
 */
export class AppCompositionRoot implements AppServices {
  private readonly instances: Partial<AppServices>;

  constructor(predefinedInstances: Partial<AppServices> = {}) {
    this.instances = { ...predefinedInstances };
  }

  private singleton<N extends keyof AppServices, T extends AppServices[N]>(
    name: N,
    factory: () => T,
  ): T {
    if (!this.instances[name]) {
      this.instances[name] = factory();
    }
    return this.instances[name] as T;
  }

  get appSessionRef() {
    return this.singleton('appSessionRef', () => createAppSessionRef());
  }

  get axiosStatic() {
    return this.singleton('axiosStatic', () => axios);
  }

  get appConfiguration() {
    return this.singleton('appConfiguration', () => ({
      dopplerLegacyUrl: process.env.REACT_APP_DOPPLER_LEGACY_URL as string,
      dopplerSitesUrl: process.env.REACT_APP_DOPPLER_SITES_URL as string,
      datahubUrl: process.env.REACT_APP_DATAHUB_URL as string,
      recaptchaPublicKey: process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY as string,
      dopplerLegacyKeepAliveMilliseconds: parseInt(
        process.env.REACT_APP_DOPPLER_LEGACY_KEEP_ALIVE_MS as string,
      ),
      useLegacy: {
        login: process.env.REACT_APP_USE_DOPPLER_LEGACY_LOGIN === 'true',
        signup: process.env.REACT_APP_USE_DOPPLER_LEGACY_SIGNUP === 'true',
        forgotPassword: process.env.REACT_APP_USE_DOPPLER_LEGACY_FORGOTPASSWORD === 'true',
      },
      shopifyUrl: process.env.REACT_APP_SHOPIFY_URL as string,
      bigQueryUrl: process.env.REACT_APP_BIGQUERY_URL as string,
      reportingUrl: process.env.REACT_APP_DOPPLER_REPORTING_URL as string,
      dopplerApiUrl: process.env.REACT_APP_DOPPLER_API_URL as string,
      reportsUrl: process.env.REACT_APP_REPORTS_URL as string,
      dopplerBillingApiUrl: process.env.REACT_APP_DOPPLER_BILLING_API_URL as string,
      dopplerSystemUsageApiUrl: process.env.REACT_APP_DOPPLER_SYSTEM_USAGE_URL as string,
      appStatusOverrideFileUrl: process.env.REACT_APP_MANUAL_STATUS_FILE_URL as string,
      dopplerContactPolicyApiUrl: process.env.REACT_APP_DOPPLER_CONTACT_POLICY_URL as string,
      dopplerUsersApiUrl: process.env.REACT_APP_DOPPLER_USERS_API_URL as string,
      staticDataBaseUrl: 'https://cdn.fromdoppler.com/static-data',
      dopplerBillingUsersApiUrl: process.env.REACT_APP_DOPPLER_BILLING_USER_API_URL as string,
      dopplerAccountPlansApiUrl: process.env.REACT_APP_DOPPLER_ACCOUNT_PLANS_API_URL as string,
      dopplerBeplicApiUrl: process.env.REACT_APP_DOPPLER_BEPLIC_API_URL as string,
      dopplerPopupHubApiUrl: process.env.REACT_APP_DOPPLER_POPUP_HUB_API_URL as string,
    }));
  }

  get datahubClient() {
    return this.singleton(
      'datahubClient',
      () =>
        new HttpDatahubClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.datahubUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get dopplerLegacyClient() {
    return this.singleton(
      'dopplerLegacyClient',
      () =>
        new HttpDopplerLegacyClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerLegacyUrl,
          window: this.window,
        }),
    );
  }

  get dopplerSitesClient() {
    return this.singleton(
      'dopplerSitesClient',
      () =>
        new HttpDopplerSitesClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerSitesUrl,
        }),
    );
  }

  get shopifyClient() {
    return this.singleton(
      'shopifyClient',
      () =>
        new HttpShopifyClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.shopifyUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get bigQueryClient() {
    return this.singleton(
      'bigQueryClient',
      () =>
        new HttpBigQueryClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.bigQueryUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get reportClient() {
    return this.singleton(
      'reportClient',
      () =>
        new HttpReportClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.reportingUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get dopplerApiClient() {
    return this.singleton(
      'dopplerApiClient',
      () =>
        new HttpDopplerApiClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerApiUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get sessionManager() {
    return this.singleton(
      'sessionManager',
      () =>
        new SessionMfeSessionManager({
          // Casting because only he will be allowed to update session
          appSessionRef: this.appSessionRef as MutableRefObject<AppSession>,
          window: this.window,
        }),
    );
  }

  get ipinfoClient() {
    return this.singleton(
      'ipinfoClient',
      () =>
        new HttpIpinfoClient({
          axiosStatic: this.axiosStatic,
        }),
    );
  }

  get experimentalFeatures() {
    return this.singleton(
      'experimentalFeatures',
      () => new ExperimentalFeatures(this.localStorage),
    );
  }

  get window() {
    return this.singleton('window', () => window);
  }

  get localStorage() {
    return this.singleton('localStorage', () => this.window.localStorage);
  }

  get dopplerBillingApiClient() {
    return this.singleton(
      'dopplerBillingApiClient',
      () =>
        new HttpDopplerBillingApiClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerBillingApiUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get dopplerUserApiClient() {
    return this.singleton(
      'dopplerUserApiClient',
      () =>
        new HttpDopplerUserApiClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerUsersApiUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get dopplerBeplicApiClient() {
    return this.singleton(
      'dopplerBeplicApiClient',
      () =>
        new HttpDopplerBeplicApiClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerBeplicApiUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get dopplerPopupHubApiClient() {
    return this.singleton(
      'dopplerPopupHubApiClient',
      () =>
        new HttpDopplerPopupHubApiClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerPopupHubApiUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get captchaUtilsService() {
    return this.singleton('captchaUtilsService', () => new CaptchaUtilsService());
  }

  get planService() {
    return this.singleton(
      'planService',
      () =>
        new PlanService({
          dopplerLegacyClient: this.dopplerLegacyClient,
          appSessionRef: this.appSessionRef,
        }),
    );
  }

  get campaignSummaryService() {
    return this.singleton(
      'campaignSummaryService',
      () =>
        new CampaignSummaryService({
          reportClient: this.reportClient,
        }),
    );
  }

  get contactSummaryService() {
    return this.singleton(
      'contactSummaryService',
      () =>
        new ContactSummaryService({
          reportClient: this.reportClient,
        }),
    );
  }

  get systemUsageSummary() {
    return this.singleton(
      'systemUsageSummary',
      () =>
        new HttpSystemUsageSummaryClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.reportingUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get utmCookiesManager() {
    return this.singleton('utmCookiesManager', () => new UtmCookiesManager(this.window.document));
  }

  get dopplerContactPolicyApiClient() {
    return this.singleton(
      'dopplerContactPolicyApiClient',
      () =>
        new HttpDopplerContactPolicyApiClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerContactPolicyApiUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get staticDataClient() {
    return this.singleton(
      'staticDataClient',
      () =>
        new HttpStaticDataClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.staticDataBaseUrl,
        }),
    );
  }

  get dopplerBillingUserApiClient() {
    return this.singleton(
      'dopplerBillingUserApiClient',
      () =>
        new HttpDopplerBillingUserApiClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerBillingUsersApiUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get dopplerSystemUsageApiClient() {
    return this.singleton(
      'dopplerSystemUsageApiClient',
      () =>
        new HttpDopplerSystemUsageApiClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerSystemUsageApiUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get dopplerAccountPlansApiClient() {
    return this.singleton(
      'dopplerAccountPlansApiClient',
      () =>
        new HttpDopplerAccountPlansApiClient({
          axiosStatic: this.axiosStatic,
          baseUrl: this.appConfiguration.dopplerAccountPlansApiUrl,
          connectionDataRef: this.appSessionRef,
        }),
    );
  }

  get controlPanelService() {
    return this.singleton(
      'controlPanelService',
      () =>
        new ControlPanelService({
          appSessionRef: this.appSessionRef,
        }),
    );
  }
}

const AppServicesContext = createContext({});
const AppServicesResolver = AppServicesContext.Consumer;

/**
 * Define AppServicesProvider context in order to inject dependencies in elements decorated with InjectAppServices
 * @param props
 */
export function AppServicesProvider({
  forcedServices,
  children,
}: {
  forcedServices?: Partial<AppServices>;
  children?: ReactNode;
}) {
  return (
    <AppServicesContext.Provider value={new AppCompositionRoot(forcedServices)}>
      {children}
    </AppServicesContext.Provider>
  );
}

/**
 * Decorate input component, injecting dependencies from AppServicesProvider (if it is defined)
 * @param Component
 */
export function InjectAppServices(Component: any) {
  // TODO: Use the right type for Component parameter. `() => JSX.Element` is only valid
  // for function components, not for class ones.
  return (props: any) =>
    props.dependencies ? (
      <Component {...props} />
    ) : (
      <AppServicesResolver>
        {(services) => <Component dependencies={services} {...props} />}
      </AppServicesResolver>
    );
}
