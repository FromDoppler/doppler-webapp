import { DopplerLegacyClient, mapHeaderDataJson } from './doppler-legacy-client';
import headerDataJson from '../headerData.json';

export class HardcodedDopplerLegacyClient implements DopplerLegacyClient {
  public constructor(public readonly email = 'hardcoded@email.com') {}

  public async getUserData() {
    const { user, nav, alert } = mapHeaderDataJson(headerDataJson);

    return {
      user: {
        ...user,
        email: this.email,
      },
      nav: nav,
      alert,
    };
  }
}
