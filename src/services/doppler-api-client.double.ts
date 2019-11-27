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
      name: 'test',
      value: 'test',
      predefined: true,
      private: true,
      readonly: true,
      type: 'boolean',
    },
  ],
  belongsToLists: [],
  unsubscribedDate: '2019-11-27T18:05:40.847Z',
  unsubscriptionType: 'hardBounce',
  manualUnsubscriptionReason: 'administrative',
  unsubscriptionComment: 'test',
  status: 'active',
  canBeReactivated: true,
  isBeingReactivated: true,
  score: 0,
  links: [
    {
      href: 'test.com',
      description: 'test',
      rel: 'test',
    },
  ],
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

  public async getSubscriber(email: string): Promise<ResultWithoutExpectedErrors<Subscriber>> {
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
