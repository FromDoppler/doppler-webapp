import { EmptyResultWithoutExpectedErrors, ResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from './app-session';

export interface DopplerContactPolicyApiClient {
  getAccountSettings(): Promise<ResultWithoutExpectedErrors<AccountSettings>>;
  updateAccountSettings(data: AccountSettings): Promise<EmptyResultWithoutExpectedErrors>;
}

export interface DopplerContactPolicyApiConnectionData {
  email: string;
  jwtToken: string;
}

export interface AccountSettings {
  accountName: string | null;
  active: boolean | null;
  emailsAmountByInterval: number | null;
  intervalInDays: number | null;
  excludedSubscribersLists: SubscriberList[] | null;
  timeRestriction: TimeRestriction | null;
}

export interface SubscriberList {
  id: number;
  name: string;
}

export interface TimeRestriction {
  timeSlotEnabled: boolean | null;
  hourFrom: number | null;
  hourTo: number | null;
  weekdaysEnabled: boolean | null;
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

  private getDopplerContactPolicyApiConnectionData(): DopplerContactPolicyApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler Contact Policy API connection data is not available');
    }
    return {
      email: connectionData.userData.user.email,
      jwtToken: connectionData.jwtToken,
    };
  }

  private mapSubscriberList(data: any): SubscriberList[] {
    return data.map((x: any) => ({
      id: x.id,
      name: x.name,
    }));
  }

  private mapTimeRestriction(data: any): TimeRestriction {
    return {
      timeSlotEnabled: data.timeSlotEnabled,
      hourFrom: data.hourFrom || 0,
      hourTo: data.hourTo || 0,
      weekdaysEnabled: data.weekdaysEnabled,
    };
  }

  async getAccountSettings(): Promise<ResultWithoutExpectedErrors<AccountSettings>> {
    try {
      const { email, jwtToken } = this.getDopplerContactPolicyApiConnectionData();
      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${email}/settings`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        const settings = {
          accountName: response.data.accountName || '',
          active: response.data.active || false,
          emailsAmountByInterval: response.data.emailsAmountByInterval || 1,
          intervalInDays: response.data.intervalInDays || 1,
          excludedSubscribersLists: response.data.excludedSubscribersLists
            ? this.mapSubscriberList(response.data.excludedSubscribersLists)
            : [],
          timeRestriction: response.data.timeRestriction
            ? this.mapTimeRestriction(response.data.timeRestriction)
            : null,
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
      const { email, jwtToken } = this.getDopplerContactPolicyApiConnectionData();
      const response = await this.axios.request({
        method: 'PUT',
        url: `/accounts/${email}/settings`,
        headers: { Authorization: `bearer ${jwtToken}` },
        data,
      });

      if (response.status === 200) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }
}
