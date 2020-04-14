import { IpinfoClient } from './ipinfo-client';
import { timeout } from '../utils';

export const fakeResponse = 'AR';

export class HardcodedIpinfoClient implements IpinfoClient {
  public async getCountryCode(): Promise<string> {
    await timeout(1500);
    return fakeResponse;
  }
}
