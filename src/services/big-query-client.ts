import { ResultWithoutExpectedErrors } from '../doppler-types';
import { HttpBaseClient } from './http-base-client';

export interface EmailList {
  emails: String[];
}

export interface BigQueryClient {
  getEmailsData(): Promise<ResultWithoutExpectedErrors<EmailList>>;
}

export class HttpBigQueryClient extends HttpBaseClient implements BigQueryClient {
  private clientName = 'Big Query';
  private mapEmails(response: any): EmailList {
    return {
      emails: response.emails,
    };
  }
  public async getEmailsData(): Promise<ResultWithoutExpectedErrors<EmailList>> {
    try {
      const { jwtToken, email } = this.getApiConnectionData(this.clientName);
      const response = await this.axios.request({
        method: 'GET',
        url: `/big-query/${email}/allowed-emails`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      const values = this.mapEmails(response.data);
      return {
        success: true,
        value: values,
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: error };
    }
  }
}
