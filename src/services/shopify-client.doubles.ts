import { ShopifyClient, SubscriberListState, ConnectedShops } from './shopify-client';
import { timeout } from '../utils';

const fakeData = [
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

export class HardcodedShopifyClient implements ShopifyClient {
  public async getShopifyData(): Promise<ConnectedShops[]> {
    console.log('getShopifyData');
    await timeout(1500);
    return fakeData;
  }
}
