import { DopplerMvcClient } from './doppler-mvc-client';
import { DopplerMvcUserData } from './doppler-mvc-client';

type AppSession =
  | { status: 'unknown' }
  | { status: 'non-authenticated' }
  | {
      status: 'authenticated';
      userData: DopplerMvcUserData;
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

  constructor(private dopplerMvcClient: DopplerMvcClient, private keepAliveMilliseconds: number) {}

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

  private dispatch(session: AppSession) {
    this.currentSession = session;
    this.handler(this.currentSession);
  }

  private async update() {
    try {
      const dopplerUserData = await this.dopplerMvcClient.getUserData();
      // TODO: do something with dopplerUserData

      // TODO: deal with JWT Token
      // TODO: get other data related to user
      this.dispatch({ status: 'authenticated', userData: dopplerUserData });
    } catch (error) {
      console.log(error);
      this.logOut();
    }
  }

  private logOut() {
    this.redirect();
    this.dispatch({ status: 'non-authenticated' });
  }

  // TODO: move into a dependency
  private redirect() {
    const currentUrlEncoded = encodeURI(window.location.href);
    // TODO: only use redirect on login, not in logout
    const loginUrl = `${process.env.REACT_APP_API_URL}/SignIn/index?redirect=${currentUrlEncoded}`;
    window.setTimeout(() => {
      window.location.href = loginUrl;
    }, 0);
  }
}
