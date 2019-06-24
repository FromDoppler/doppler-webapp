import {
  ShopifyClient,
  SubscriberListState,
  ConnectedShop,
  ShopifyErrorResult,
} from './shopify-client';
import { timeout } from '../utils';
import { Result } from '../doppler-types';

const oneShop = [
  {
    shopName: 'myshop.com',
    synchronization_date: new Date('2017-12-17'),
    list: {
      name: 'MyList',
      id: 1251,
      amountSubscribers: 2,
      state: SubscriberListState.ready,
    },
  },
];

/*const twoShops = [
  {
    shopName: 'myshop.com',
    synchronization_date: new Date('2017-12-17'),
    list: {
      name: 'MyList',
      id: 1251,
      amountSubscribers: 2,
      state: SubscriberListState.ready,
    },
  },
  {
    shopName: 'myshop2.com',
    synchronization_date: new Date('2017-12-17'),
    list: {
      name: 'MyList',
      id: 1251,
      amountSubscribers: 2,
      state: SubscriberListState.ready,
    },
  },
];*/

export class HardcodedShopifyClient implements ShopifyClient {
  public async getShopifyData(): Promise<Result<ConnectedShop[], ShopifyErrorResult>> {
    console.log('getShopifyData');
    await timeout(1500);
    //return {success: false, message: 'Some random error'};
    //return {success: false, expectedError: {cannotConnectToAPI: true}};
    //return { success: true, value: twoShops };
    return { success: true, value: oneShop };
    //return { success: true, value:[]};
  }
}
