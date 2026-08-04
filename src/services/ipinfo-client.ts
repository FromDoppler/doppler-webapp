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
        url: 'https://ipapi.co/country/',
      });
      const countryCode =
        typeof response.data === 'string' ? response.data.trim().toUpperCase() : '';
      return /^[A-Z]{2}$/.test(countryCode) ? countryCode : defaultCountryCode;
    } catch {
      return defaultCountryCode;
    }
  }
}
