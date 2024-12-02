import {
  ResultWithoutExpectedErrors,
  EmptyResultWithoutExpectedErrors,
  nonAuthenticatedBlockedUser,
} from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';
import { PLAN_TYPE, PaymentMethodType } from '../doppler-types';

export const Approved = 0;
export const Pending = 1;
export const Declined = 2;

export interface DopplerBillingUserApiClient {
  getBillingInformationData(): Promise<ResultWithoutExpectedErrors<BillingInformation>>;
  updateBillingInformation(values: any): Promise<EmptyResultWithoutExpectedErrors>;
  cancellationLandings(): Promise<EmptyResultWithoutExpectedErrors>;
  getPaymentMethodData(): Promise<ResultWithoutExpectedErrors<PaymentMethod>>;
  updatePaymentMethod(values: any): Promise<EmptyResultWithoutExpectedErrors>;
  purchase(values: any): Promise<EmptyResultWithoutExpectedErrors>;
  purchaseLandings(values: any): Promise<EmptyResultWithoutExpectedErrors>;
  getInvoiceRecipientsData(): Promise<ResultWithoutExpectedErrors<string[]>>;
  updateInvoiceRecipients(values: any, planId: number): Promise<EmptyResultWithoutExpectedErrors>;
  getCurrentUserPlanData(): Promise<ResultWithoutExpectedErrors<UserPlan>>;
  updatePurchaseIntention(): Promise<EmptyResultWithoutExpectedErrors>;
  reprocess(values: any): Promise<ResultWithoutExpectedErrors<ReprocessInformation>>;
  getInvoices(invoicesTypes: string[]): Promise<ResultWithoutExpectedErrors<GetInvoicesResult>>;
  sendContactInformation(values: any): Promise<EmptyResultWithoutExpectedErrors>;
  getCurrentUserPlanDataByType(type: number): Promise<ResultWithoutExpectedErrors<UserPlan>>;
  purchaseOnSitePlan(values: any): Promise<EmptyResultWithoutExpectedErrors>;
  cancellationOnSitePlan(): Promise<EmptyResultWithoutExpectedErrors>;
  activateOnSitePlan(): Promise<EmptyResultWithoutExpectedErrors>;
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
  bankName: string;
  bankAccount: string;
  paymentType: string;
  paymentWay: string;
  useCFDI: string;
  taxRegime: number;
  taxCertificate: object;
  cbu: string;
}

export interface UserPlan {
  idPlan: number;
  planSubscription: number;
  planType: string;
  remainingCredits: number;
  emailQty: number;
  subscribersQty: null;
  conversationQty: null;
  description: null;
  printQty: null;
}

export interface ReprocessInformation {
  allInvoicesProcessed: boolean;
}

export interface Invoice {
  date: Date;
  invoiceNumber: string;
  amount: number;
  error: string;
  status: string;
}

