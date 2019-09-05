import { DopplerApiClient } from './doppler-api-client';
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
}
