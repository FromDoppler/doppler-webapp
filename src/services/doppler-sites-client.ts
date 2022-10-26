import { AxiosInstance, AxiosStatic } from 'axios';
import { ResultWithoutExpectedErrors } from '../doppler-types';

export interface DopplerSitesClient {
  getBannerData(lang: string, type: string, page?: string | null): Promise<PromotionsResult>;
}

export interface Promotions {
  title: string;
  functionality: string;
  description: string;
  imageUrl: string;
  backgroundUrl: string;
  fontColor: string;
  contentActivation: string;
}

export type PromotionsResult = ResultWithoutExpectedErrors<Promotions>;

export class HttpDopplerSitesClient implements DopplerSitesClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;

  constructor({ axiosStatic, baseUrl }: { axiosStatic: AxiosStatic; baseUrl: string }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: baseUrl,
    });
  }

  public async getBannerData(
    lang: string,
    type: string,
    page?: string | null,
  ): Promise<PromotionsResult> {
    try {
      const response: any = await this.axios.get(
        `${
          this.baseUrl
        }/es/wp-json/doppler2019/v1/getbanner?filter[lang]=${lang}&filter[type]=${type}&filter[page]=${
          page || ''
        }`,
      );
      if (!response || !response.data) {
        throw new Error('Empty Site response');
      }
      return {
        success: true,
        value: {
          title: response.data.title,
          functionality: response.data.functionality,
          description: response.data.description,
          imageUrl: response.data.image_url,
          backgroundUrl: response.data.background_url,
          fontColor: response.data.font_color,
          contentActivation: response.data.content_activation,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }
}
