import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';
import { DopplerBeplicApiClient } from './doppler-beplic-api-client';

export class HardcodedDopplerBeplicApiClient implements DopplerBeplicApiClient {
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
