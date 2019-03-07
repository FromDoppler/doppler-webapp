import { AxiosInstance, AxiosStatic } from 'axios';

export interface DopplerLegacyUserData {
  email: string;
}

export interface DopplerLegacyClient {
  getUserData(): Promise<DopplerLegacyUserData>;
}

export class HttpDopplerLegacyClient implements DopplerLegacyClient {
  private readonly axios: AxiosInstance;

  constructor(axiosStatic: AxiosStatic, baseUrl: string) {
    this.axios = axiosStatic.create({
      baseURL: baseUrl,
      withCredentials: true,
    });
  }

  public async getUserData() {
    var response = await this.axios.get('/Reports/Reports/GetUserData');
    if (!response || !response.data || response.data.Email) {
      throw new Error('Empty Doppler response');
    }

    return {
      email: response.data.Email,
    };
  }
}
