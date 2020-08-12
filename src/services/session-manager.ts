import { DopplerLegacyClient } from './doppler-legacy-client';
import { AppSession } from './app-session';
import { MutableRefObject } from 'react';

const noop = () => {};

export interface SessionManager {
  initialize: (handler: (s: AppSession) => void) => void;
  finalize: () => void;
  restart: () => void;
}

export class OnlineSessionManager implements SessionManager {
  private readonly appSessionRef: MutableRefObject<AppSession>;
  private readonly dopplerLegacyClient: DopplerLegacyClient;
  private readonly keepAliveMilliseconds: number;

  private handler: (s: AppSession) => void = noop;
  private dopplerInterval: number | null = null;

  constructor({
    appSessionRef,
    dopplerLegacyClient,
    keepAliveMilliseconds,
  }: {
    appSessionRef: MutableRefObject<AppSession>;
    dopplerLegacyClient: DopplerLegacyClient;
    keepAliveMilliseconds: number;
  }) {
    this.appSessionRef = appSessionRef;
    this.dopplerLegacyClient = dopplerLegacyClient;
    this.keepAliveMilliseconds = keepAliveMilliseconds;
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
      if (!!error.response && (error.response.status === 503 || error.response.status === 404)) {
        this.updateSession({ status: 'maintenance' });
      } else {
        this.updateSession({ status: 'non-authenticated' });
      }
    }
  }
}
