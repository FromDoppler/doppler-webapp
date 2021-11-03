import { EmptyResultWithoutExpectedErrors, ResultWithoutExpectedErrors } from '../doppler-types';
import { timeout } from '../utils';
import {
  BillingInformation,
  DopplerBillingUserApiClient,
  PaymentMethod,
} from './doppler-billing-user-api-client';

export const fakeBillingInformation = {
  sameAddressAsContact: false,
  firstname: 'aa',
  lastname: 'Test',
  address: 'Alem 1234',
  city: 'Tandil',
  province: 'AR-B',
  country: 'ar',
  zipCode: '7000',
  phone: '+54 249 422-2222',
};

export const fakeBillingInformationWithEmptyData = {
  sameAddressAsContact: true,
  firstname: '',
  lastname: '',
  address: '',
  city: '',
  province: '',
  country: '',
  zipCode: '',
  phone: '',
};

export const fakePaymentMethodInformation = {
  ccHolderName: 'Juan Perez',
  ccNumber: '************1111',
  ccExpiryDate: '12/25',
  ccType: 'Visa',
  ccSecurityCode: '***',
  paymentMethodName: 'CC',
  renewalMonth: 1,
  razonSocial: '',
  idConsumerType: '',
  identificationType: '',
  identificationNumber: '',
};

export const fakePaymentMethod = {
  name: 'data.name',
  number: 'data.number',
  cvc: 'data.cvc',
  paymentMethodName: 'data.paymentMethodName',
  expiry: '12/21',
  ccType: 'data.ccType',
  idSelectedPlan: 'data.idSelectedPlan',
};

export const fakeAgreement = {
  total: 'data.total',
  discountId: '12',
  planId: '34',
};

export const fakePaymentMethodInformationWithTransfer = {
  ccHolderName: '',
  ccNumber: '',
  ccExpiryDate: '',
  ccType: '',
  ccSecurityCode: '',
  paymentMethodName: 'TRANSF',
  renewalMonth: 1,
  razonSocial: 'test',
  idConsumerType: 'CF',
  identificationType: '',
  identificationNumber: '12345678',
};

export class HardcodedDopplerBillingUserApiClient implements DopplerBillingUserApiClient {
  public async getBillingInformationData(): Promise<
    ResultWithoutExpectedErrors<BillingInformation>
  > {
    console.log('getBillingInformationData');
    await timeout(1500);

    return {
      value: fakeBillingInformation,
      success: true,
    };
  }

  public async updateBillingInformation(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    await timeout(1500);
    console.log('updateBillingInformation');
    console.log(values);
    return {
      success: true,
    };
  }

  public async getPaymentMethodData(): Promise<ResultWithoutExpectedErrors<PaymentMethod>> {
    console.log('getPaymentMethodData');
    await timeout(1500);

    return {
      value: fakePaymentMethodInformation,
      success: true,
    };
  }

  public async updatePaymentMethod(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    await timeout(1500);
    console.log('updatePaymentMethod');
    console.log(values);
    return {
      success: true,
    };
  }

  public async purchase(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    console.log('purchase', values);
    await timeout(1500);
    return { success: true };
  }
}
