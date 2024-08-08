import {
  ResultWithoutExpectedErrors,
  EmptyResultWithoutExpectedErrors,
  IntegrationStatus,
} from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';

export interface DopplerUserApiClient {
  getContactInformationData(): Promise<ResultWithoutExpectedErrors<ContactInformation>>;
  updateContactInformation(values: any): Promise<EmptyResultWithoutExpectedErrors>;
  getFeatures(): Promise<ResultWithoutExpectedErrors<Features>>;
  getIntegrationsStatus(): Promise<ResultWithoutExpectedErrors<IntegrationsStatus>>;
  sendCollaboratorInvite(value: string): Promise<EmptyResultWithoutExpectedErrors>;
  updateUserAccountInformation(values: any): Promise<EmptyResultWithoutExpectedErrors>;
}

interface DopplerUserApiConnectionData {
  jwtToken: string;
  email: string;
  idUser: number;
}

export interface ContactInformation {
  email: string;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  province: string;
  country?: string;
  zipCode: string;
  phone: string;
  company: string;
  industry: string;
  idSecurityQuestion: string;
  answerSecurityQuestion: string;
}

export interface Features {
  contactPolicies: boolean;
  bigQuery: boolean;
}

export interface IntegrationsStatus {
  [key: string]: IntegrationStatus;
}

export interface CollaboratorInvite {
  idUser: number;
  email: string;
  firstname: string;
  lastname: string;
  invitationDate: string;
  expirationDate: string;
  invitationStatus: string;
}

export class HttpDopplerUserApiClient implements DopplerUserApiClient {
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

  private getDopplerUserApiConnectionData(): DopplerUserApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler User API connection data is not available');
    }
    return {
      jwtToken: connectionData.jwtToken,
      email: connectionData.userData.user.email,
      idUser: connectionData.userData.user.idUser,
    };
  }

  private mapContactInformation(data: any): ContactInformation {
    return {
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      address: data.address,
      city: data.city,
      province: data.province,
      country: data.country.toLowerCase(),
      zipCode: data.zipCode,
      phone: data.phone,
      company: data.company,
      industry: data.industry,
      idSecurityQuestion: data.idSecurityQuestion,
      answerSecurityQuestion: data.answerSecurityQuestion,
    };
  }

  public async getContactInformationData(): Promise<
    ResultWithoutExpectedErrors<ContactInformation>
  > {
    try {
      const { email, jwtToken } = this.getDopplerUserApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/contact-information`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapContactInformation(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async updateContactInformation(values: any): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerUserApiConnectionData();

      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${email}/contact-information`,
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

  // TODO: it should be removed, the features are available for all users.
  // [Related ticket](https://makingsense.atlassian.net/browse/DOP-1097)
  public async getFeatures(): Promise<ResultWithoutExpectedErrors<Features>> {
    try {
      const { email, jwtToken } = this.getDopplerUserApiConnectionData();
      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/features`,
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

  public async getIntegrationsStatus(): Promise<ResultWithoutExpectedErrors<IntegrationsStatus>> {
    try {
      const { email, jwtToken } = this.getDopplerUserApiConnectionData();
      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/integrations/status`,
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

  public async sendCollaboratorInvite(value: string): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken, idUser } = this.getDopplerUserApiConnectionData();

      const response = await this.axios.request({
        method: 'POST',
        url: `/accounts/${email}/user-invitations`,
        data: {
          email: value,
          idUser: idUser,
        },
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200) {
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getCollaborationInvites(): Promise<
    ResultWithoutExpectedErrors<Array<CollaboratorInvite>>
  > {
    try {
      const { email, jwtToken } = this.getDopplerUserApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/user-invitations`,
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

  public async cancelCollaboratorInvite(value: string): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken, idUser } = this.getDopplerUserApiConnectionData();

      const response = await this.axios.request({
        method: 'POST',
        url: `/accounts/${email}/cancel-user-invitation`,
        data: {
          email: value,
          idUser: idUser,
        },
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200) {
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async updateUserAccountInformation(
    values: any,
  ): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const { email, jwtToken } = this.getDopplerUserApiConnectionData();

      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/user-account/${email}/edit`,
        data: values,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200) {
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message,
          errorCode: response.data.errorCode,
        };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }
}
