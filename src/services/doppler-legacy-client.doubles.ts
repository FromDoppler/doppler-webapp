import { DopplerLegacyClient } from './doppler-legacy-client';

export class HardcodedDopplerLegacyClient implements DopplerLegacyClient {
  public async getUserData() {
    return {
      user: {
        email: 'hardcoded@email.com',
      },
    };
  }
}
