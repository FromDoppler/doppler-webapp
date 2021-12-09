import { ResultWithoutExpectedErrors } from '../../doppler-types';
import { timeout } from '../../utils';
import { CampaignSummary, ReportClient } from './index';

export const fakeCampaignsSummary = {
  totalSentEmails: 21.458,
  totalOpenClicks: 57,
  clickThroughRate: 15,
};

const response = {
  data: fakeCampaignsSummary,
};

export class HardcodedReportClient implements ReportClient {
  public async getCampaignsSummary(): Promise<ResultWithoutExpectedErrors<CampaignSummary>> {
    await timeout(500);

    return { success: true, value: response.data };
  }
}
