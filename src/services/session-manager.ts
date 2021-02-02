import { DopplerLegacyClient } from './doppler-legacy-client';
import { AppSession } from './app-session';
import { MutableRefObject } from 'react';
import { ManualStatusClient } from './manual-status-client';
import { addLogEntry } from '../utils';

const noop = () => {};

export interface SessionManager {
  initialize: (handler: (s: AppSession) => void) => void;
  finalize: () => void;
  restart: () => void;
}

export class OnlineSessionManager implements SessionManager {
  private readonly appSessionRef: MutableRefObject<AppSession>;
  private readonly dopplerLegacyClient: DopplerLegacyClient;
  private readonly manualStatusClient: ManualStatusClient;
  private readonly keepAliveMilliseconds: number;
  private readonly appStatusOverrideEnabled: boolean;

  private handler: (s: AppSession) => void = noop;
  private dopplerInterval: number | null = null;

  constructor({
    appSessionRef,
    dopplerLegacyClient,
    keepAliveMilliseconds,
    appStatusOverrideEnabled,
    manualStatusClient,
  }: {
    appSessionRef: MutableRefObject<AppSession>;
    dopplerLegacyClient: DopplerLegacyClient;
    keepAliveMilliseconds: number;
    appStatusOverrideEnabled: boolean;
    manualStatusClient: ManualStatusClient;
  }) {
    this.appSessionRef = appSessionRef;
    this.dopplerLegacyClient = dopplerLegacyClient;
    this.keepAliveMilliseconds = keepAliveMilliseconds;
    this.appStatusOverrideEnabled = appStatusOverrideEnabled;
    this.manualStatusClient = manualStatusClient;
  }

  public initialize(handler: (s: AppSession) => void) {
    this.handler = handler;
    this.update();
    this.dopplerInterval = window.setInterval(() => {
      this.update();
    }, this.keepAliveMilliseconds);
  }

  public finalize() {
    this.handler = noop;
    if (this.dopplerInterval) {
      clearInterval(this.dopplerInterval);
    }
  }

  public restart() {
    const previousHandler = this.handler;
    this.finalize();
    this.updateSession({ status: 'unknown' });
    this.initialize(previousHandler);
  }

  private updateSession(session: AppSession) {
    this.appSessionRef.current = session;
    this.handler(session);
  }

  private async update() {
    try {
      const dopplerUserData = await this.dopplerLegacyClient.getUserData();
      this.updateSession(
        {
          status: 'authenticated',
          userData: dopplerUserData,
          datahubCustomerId: dopplerUserData.datahubCustomerId,
          jwtToken: dopplerUserData.jwtToken,
        } as AppSession, // Cast required because TS cannot resolve datahubCustomerId complexity
      );
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        addLogEntry({
          account: 'none',
          origin: window.location.origin,
          section: 'Login/GetUserData',
          browser: window.navigator.userAgent,
          message: 'Connection timed out',
        });
      }
      if (this.appStatusOverrideEnabled) {
        const manualStatusData = await this.manualStatusClient.getStatusData();
        if (manualStatusData.offline) {
          this.updateSession({ status: 'maintenance' });
          return;
        }
      }
      this.updateSession({ status: 'non-authenticated' });
    }
  }
}
