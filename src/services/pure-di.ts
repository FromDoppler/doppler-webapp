import axios, { AxiosStatic } from 'axios';
import { HttpDopplerLegacyClient, DopplerLegacyClient } from './doppler-legacy-client';
import { OnlineSessionManager, SessionManager } from './session-manager';

interface AppConfiguration {
  dopplerLegacyUrl: string;
  dopplerLegacyKeepAliveMilliseconds: number;
}

export interface AppServices {
  axiosStatic: AxiosStatic;
  appConfiguration: AppConfiguration;
  dopplerLegacyClient: DopplerLegacyClient;
  sessionManager: SessionManager;
}

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

  get axiosStatic() {
    return this.singleton('axiosStatic', () => axios);
  }

  get appConfiguration() {
    return this.singleton('appConfiguration', () => ({
      dopplerLegacyUrl: process.env.REACT_APP_API_URL as string,
      dopplerLegacyKeepAliveMilliseconds: parseInt(process.env
        .REACT_APP_DOPPLER_LEGACY_KEEP_ALIVE_MS as string),
    }));
  }

  get dopplerLegacyClient() {
    return this.singleton(
      'dopplerLegacyClient',
      () => new HttpDopplerLegacyClient(this.axiosStatic, this.appConfiguration.dopplerLegacyUrl),
    );
  }

  get sessionManager() {
    return this.singleton(
      'sessionManager',
      () =>
        new OnlineSessionManager(
          this.dopplerLegacyClient,
          this.appConfiguration.dopplerLegacyKeepAliveMilliseconds,
        ),
    );
  }
}
