import { DopplerMvcClient } from './doppler-mvc-client';

export class HardcodedDopplerMvcClient implements DopplerMvcClient {
  public async getUserData() {

    return {
      email: 'hardcoded@email.com',
    };
  }
}
