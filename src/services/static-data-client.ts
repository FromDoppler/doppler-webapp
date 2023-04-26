import { AxiosInstance, AxiosStatic } from 'axios';

export interface StaticDataClient {
  getIndustriesData(language: string): Promise<any>;
  getStatesData(country: string, language: string): Promise<any>;
  getSecurityQuestionsData(language: string): Promise<any>;
  getConsumerTypesData(country: string, language: string): Promise<any>;
  getUseCfdiData(language: string): Promise<any>;
  getPaymentWaysData(language: string): Promise<any>;
  getPaymentTypesData(language: string): Promise<any>;
  getDocumentTypesData(language: string): Promise<any>;
  getTaxRegimes(language: string): Promise<any>;
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

  public async getSecurityQuestionsData(language: string): Promise<any> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: this.baseUrl + `/${language === 'es' ? 'questions-es' : 'questions-en'}.json`,
      });

      const securityQuestions = Object.keys(response.data).map((key) => ({
        key: key,
        value: response.data[key],
      }));
      return { success: true, value: securityQuestions };
    } catch (error) {
      console.error('States file not accesible');
      return { success: false, error: error };
    }
  }

  public async getConsumerTypesData(country: string, language: string): Promise<any> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url:
          this.baseUrl +
          `/${language === 'es' ? 'consumer-types-es-v1' : 'consumer-types-en-v1'}.json`,
      });

      const data: { [key: string]: any } = Object.keys(response.data)
        .filter((key) => key.toLowerCase() === country.toLowerCase())
        .reduce((obj, key) => {
          return response.data[key];
        }, {});

      const consumerTypes = Object.keys(data).map((key) => ({ key: key, value: data[key] }));

      const consumerTypesOrdered = consumerTypes.sort((a, b) =>
        a.value.localeCompare(b.value, undefined, { sensitivity: 'base' }),
      );

      return { success: true, value: consumerTypesOrdered };
    } catch (error) {
      console.error('States file not accesible');
      return { success: false, error: error };
    }
  }

  public async getUseCfdiData(language: string): Promise<any> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: this.baseUrl + `/cfdi-${language}.json`,
      });
      return { success: true, value: response.data };
    } catch (error) {
      console.error('CFDI file not accesible');
      return { success: false, error: error };
    }
  }

  public async getPaymentWaysData(language: string): Promise<any> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: this.baseUrl + `/payment-ways-pay-${language}.json`,
      });
      return { success: true, value: response.data };
    } catch (error) {
      console.error('Payment ways file not accesible');
      return { success: false, error: error };
    }
  }

  public async getPaymentTypesData(language: string): Promise<any> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: this.baseUrl + `/payment-types-${language}.json`,
      });
      return { success: true, value: response.data };
    } catch (error) {
      console.error('Payment types file not accesible');
      return { success: false, error: error };
    }
  }

  public async getDocumentTypesData(language: string): Promise<any> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: this.baseUrl + `/document-types-${language}.json`,
      });
      return { success: true, value: response.data };
    } catch (error) {
      console.error('Document types file not accesible');
      return { success: false, error: error };
    }
  }

  public async getTaxRegimes(language: string): Promise<any> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: this.baseUrl + `/tax-regimes-${language}.json`,
      });
      return { success: true, value: response.data };
    } catch (error) {
      console.error('Tax regimes file not accesible');
      return { success: false, error: error };
    }
  }
}
