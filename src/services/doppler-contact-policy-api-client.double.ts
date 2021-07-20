import { EmptyResultWithoutExpectedErrors, ResultWithoutExpectedErrors } from '../doppler-types';
import {
  AccountSettings,
  DopplerContactPolicyApiClient,
  SubscriberList,
} from './doppler-contact-policy-api-client';
import { timeout } from '../utils';

export class HardcodedDopplerContactPolicyApiClient implements DopplerContactPolicyApiClient {
  private mapSubscriberList(data: any): SubscriberList[] {
    return data.map((x: any) => ({
      id: x.id,
      name: x.name,
    }));
  }

  async getAccountSettings(): Promise<ResultWithoutExpectedErrors<AccountSettings>> {
    console.log('getAccountSettings');
    await timeout(1500);

    const excludedSubscribersLists = [
      {
        id: 1,
        name: 'List A',
      },
      {
        id: 2,
        name: 'List B',
      },
      {
        id: 3,
        name: 'List C',
      },
    ];

    const settings = {
      accountName: 'hardcoded@email.com',
      active: false,
      emailsAmountByInterval: 20,
      intervalInDays: 7,
      excludedSubscribersLists: this.mapSubscriberList(excludedSubscribersLists),
    };

    return {
      success: true,
      value: settings,
    };
  }

  async updateAccountSettings(data: AccountSettings): Promise<EmptyResultWithoutExpectedErrors> {
    console.log('setAccountSettings', data);
    await timeout(1500);
    return { success: true };
    //return { success: false, error: new Error('Dummy error') };
  }
}
