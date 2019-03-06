import { DopplerMvcClient, mapHeaderDataJson } from './doppler-mvc-client';
import headerDataJson from '../headerData.json';

export class HardcodedDopplerMvcClient implements DopplerMvcClient {
  public constructor(public readonly email = 'hardcoded@email.com') {}

  public async getUserData() {
    const { user, nav } = mapHeaderDataJson(headerDataJson);

    return {
      user: {
        ...user,
        email: this.email,
      },
      nav: nav,
    };
  }
}
