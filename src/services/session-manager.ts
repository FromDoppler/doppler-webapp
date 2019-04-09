import { DopplerLegacyClient, DopplerLegacyUserData } from './doppler-legacy-client';
import { AppSession } from './app-session';
import { MutableRefObject } from 'react';

const noop = () => {};

export interface SessionManager {
  initialize: (handler: (s: AppSession) => void) => void;
  finalize: () => void;
}

export class OnlineSessionManager implements SessionManager {
  private handler: (s: AppSession) => void = noop;
  private dopplerInterval: number | null = null;

  constructor(
    private appSessionRef: MutableRefObject<AppSession>,
    private dopplerLegacyClient: DopplerLegacyClient,
    private keepAliveMilliseconds: number,
  ) {}

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

  private updateSession(session: AppSession) {
    this.appSessionRef.current = session;
    this.handler(session);
  }

  private async update() {
    try {
      const dopplerUserData = await this.dopplerLegacyClient.getUserData();
      // TODO: deal with JWT Token
      this.updateSession({
        status: 'authenticated',
        userData: dopplerUserData,
      });
    } catch (error) {
      this.updateSession({ status: 'non-authenticated' });
    }
  }
}
