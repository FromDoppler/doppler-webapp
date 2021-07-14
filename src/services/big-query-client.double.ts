import { ResultWithoutExpectedErrors } from '../doppler-types';
import { BigQueryClient, EmailList } from './big-query-client';
import { timeout } from '../utils';

const result = {
  emails: ['email1@gmail.com', 'email2@gmail.com', 'email3@gmail.com'],
};

export class HardcodedBigQueryClient implements BigQueryClient {
  public async getEmailsData(): Promise<ResultWithoutExpectedErrors<EmailList>> {
    console.log('getEmailsData');
    //await timeout(1500);
    return { success: true, value: result };
  }
}
