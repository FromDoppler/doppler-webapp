import { DopplerLegacyClient } from './doppler-legacy-client';

export class HardcodedDopplerLegacyClient implements DopplerLegacyClient {
  public async getUserData() {
    return {
      email: 'hardcoded@email.com',
    };
  }
}
