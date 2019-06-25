import { AxiosInstance, AxiosStatic } from 'axios';
import {
  ResultWithoutExpectedErrors,
  EmptyResult,
  EmptyResultWithoutExpectedErrors,
} from '../doppler-types';

export interface DopplerSitesClient {
    getBannerData(lang: string, type: string, page?: string | null): Promise<any>;
}

export interface Promotions {
    title: string;
    functionality: string;
    description: string;
    imageUrl: string;
    backgroundUrl: string;
  fontColor: string;
}

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


    public async getBannerData(lang: string, type: string, page?: string | null) {
        const response:any = await this.axios.get(
            this.baseUrl +`/wp-json/doppler2019/v1/getbanner?filter[lang]=${lang}&filter[type]=${type}&filter[page]=${page || ''}`,
        );
        if (!response || !response.data) {
            throw new Error('Empty Site response');
        }
        return {
            title: response.title,
            functionality: response.functionality,
            description: response.description,
            imageUrl: response.image_url,
            backgroundUrl: response.background_url,
          fontColor: response.font_color,
        };
    }
}