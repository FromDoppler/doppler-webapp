import { AxiosInstance, AxiosStatic } from 'axios';

export interface IpinfoClient {
  getCountryCode(): Promise<string>;
}

export class HttpIpinfoClient implements IpinfoClient {
  private readonly axios: AxiosInstance;

  constructor({ axiosStatic }: { axiosStatic: AxiosStatic }) {
    this.axios = axiosStatic.create();
  }

  public async getCountryCode(): Promise<string> {
    const defaultCountryCode = 'AR';
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: 'https://ipinfo.io/json',
      });
      const countryCode = (response.data && response.data.country) || defaultCountryCode;
      return countryCode;
    } catch (error) {
      return defaultCountryCode;
    }
  }
}
