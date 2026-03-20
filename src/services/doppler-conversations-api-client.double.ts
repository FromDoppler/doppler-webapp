import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';
import { DopplerConversationsApiClient } from './doppler-conversations-api-client';

export class HardcodedDopplerConversationsApiClient implements DopplerConversationsApiClient {
  public async getConversations(
    dateFrom: string,
    dateTo: string,
  ): Promise<ResultWithoutExpectedErrors<number>> {
    console.log('getConversations');
    await timeout(1500);

    return {
      value: 500,
      success: true,
    };
  }
}
