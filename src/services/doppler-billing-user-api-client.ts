import { ResultWithoutExpectedErrors, EmptyResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';

export interface DopplerBillingUserApiClient {
  getBillingInformationData(): Promise<ResultWithoutExpectedErrors<BillingInformation>>;
  updateBillingInformation(values: any): Promise<EmptyResultWithoutExpectedErrors>;
  getPaymentMethodData(): Promise<ResultWithoutExpectedErrors<PaymentMethod>>;
  updatePaymentMethod(values: any): Promise<EmptyResultWithoutExpectedErrors>;
  purchase(values: any): Promise<EmptyResultWithoutExpectedErrors>;
}

interface DopplerBillingUserApiConnectionData {
  jwtToken: string;
  email: string;
}

export interface BillingInformation {
  sameAddressAsContact: boolean;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  province: string;
  country: string;
  zipCode: string;
  phone: string;
}

export interface Features {
  contactPolicies: boolean;
}

export interface PaymentMethod {
  ccHolderName: string;
  ccNumber: string;
  ccSecurityCode: string;
  ccExpiryDate: string;
  ccType: string;
  paymentMethodName: string;
  renewalMonth: number;
  razonSocial: string;
  idConsumerType: string;
  identificationType: string;
  identificationNumber: string;
}

export class HttpDopplerBillingUserApiClient implements DopplerBillingUserApiClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;
  private readonly connectionDataRef: RefObject<AppSession>;

  constructor({
    axiosStatic,
    baseUrl,
    connectionDataRef,
  }: {
    axiosStatic: AxiosStatic;
    baseUrl: string;
    connectionDataRef: RefObject<AppSession>;
  }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: this.baseUrl,
    });
    this.connectionDataRef = connectionDataRef;
  }

  private getDopplerBillingUserApiConnectionData(): DopplerBillingUserApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler Billing User API connection data is not available');
    }
    return {
      jwtToken: connectionData.jwtToken,
      email: connectionData.userData.user.email,
    };
  }

  private hasAddressInformation(billingInformation: any): boolean {
    return (
      billingInformation.address ||
      billingInformation.city ||
      billingInformation.province ||
      billingInformation.country ||
      billingInformation.zipCode ||
      billingInformation.phone
    );
  }

  private mapBillingInformation(data: any): BillingInformation {
    return {
      sameAddressAsContact: !this.hasAddressInformation(data),
      firstname: data.firstname,
      lastname: data.lastname,
      address: data.address,
      city: data.city,
      province: data.province,
      country: data.country.toLowerCase(),
      zipCode: data.zipCode,
      phone: data.phone,
    };
  }

  private mapPaymentMethod(data: any): PaymentMethod {
    return {
      ccHolderName: data.ccHolderFullName,
      ccNumber: data.ccNumber,
      ccSecurityCode: data.ccVerification,
      ccExpiryDate:
        data.ccExpMonth && data.ccExpYear
          ? data.ccExpMonth.padStart(2, '0') + '/' + data.ccExpYear
          : '',
      ccType: data.ccType,
      paymentMethodName: data.paymentMethodName,
      renewalMonth: data.renewalMonth,
      razonSocial: data.razonSocial,
      idConsumerType: data.idConsumerType,
      identificationType: data.identificationType,
      identificationNumber: data.identificationNumber,
    };
  }

  private mapCreditCardPaymentMethod(data: any): any {
    return {
      ccHolderFullName: data.name,
      ccNumber: data.number,
      ccVerification: data.cvc,
      paymentMethodName: data.paymentMethodName,
      ccExpYear: data.expiry.split('/')[1],
      ccExpMonth: data.expiry.split('/')[0],
      ccType: data.ccType,
    };
  }

  public async getBillingInformationData(): Promise<
    ResultWithoutExpectedErrors<BillingInformation>
  > {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/billing-information`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapBillingInformation(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async updateBillingInformation(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${email}/billing-information`,
        data: values,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getPaymentMethodData(): Promise<ResultWithoutExpectedErrors<PaymentMethod>> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/payment-methods/current`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapPaymentMethod(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async updatePaymentMethod(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${email}/payment-methods/current`,
        data: this.mapCreditCardPaymentMethod(values),
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async purchase(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'POST',
        url: `/accounts/${email}/billing`,
        data: values,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }
}
