import { ShopifyClient, SubscriberListState, ConnectedShop } from './shopify-client';
import { timeout } from '../utils';
import { ResultWithoutExpectedErrors } from '../doppler-types';

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
  public async getShopifyData(): Promise<ResultWithoutExpectedErrors<ConnectedShop[]>> {
    console.log('getShopifyData');
    await timeout(1500);
    //return { success: false, message: 'Some random error' }; // Unexpected error
    //return { success: true, value: twoShops }; // Shopify connected with more than one shop
    //return { success: true, value: [] }; // Shopify disconnected
    return { success: true, value: oneShop }; // Shopify connected to one shop

    // //Test state change behaviour
    // if (new Date().getTime() % 2 !== 0) {
    //   oneShop[0].list.amountSubscribers++;
    //   return { success: true, value: oneShop };
    // } else {
    //   return { success: true, value: [] };
    // }
  }
}
