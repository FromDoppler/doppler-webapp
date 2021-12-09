import { ResultWithoutExpectedErrors } from '../doppler-types';
import { addDays, getStartOfDate } from '../utils';
import { CampaignSummary, ReportClient } from './reports/index';

export interface CampaignKpi {
  id: Number;
  kpiTitleId: String;
  kpiValue: Number | String;
  iconClass: String;
}

export interface CampaignSummaryInterface {
  getCampaignsSummary(): Promise<any>;
}

export class CampaignSummaryService implements CampaignSummaryInterface {
  private readonly reportClient: ReportClient;

  constructor({ reportClient }: { reportClient: ReportClient }) {
    this.reportClient = reportClient;
  }

  async getCampaignsSummary(): Promise<ResultWithoutExpectedErrors<CampaignKpi[]>> {
    const dateTo = getStartOfDate(new Date()) ?? new Date();
    const dateFrom = addDays(dateTo, -30);
    const response = await this.reportClient.getCampaignsSummary({
      dateFrom,
      dateTo,
    });

    return response.success
      ? {
          ...response,
          value: mapCampaignsSummary(response.value),
        }
      : response;
  }
}

export const mapCampaignsSummary = (campaignsSummary: CampaignSummary): CampaignKpi[] => [
  {
    id: 1,
    kpiTitleId: 'dashboard.campaigns.totalCampaigns',
    kpiValue: campaignsSummary.totalSentEmails,
    iconClass: 'deliveries',
  },
  {
    id: 2,
    kpiTitleId: 'dashboard.campaigns.totalOpen',
    kpiValue: `${campaignsSummary.totalOpenClicks}%`,
    iconClass: 'open-rate',
  },
  {
    id: 3,
    kpiTitleId: 'dashboard.campaigns.totalCtr',
    kpiValue: `${campaignsSummary.clickThroughRate}%`,
    iconClass: 'ctr',
  },
];
