import { DopplerLegacyClient, DopplerLegacyUserData } from './doppler-legacy-client';

type AppSession =
  | { status: 'unknown' }
  | { status: 'non-authenticated' }
  | {
      status: 'authenticated';
      userData: DopplerLegacyUserData;
    };

const noop = () => {};

const defaultSession: AppSession = { status: 'unknown' };

export interface SessionManager {
  session: AppSession;
  initialize: (handler: (s: AppSession) => void) => void;
  finalize: () => void;
}

export class OnlineSessionManager implements SessionManager {
  private currentSession: AppSession = { ...defaultSession };
  private handler: (s: AppSession) => void = noop;
  private dopplerInterval: number | null = null;

  constructor(
    private dopplerLegacyClient: DopplerLegacyClient,
    private keepAliveMilliseconds: number,
  ) {}

  public get session() {
    return this.currentSession;
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

  private updateSession(session: AppSession) {
    this.currentSession = session;
    this.handler(this.currentSession);
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
      this.redirectToLogin();
    }
  }

  // TODO: move into a dependency
  private redirectToLogin() {
    const currentUrlEncoded = encodeURI(window.location.href);
    const loginUrl = `${process.env.REACT_APP_API_URL}/SignIn/index?redirect=${currentUrlEncoded}`;
    window.location.href = loginUrl;
  }
}
