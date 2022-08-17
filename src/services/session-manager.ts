import { AppSession } from './app-session';

export interface SessionManager {
  initialize: (handler: (s: AppSession) => void) => void;
  finalize: () => void;
  restart: () => void;
}
