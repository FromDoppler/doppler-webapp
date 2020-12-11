import { AxiosInstance, AxiosStatic } from 'axios';
import { AppStatus } from '../doppler-types';

export interface ManualStatusClient {
  getStatusData(): Promise<AppStatus>;
}

export class HttpManualStatusClient implements ManualStatusClient {
  private readonly axios: AxiosInstance;

  constructor({ axiosStatic }: { axiosStatic: AxiosStatic }) {
    this.axios = axiosStatic.create();
  }

  public async getStatusData(): Promise<AppStatus> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: 'https://toggle.fromdoppler.com/webapp/webapp-status.json?' + new Date().getTime(),
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
