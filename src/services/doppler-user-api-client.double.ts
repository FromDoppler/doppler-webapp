import { DopplerUserApiClient, ContactInformation, BillingInformation } from './doppler-user-api-client';
import { ResultWithoutExpectedErrors, EmptyResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';

const contactInformationResult = {
  email: 'test@makingsense.com',
  firstname: 'Test',
  lastname: 'Test',
  address: 'Alem 1234',
  city: 'Tandil',
  province: 'Buenos Aires',
  country: 'es',
  zipCode: '7000',
  phone: '+542494222222',
  company: 'Making Sense',
  industry: 'IT',
  completed: true,
};

const billingInformationResult = {
  sameAddress: true,
  firstname: 'Test',
  lastname: 'Test',
  address: 'Alem 1234',
  city: 'Tandil',
  province: 'Buenos Aires',
  country: 'es',
  zipCode: '7000',
  phone: '+542494222222',
  chooseQuestion: '',
  answerQuestion: '',
  completed: false,
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

  public async getBillingInformationData(): Promise<
    ResultWithoutExpectedErrors<BillingInformation>
  > {
    console.log('getBillingInformationData');
    await timeout(1500);

    return {
      value: billingInformationResult,
      success: true,
    };
  }

  public async updateBillingInformation(
    values: any,
  ): Promise<EmptyResultWithoutExpectedErrors> {
    await timeout(1500);
    console.log(values);
    return {
      success: true,
    };
  }
}
