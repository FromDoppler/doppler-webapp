import { AxiosInstance, AxiosStatic } from 'axios';

export interface StaticDataClient {
  getIndustriesData(language: string): Promise<any>;
  getStatesData(country: string, language: string): Promise<any>;
}

export class HttpStaticDataClient implements StaticDataClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;

  constructor({ axiosStatic, baseUrl }: { axiosStatic: AxiosStatic; baseUrl: string }) {
    this.axios = axiosStatic.create();
    this.baseUrl = baseUrl;
  }

  public async getIndustriesData(language: string): Promise<any> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: this.baseUrl + `/${language === 'es' ? 'industries-es' : 'industries-en'}.json`,
      });
      return { success: true, value: response.data };
    } catch (error) {
      console.error('Industries file not accesible');
      return { success: false, error: error };
    }
  }

  public async getStatesData(country: string, language: string): Promise<any> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: this.baseUrl + `/${language === 'es' ? 'states-es-v1' : 'states-en-v1'}.json`,
      });

      const data: { [key: string]: any } = Object.keys(response.data)
        .filter((key) => key.toLowerCase() === country.toLowerCase())
        .reduce((obj, key) => {
          return response.data[key];
        }, {});

      const states = Object.keys(data).map((key) => ({ key: key, value: data[key] }));

      const statesOrdered = states.sort((a, b) =>
        a.value.localeCompare(b.value, undefined, { sensitivity: 'base' }),
      );

      return { success: true, value: statesOrdered };
    } catch (error) {
      console.error('States file not accesible');
      return { success: false, error: error };
    }
  }
}
