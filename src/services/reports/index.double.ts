import { ResultWithoutExpectedErrors } from '../../doppler-types';
import { timeout } from '../../utils';
import { CampaignSummary, ContactSummary, ReportClient } from './index';

export const fakeCampaignsSummary = {
  totalSentEmails: 21_458,
  totalOpenClicks: 57,
  clickThroughRate: 15,
};

export const fakeContactsSummary = {
  totalSubscribers: 21_458,
  newSubscribers: 943,
  removedSubscribers: 32,
};

export class HardcodedReportClient implements ReportClient {
  public async getCampaignsSummary(): Promise<ResultWithoutExpectedErrors<CampaignSummary>> {
    await timeout(500);

    return { success: true, value: fakeCampaignsSummary };
  }

  public async getContactsSummary(): Promise<ResultWithoutExpectedErrors<ContactSummary>> {
    await timeout(500);

    return { success: true, value: fakeContactsSummary };
  }
}
