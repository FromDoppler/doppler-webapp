import { DopplerApiClient, Subscriber, CampaignDeliveryCollection } from './doppler-api-client';
import { SubscriberList } from './shopify-client';
import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';

const listExist = {
  success: true,
  value: {
    name: 'Shopify Contacto',
    id: 27311899,
    amountSubscribers: 3,
    state: 1,
  },
};

// To test when list doesn't exist
// const listNotExists = { success: false, error: 'Error' };

const subscriber = {
  email: 'test@fromdoppler.com',
  fields: [
    {
      name: 'FIRSTNAME',
      value: 'Manuel',
      predefined: true,
      private: false,
      readonly: true,
      type: 'string',
    },
    {
      name: 'LASTNAME',
      value: 'di Rago',
      predefined: true,
      private: false,
      readonly: true,
      type: 'string',
    },
  ],
  unsubscribedDate: '2019-11-27T18:05:40.847Z',
  unsubscriptionType: 'hardBounce',
  manualUnsubscriptionReason: 'administrative',
  unsubscriptionComment: 'test',
  status: 'active',
  score: 0,
};

const campaignDeliveryCollection = {
  items: [
    {
      campaignId: 1,
      campaignName: 'Campaña estacional de primavera',
      campaignSubject: '¿Como sacarle provecho a la primavera?',
      deliveryStatus: 'opened',
      clicksCount: 2,
    },
    {
      campaignId: 2,
      campaignName: 'Campaña calendario estacional 2019',
      campaignSubject: 'El calendario estacional 2019 ya está aquí',
      deliveryStatus: 'opened',
      clicksCount: 23,
    },
    {
      campaignId: 3,
      campaignName: 'Emms 2019 preveento 1',
      campaignSubject: 'Ya comienza el dia 2. Accede a las conferencias',
      deliveryStatus: 'opened',
      clicksCount: 100,
    },
  ],
  currentPage: 0,
  itemsCount: 3,
  pagesCount: 1,
};

export class HardcodedDopplerApiClient implements DopplerApiClient {
  public async getListData(
    idList: number,
    apikey: string,
  ): Promise<ResultWithoutExpectedErrors<SubscriberList>> {
    console.log('getApiListData');
    await timeout(1500);
    return listExist;
    // return listNotExists;
  }

  public async getSubscriber(
    email: string,
    apikey: string,
  ): Promise<ResultWithoutExpectedErrors<Subscriber>> {
    console.log('getApiSubscriber');
    await timeout(1500);

    return {
      success: true,
      value: subscriber,
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
  }

  public async getSubscriberSentCampaigns(
    email: string,
    apikey: string,
  ): Promise<ResultWithoutExpectedErrors<CampaignDeliveryCollection>> {
    console.log('getApiSubscriber');
    await timeout(1500);

    return {
      success: true,
      value: campaignDeliveryCollection,
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
  }
}
