import { AxiosInstance, AxiosStatic } from 'axios';

// TODO: Consider better the name, DopplerMvc tries to make reference to Doppler API implemented
// inside MVC App

export interface DopplerMvcUserData {
  email: string;
}

export interface DopplerMvcClient {
  getUserData(): Promise<DopplerMvcUserData>;
}

export class HttpDopplerMvcClient implements DopplerMvcClient {
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
