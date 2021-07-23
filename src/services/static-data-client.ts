import { AxiosInstance, AxiosStatic } from 'axios';

export interface StaticDataClient {
  getIndustriesData(language: string): Promise<any>;
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
        headers: { 'Cache-Control': 'no-store,max-age=0' },
      });
      return { success: true, value: response.data };
    } catch (error) {
      console.error('Industries file not accesible');
      return { success: false, error: error };
    }
  }
}
