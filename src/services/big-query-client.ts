import { HttpBaseClient } from './http-base-client';
import { ResultWithoutExpectedErrors, EmptyResultWithoutExpectedErrors } from '../doppler-types';

export type SaveEmailsResult = EmptyResultWithoutExpectedErrors;
export interface EmailList {
  emails: String[];
}

export interface BigQueryClient {
  getEmailsData(): Promise<ResultWithoutExpectedErrors<EmailList>>;
  saveEmailsData(payload: EmailList): Promise<SaveEmailsResult>;
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
        headers: { Authorization: `bearer ${jwtToken}` },
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

  public async saveEmailsData(payload: EmailList): Promise<SaveEmailsResult> {
    try {
      const { jwtToken, email } = this.getApiConnectionData(this.clientName);
      const response = await this.axios.request({
        method: 'PUT',
        url: `/big-query/${email}/allowed-emails`,
        headers: { Authorization: `bearer ${jwtToken}` },
        data: payload,
      });
      if (response.data) {
        return { success: true };
      } else {
        return { success: false, error: response };
      }
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }
}
