import { HttpBaseClient } from '../http-base-client';
import { ResultWithoutExpectedErrors } from '../../doppler-types';

export interface CampaignSummary {
  totalSentEmails: number;
  totalOpenClicks: number;
  clickThroughRate: number;
}

export interface ContactSummary {
  totalSubscribers: Number;
  newSubscribers: Number;
  removedSubscribers: Number;
}

export interface ReportClient {
  getCampaignsSummary(query: {
    dateFrom: Date;
    dateTo: Date;
  }): Promise<ResultWithoutExpectedErrors<CampaignSummary>>;

  getContactsSummary(query: {
    dateFrom: Date;
    dateTo: Date;
  }): Promise<ResultWithoutExpectedErrors<ContactSummary>>;
}

export class HttpReportClient extends HttpBaseClient implements ReportClient {
  private clientName = 'Report';

  public async getCampaignsSummary({
    dateFrom,
    dateTo,
  }: {
    dateFrom: Date;
    dateTo: Date;
  }): Promise<ResultWithoutExpectedErrors<CampaignSummary>> {
    try {
      const { jwtToken, email } = this.getApiConnectionData(this.clientName);
      const response = await this.axios.request({
        method: 'GET',
        url: `/${email}/summary/campaigns`,
        params: {
          startDate: dateFrom.toISOString(),
          endDate: dateTo.toISOString(),
        },
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      return {
        success: true,
        value: response.data,
      };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  }

  public async getContactsSummary({
    dateFrom,
    dateTo,
  }: {
    dateFrom: Date;
    dateTo: Date;
  }): Promise<ResultWithoutExpectedErrors<ContactSummary>> {
    try {
      const { jwtToken, email } = this.getApiConnectionData(this.clientName);
      const response = await this.axios.request({
        method: 'GET',
        url: `/${email}/summary/subscribers`,
        params: {
          startDate: dateFrom.toISOString(),
          endDate: dateTo.toISOString(),
        },
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      return {
        success: true,
        value: response.data,
      };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  }
}
