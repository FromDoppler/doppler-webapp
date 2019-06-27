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
}

export type PromotionsResult = ResultWithoutExpectedErrors<Promotions>;

export class HttpDopplerSitesClient implements DopplerSitesClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;

  constructor({ axiosStatic, baseUrl }: { axiosStatic: AxiosStatic; baseUrl: string }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: baseUrl,
      withCredentials: true,
    });
  }

  public async getBannerData(
    lang: string,
    type: string,
    page?: string | null,
  ): Promise<PromotionsResult> {
    try {
      const response: any = await this.axios.get(
        this.baseUrl +
          `/wp-json/doppler2019/v1/getbanner?filter[lang]=${lang}&filter[type]=${type}&filter[page]=${page ||
            ''}`,
      );
      if (!response || !response.data) {
        throw new Error('Empty Site response');
      }
      return {
        success: true,
        value: {
          title: response.title,
          functionality: response.functionality,
          description: response.description,
          imageUrl: response.image_url,
          backgroundUrl: response.background_url,
          fontColor: response.font_color,
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
