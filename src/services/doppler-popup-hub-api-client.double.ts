import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';
import { DopplerPopupHubApiClient } from './doppler-popup-hub-api-client';

export class HardcodedDopplerPopupHubApiClient implements DopplerPopupHubApiClient {
  public async getImpressions(
    dateFrom: string,
    dateTo: string,
  ): Promise<ResultWithoutExpectedErrors<number>> {
    console.log('getImpressions');
    await timeout(1500);

    return {
      value: 500,
      success: true,
    };
  }
}
