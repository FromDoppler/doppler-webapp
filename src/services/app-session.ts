import { DopplerLegacyUserData } from './doppler-legacy-client';
import { RefObject } from 'react';

export type AppSession =
  | { status: 'unknown' }
  | { status: 'non-authenticated' }
  | {
      status: 'authenticated';
      userData: DopplerLegacyUserData;
    };

export function createAppSessionRef(): RefObject<AppSession> {
  return { current: { status: 'unknown' } };
}
