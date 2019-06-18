import {
    DopplerSitesClient
  } from './doppler-sites-client';

  import { timeout } from '../utils';

export class HardcodedDopplerSitesClient implements DopplerSitesClient {
    public async getBannerData(lang: string, type: string, page: string) {
        console.log('getBannerData');
        const response:any = {
            title: 'mi funcionalidad',
            functionality: 'mi funcionalidad',
            description: 'mi descripcion',
            image_url: 'https://qa.fromdoppler.com/wp-content/uploads/2019/06/login-es.746bf048.png',
            background_url: 'https://qa.fromdoppler.com/wp-content/uploads/2019/06/violet-yellow.png',
        };
        await timeout(1500);

        return {
            title: response.title,
            functionality: response.functionality,
            description: response.description,
            imageUrl: response.image_url,
            backgroundUrl: response.background_url,
        };
    }
}