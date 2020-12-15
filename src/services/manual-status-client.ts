import { AxiosInstance, AxiosStatic } from 'axios';
import { AppStatus } from '../doppler-types';

export interface ManualStatusClient {
  getStatusData(): Promise<AppStatus>;
}

export class HttpManualStatusClient implements ManualStatusClient {
  private readonly axios: AxiosInstance;
  private readonly appStatusOverrideFileUrl: string;

  constructor({
    axiosStatic,
    appStatusOverrideFileUrl,
  }: {
    axiosStatic: AxiosStatic;
    appStatusOverrideFileUrl: string;
  }) {
    this.axios = axiosStatic.create();
    this.appStatusOverrideFileUrl = appStatusOverrideFileUrl;
  }

  public async getStatusData(): Promise<AppStatus> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: this.appStatusOverrideFileUrl + `?${new Date().getTime()}`,
        headers: { 'Cache-Control': 'no-store,max-age=0' },
      });
      return {
        offline: (response.data && !!response.data.status.offline) || false,
      };
    } catch (error) {
      console.error('Status toggle file not accesible');
      return { offline: false };
    }
  }
}
