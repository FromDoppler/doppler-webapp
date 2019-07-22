import { DopplerLegacyUserData } from './doppler-legacy-client';
import { RefObject } from 'react';

interface AuthenticatedAppSession {
  status: 'authenticated';
  userData: DopplerLegacyUserData;
  jwtToken: string;
}

interface AuthenticatedAppSessionWithoutDatahub extends AuthenticatedAppSession {
  datahubCustomerId?: null;
}

export interface DatahubConnectionData {
  datahubCustomerId: string;
  jwtToken: string;
}

export interface ShopifyConnectionData {
  jwtToken: string;
}

interface AuthenticatedAppSessionWithDatahub
  extends DatahubConnectionData,
    AuthenticatedAppSession {}

export type AppSession =
  | { status: 'unknown' }
  | { status: 'non-authenticated' }
  | AuthenticatedAppSessionWithoutDatahub
  | AuthenticatedAppSessionWithDatahub;

export function createAppSessionRef(): RefObject<AppSession> {
  return { current: { status: 'unknown' } };
}