export interface GetInvoicesResult {
  totalPending: number;
  invoices: Invoice[];
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
      (connectionData.status !== 'authenticated' &&
        connectionData.status !== nonAuthenticatedBlockedUser) ||
      (connectionData.status === 'authenticated' &&
        !connectionData.jwtToken &&
        !connectionData.userData) ||
      (connectionData.status === nonAuthenticatedBlockedUser && !connectionData.provisoryToken)
    ) {
      throw new Error('Doppler Billing User API connection data is not available');
    }
    return {
      jwtToken:
        connectionData.status === 'authenticated'
          ? connectionData.jwtToken
          : connectionData.provisoryToken,
      email:
        connectionData.status === 'authenticated'
          ? connectionData.userData.user.email
          : connectionData.email,
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
      bankName: data.bankName,
      bankAccount: data.bankAccount,
      paymentType: data.paymentType,
      paymentWay: data.paymentWay,
      useCFDI: data.useCFDI,
      taxRegime: data.taxRegime,
      taxCertificate: data.taxCertificate,
      cbu: data.cbu,
    };
  }

  private mapAgreementToCreate(data: any): any {
    return {
      total: data.total,
      discountId: data.discountId,
      planId: data.planId,
      promocode: data.promocode,
      originInbound: data.originInbound,
      additionalServices: data.additionalServices,
    };
  }

  private mapLandingAgreementToCreate(data: any): any {
    console.log('data a mapear', data);
    return {
      total: data.total,
      landingPlans: data.landingPacks,
    };
  }

  private mapPaymentMethodToUpdate(data: any): any {
    switch (data.paymentMethodName) {
      case PaymentMethodType.transfer:
        const payload: any = {
          paymentMethodName: data.paymentMethodName,
          idSelectedPlan: data.idSelectedPlan,
          razonSocial: data.businessName,
          idConsumerType: data.consumerType,
          identificationNumber: `${data.identificationNumber}`,
          bankName: data.bankName,
          bankAccount: data.bankAccount,
          paymentType: data.paymentType,
          paymentWay: data.paymentWay,
          useCFDI: data.cfdi,
        };

        // these fields are used when transfer is mexico
        if (data.taxRegime) {
          payload.taxRegime = data.taxRegime;
        }

        if (data.taxCertificate) {
          payload.taxCertificate = data.taxCertificate;
        }

        return payload;

      case PaymentMethodType.mercadoPago:
        return {
          ccHolderFullName: data.name,
          ccNumber: data.number?.replaceAll(' ', ''),
          ccVerification: data.cvc,
          paymentMethodName: data.paymentMethodName,
          idSelectedPlan: data.idSelectedPlan,
          ccExpYear: data.expiry?.split('/')[1],
          ccExpMonth: data.expiry?.split('/')[0],
          ccType: data.ccType,
          identificationNumber: `${data.identificationNumber}`,
        };

      case PaymentMethodType.automaticDebit:
        return {
          paymentMethodName: data.paymentMethodName,
          idSelectedPlan: data.idSelectedPlan,
          razonSocial: data.businessName,
          idConsumerType: data.consumerType,
          identificationNumber: `${data.identificationNumber}`,
          bankName: data.bankName,
          bankAccount: data.bankAccount,
          paymentType: data.paymentType,
          paymentWay: data.paymentWay,
          useCFDI: data.cfdi,
          cbu: data.cbu,
        };

      default:
        return {
          ccHolderFullName: data.name,
          ccNumber: data.number?.replaceAll(' ', ''),
          ccVerification: data.cvc,
          paymentMethodName: data.paymentMethodName,
          idSelectedPlan: data.idSelectedPlan,
          ccExpYear: data.expiry?.split('/')[1],
          ccExpMonth: data.expiry?.split('/')[0],
          ccType: data.ccType,
        };
    }
  }

  private mapInvoiceRecipientsToUpdate(data: any, planId: number): any {
    return {
      planId: planId,
      recipients: data,
    };
  }

  private mapUserPlan(data: any): UserPlan {
    return {
      idPlan: data.idPlan,
      planSubscription: data.planSubscription,
      planType: this.mapPlanType(data.planType),
      remainingCredits: data.remainingCredits,
      emailQty: data.emailQty,
      subscribersQty: data.subscribersQty,
      conversationQty: data.conversationQty,
      description: data.description,
      printQty: data.printQty,
    };
  }

  private mapSendContantInformation(data: any): any {
    return {
      userName: data.firstname,
      userLastname: data.lastname,
      userEmail: data.email,
      phoneNumber: data.phone,
    };
  }

  private mapPlanType(type: any): string {
    switch (type) {
      case 'Individual':
        return PLAN_TYPE.byCredit;
      case 'Monthly':
        return PLAN_TYPE.byEmail;
      case 'Subscribers':
        return PLAN_TYPE.byContact;
      default:
        return '';
    }
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

  public async cancellationLandings(): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${email}/landings/cancel`,
        headers: { Authorization: `bearer ${jwtToken}` },
        withCredentials: true,
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
      const mappedValues = this.mapPaymentMethodToUpdate(values);
      const formData = new FormData();
      Object.entries(mappedValues).forEach(([key, value]: [string, any]) => {
        formData.append(key, value);
      });

      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${email}/payment-methods/current`,
        data: formData,
        headers: { Authorization: `bearer ${jwtToken}`, 'Content-Type': 'multipart/form-data' },
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
        url: `/accounts/${email}/agreements`,
        data: this.mapAgreementToCreate(values),
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

  public async purchaseLandings(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'POST',
        url: `/accounts/${email}/landings/buy`,
        data: this.mapLandingAgreementToCreate(values),
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

  public async getInvoiceRecipientsData(): Promise<ResultWithoutExpectedErrors<string[]>> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/billing-information/invoice-recipients`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: response.data };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async updateInvoiceRecipients(
    values: any,
    planId: number,
  ): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${email}/billing-information/invoice-recipients`,
        data: this.mapInvoiceRecipientsToUpdate(values, planId),
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

  public async getCurrentUserPlanData(): Promise<ResultWithoutExpectedErrors<UserPlan>> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/plans/1/current`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapUserPlan(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async updatePurchaseIntention(): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${email}/purchase-intention`,
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

  public async reprocess(): Promise<ResultWithoutExpectedErrors<ReprocessInformation>> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${email}/payments/reprocess`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200) {
        return { success: true, value: response.data };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getInvoices(
    invoicesTypes: string[],
  ): Promise<ResultWithoutExpectedErrors<GetInvoicesResult>> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      let queryParams = invoicesTypes.length > 0 ? `?withStatus=${invoicesTypes[0]}` : '';

      for (let i = 1; i < invoicesTypes.length; i++) {
        queryParams += `&withStatus=${invoicesTypes[i]}`;
      }

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/invoices${queryParams}`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: response.data };
      } else {
        return { success: false, error: response.data };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async sendContactInformation(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'POST',
        url: `/accounts/${email}/payments/reprocess/send-contact-information-notification`,
        data: this.mapSendContantInformation(values),
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200) {
        return { success: true };
      } else {
        return { success: false, error: response.data };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getCurrentUserPlanDataByType(
    type: number,
  ): Promise<ResultWithoutExpectedErrors<UserPlan>> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/plans/${type}/current`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapUserPlan(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async purchaseOnSitePlan(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'POST',
        url: `/accounts/${email}/onsite/buy`,
        data: this.mapOnSiteAgreementToCreate(values),
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

  public async cancellationOnSitePlan(): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${email}/onsite/cancel`,
        headers: { Authorization: `bearer ${jwtToken}` },
        withCredentials: true,
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

  public async activateOnSitePlan(): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerBillingUserApiConnectionData();

      const response = await this.axios.request({
        method: 'POST',
        url: `/accounts/${email}/onsite/activate`,
        headers: { Authorization: `bearer ${jwtToken}` },
        withCredentials: true,
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

  private mapOnSiteAgreementToCreate(data: any): any {
    return {
      total: data.total,
      planId: data.onSitePlanId,
    };
  }
}
