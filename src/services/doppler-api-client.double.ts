import { DopplerApiClient, Subscriber } from './doppler-api-client';
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
}
