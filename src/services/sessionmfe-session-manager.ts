import { AppSession } from './app-session';
import { MutableRefObject } from 'react';
import { SessionManager } from './session-manager';
import { mapHeaderDataJson } from './doppler-legacy-client';
import { nonAuthenticatedBlockedUser } from '../doppler-types';

// Doppler Session MFE conventions
// from https://github.com/FromDoppler/doppler-menu-mfe/blob/main/src/session/doppler-session-mfe-conventions.ts
export const DOPPLER_SESSION_STATE_UPDATE_EVENT_TYPE = 'doppler-session-state-update';

export type DopplerSessionState =
  | undefined
  | { status: 'non-authenticated' }
  | { status: 'non-authenticated-blocked-user'; provisoryToken: string; email: string }
  | {
      status: 'authenticated';
      jwtToken: string;
      dopplerAccountName: string;
      lang: string;
      rawDopplerUserData: any;
    };

declare global {
  interface Window {
    dopplerSessionState: DopplerSessionState;
    restartDopplerSessionMonitor: () => void;
  }
}
// End Doppler Session MFE conventions

const noop = () => {};

function mapDopplerSessionState(dopplerSessionState: DopplerSessionState): AppSession {
  if (!dopplerSessionState) {
    return { status: 'unknown' };
  }

  if (dopplerSessionState.status === nonAuthenticatedBlockedUser) {
    return dopplerSessionState;
  }

  if (dopplerSessionState.status !== 'authenticated') {
    return { status: dopplerSessionState.status };
  }

  const userData = mapHeaderDataJson(dopplerSessionState.rawDopplerUserData);
  return {
    status: 'authenticated',
    jwtToken: userData.jwtToken,
    datahubCustomerId: userData.datahubCustomerId,
    userData,
  };
}

export class SessionMfeSessionManager implements SessionManager {
  private readonly appSessionRef: MutableRefObject<AppSession>;
  private readonly window: Window;

  private handler: (s: AppSession) => void = noop;

  constructor({
    appSessionRef,
    window,
  }: {
    appSessionRef: MutableRefObject<AppSession>;
    window: Window;
  }) {
    this.appSessionRef = appSessionRef;
    this.window = window;
    this.update = this.update.bind(this);
  }

  public initialize(handler: (s: AppSession) => void) {
    this.handler = handler;
    this.window.addEventListener(DOPPLER_SESSION_STATE_UPDATE_EVENT_TYPE, this.update);
    this.update();
  }

  public finalize() {
    this.window.removeEventListener(DOPPLER_SESSION_STATE_UPDATE_EVENT_TYPE, this.update);
  }

  public restart() {
    window.restartDopplerSessionMonitor();
  }

  public initialzeSessionWithBlockedUser(session: AppSession) {
    this.appSessionRef.current = session;
    this.handler(session);
  }

  private updateSession(session: AppSession) {
    this.appSessionRef.current = session;
    this.handler(session);
  }

  private async update() {
    if (this.appSessionRef.current.status !== nonAuthenticatedBlockedUser) {
      const dopplerUserData = mapDopplerSessionState(this.window.dopplerSessionState);

      if (dopplerUserData.status === 'authenticated') {
        //This will be used by GTM and HotJar
        (window as any).mainMenuData = dopplerUserData.userData;
      }

      this.updateSession(dopplerUserData);
    }
  }
}
