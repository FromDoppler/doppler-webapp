import { ResultWithoutExpectedErrors } from '../doppler-types';
import { BigQueryClient, EmailList, SaveEmailsResult } from './big-query-client';
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
    await timeout(500);
    return { success: true, value: result };
  }

  public async saveEmailsData(payload: EmailList): Promise<SaveEmailsResult> {
    console.log('saveEmailsData: ', payload);
    await timeout(500);
    return { success: true };
  }
}
