import axios from 'axios';

type SessionStatus = 'unknown' | 'authenticated' | 'non-authenticated';

interface AppSession {
  status: SessionStatus;
}

const noop = () => {};

const defaultSession: AppSession = {
  status: 'unknown',
};

export interface SessionManager {
  session: AppSession;
}

export class OnlineSessionManager implements SessionManager {
  private currentSession: AppSession = { ...defaultSession };
  private handler: (s: AppSession) => void = noop;
  private dopplerInterval: number | null = null;

  constructor(private keepAliveMilliseconds: number = 60000) {}

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

  private dispatch(data: any) {
    this.currentSession = { ...defaultSession, ...data };
    this.handler(this.currentSession);
  }

  private async update() {
    try {
      const dopplerUserData = await this.getDopplerUserData();

      // TODO: do something with dopplerUserData

      // TODO: deal with JWT Token
      // TODO: get other data related to user
      this.dispatch({ status: 'authenticated' });
    } catch (error) {
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

  private async getDopplerUserData() {
    const response = await axios.get(
      process.env.REACT_APP_API_URL + '/Reports/Reports/GetUserData',
      {
        withCredentials: true,
      },
    );

    if (!response || !response.data || response.data.Email) {
      throw new Error('Empty Doppler response');
    }

    return {
      email: response.data.Email,
    };
  }
}
