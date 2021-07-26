import { DopplerUserApiClient, ContactInformation } from './doppler-user-api-client';
import { ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';

const contactInformationResult = {
  email: 'test@makingsense.com',
  firstname: 'Test',
  lastname: 'Test',
  address: 'Alem 1234',
  city: 'Tandil',
  province: 'AR-B',
  country: 'ar',
  zipCode: '7000',
  phone: '+542494222222',
  company: 'Making Sense',
  industry: 'dplr1',
};

export class HardcodedDopplerUserApiClient implements DopplerUserApiClient {
  public async getContactInformationData(): Promise<
    ResultWithoutExpectedErrors<ContactInformation>
  > {
    console.log('getContactInformationData');
    await timeout(1500);

    return {
      value: contactInformationResult,
      success: true,
    };
  }

  public async createOrUpdateContactInformation(
    values: any,
  ): Promise<ResultWithoutExpectedErrors<boolean>> {
    await timeout(1500);
    console.log(values);
    return {
      value: true,
      success: true,
    };
  }
}
