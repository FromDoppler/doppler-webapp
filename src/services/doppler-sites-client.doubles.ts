import { DopplerSitesClient, PromotionsResult } from './doppler-sites-client';

import { timeout } from '../utils';

export class HardcodedDopplerSitesClient implements DopplerSitesClient {
  public async getBannerData(lang: string, type: string, page: string): Promise<PromotionsResult> {
    console.log('getBannerData');
    await timeout(1500);
    const response: any = {
      title: 'mi funcionalidad',
      functionality: 'mi funcionalidad',
      description: '<p>mi descripcion</p>',
      image_url: 'https://qa.fromdoppler.com/wp-content/uploads/2019/06/login-es.746bf048.png',
      background_url: 'https://qa.fromdoppler.com/wp-content/uploads/2019/06/violet-yellow.png',
      font_color: '#000',
    };
    return {
      success: true,
      value: {
        title: response.title,
        functionality: response.functionality,
        description: response.description,
        imageUrl: response.image_url,
        backgroundUrl: response.background_url,
        fontColor: response.font_color,
        contentActivation: undefined,
      },
    };
    //return {
    //  success: false,
    //  error: new Error('Dummy error'),
    //};
  }
}
