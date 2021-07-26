import { ResultWithoutExpectedErrors } from '../doppler-types';
import { BigQueryClient, EmailList } from './big-query-client';
import { timeout } from '../utils';

const result = {
  emails: [
    'allanwatts@gmail.com',
    'mdirago@gmail.com',
    'casco@gmail.com',
    'carlos-sampedro@gmail.com',
    'jose_luis_alvarez_arguelles@gmail.com',
  ],
};

export class HardcodedBigQueryClient implements BigQueryClient {
  public async getEmailsData(): Promise<ResultWithoutExpectedErrors<EmailList>> {
    console.log('getEmailsData');
    //await timeout(1500);
    return { success: true, value: result };
  }
}
