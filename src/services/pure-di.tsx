import axios, { AxiosStatic } from 'axios';
import { HttpDopplerLegacyClient, DopplerLegacyClient } from './doppler-legacy-client';
import { OnlineSessionManager, SessionManager } from './session-manager';
import React, { createContext, ReactNode, RefObject, MutableRefObject } from 'react';
import { DatahubClient } from './datahub-client';
import { HardcodedDatahubClient } from './datahub-client.doubles';
import {
  RedirectToLegacyLoginFactory,
  RedirectToInternalLogin,
  RedirectToLogin,
} from '../components/RedirectToLogin';
import { AppSession, createAppSessionRef } from './app-session';

interface AppConfiguration {
  dopplerLegacyUrl: string;
  dopplerLegacyKeepAliveMilliseconds: number;
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
  RedirectToLogin: RedirectToLogin;
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
      dopplerLegacyKeepAliveMilliseconds: parseInt(process.env
        .REACT_APP_DOPPLER_LEGACY_KEEP_ALIVE_MS as string),
    }));
  }

  get datahubClient() {
    return this.singleton('datahubClient', () => new HardcodedDatahubClient());
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
          // Casting because only he will be allowed to update session
          this.appSessionRef as MutableRefObject<AppSession>,
          this.dopplerLegacyClient,
          this.appConfiguration.dopplerLegacyKeepAliveMilliseconds,
        ),
    );
  }

  get window() {
    return this.singleton('window', () => window);
  }

  // To Setup Internal Login
  // get RedirectToLogin() {
  //   return this.singleton('RedirectToLogin', () => RedirectToInternalLogin);
  // }

  // To Setup Doppler Legacy Login
  get RedirectToLogin() {
    return this.singleton('RedirectToLogin', () =>
      RedirectToLegacyLoginFactory(this.appConfiguration.dopplerLegacyUrl, this.window),
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
