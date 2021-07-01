import { EmptyResultWithoutExpectedErrors, ResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from './app-session';

export interface DopplerContactPolicyApiClient {
  getAccountSettings(email: string): Promise<ResultWithoutExpectedErrors<AccountSettings>>;
  updateAccountSettings(data: AccountSettings): Promise<EmptyResultWithoutExpectedErrors>;
}

export interface AccountSettings {
  accountName: string;
  active: boolean;
  emailsAmountByInterval: number;
  intervalInDays: number;
  excludedSubscribersLists: SubscriberList[];
}

export interface SubscriberList {
  id: number;
  name: string;
}

export class HttpDopplerContactPolicyApiClient implements DopplerContactPolicyApiClient {
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

  private mapSubscriberList(data: any): SubscriberList[] {
    return data.map((x: any) => ({
      id: x.id,
      name: x.name,
    }));
  }

  async getAccountSettings(email: string): Promise<ResultWithoutExpectedErrors<AccountSettings>> {
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/settings`,
      });

      if (response.status === 200 && response.data) {
        const settings = {
          accountName: response.data.accountName,
          active: response.data.active,
          emailsAmountByInterval: response.data.emailsAmountByInterval,
          intervalInDays: response.data.intervalInDays,
          excludedSubscribersLists: this.mapSubscriberList(response.data.excludedSubscribersLists),
        };

        return {
          success: true,
          value: settings,
        };
      } else {
        return { success: false, error: response };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  async updateAccountSettings(data: AccountSettings): Promise<EmptyResultWithoutExpectedErrors> {
    try {
      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${data.accountName}/settings`,
        data,
      });

      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, error: response };
      }
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }
}
