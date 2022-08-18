import { timeout } from '../../utils';
import { ResultWithoutExpectedErrors } from '../../doppler-types';
import { SystemUsageSummary, SystemUsageSummaryClient } from './SystemUsageSummary';

export const fakeSystemUsageSummary = {
  hasListsCreated: true,
  hasDomainsReady: false,
  hasCampaingsCreated: false,
  hasCampaingsSent: false,
};

export class HardcodedSystemUsageSummaryClient implements SystemUsageSummaryClient {
  public async getSystemUsageSummaryData(): Promise<
    ResultWithoutExpectedErrors<SystemUsageSummary>
  > {
    console.log('getSystemUsageSummaryData');
    await timeout(500);
    return { success: true, value: fakeSystemUsageSummary };
  }
}
