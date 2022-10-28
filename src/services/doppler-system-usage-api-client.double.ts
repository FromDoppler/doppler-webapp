import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';
import { DopplerSystemUsageApiClient, SystemUsage } from './doppler-system-usage-api-client';

export class HardcodedDopplerSystemUsageApiClient implements DopplerSystemUsageApiClient {
  public async getUserSystemUsage(): Promise<ResultWithoutExpectedErrors<SystemUsage>> {
    console.log('DopplerSystemUsageApiClient');
    await timeout(1500);
    return {
      success: true,
      value: {
        email: 'my-mail@doppler.com',
        reportsSectionLastVisit: '2022-10-25T13:39:34.707Z',
      },
    };
  }
}
