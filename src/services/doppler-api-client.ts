import { ResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';
import { SubscriberList, SubscriberListState } from './shopify-client';

export interface DopplerApiClient {
  getListData(idList: number, apikey: string): Promise<ResultWithoutExpectedErrors<SubscriberList>>;
  getSubscriber(email: string, apikey: string): Promise<ResultWithoutExpectedErrors<Subscriber>>;
}
interface DopplerApiConnectionData {
  jwtToken: string;
  userAccount: string;
}

interface Fields {
  name: string;
  value: string;
  predefined: boolean;
  private: boolean;
  readonly: boolean;
  type: string;
}

export interface Subscriber {
  email: string;
  fields: Fields[];
  unsubscribedDate: string;
  unsubscriptionType: string;
  manualUnsubscriptionReason: string;
  unsubscriptionComment: string;
  status: string;
  score: number;
}

export class HttpDopplerApiClient implements DopplerApiClient {
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

  private getDopplerApiConnectionData(): DopplerApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler API connection data is not available');
    }
    return {
      jwtToken: connectionData.jwtToken,
      userAccount: connectionData ? connectionData.userData.user.email : '',
    };
  }

  private mapList(data: any): SubscriberList {
    return {
      name: data.name,
      id: data.listId,
      amountSubscribers: data.subscribersCount,
      state:
        data.currentStatus === SubscriberListState.ready
          ? SubscriberListState.ready
          : SubscriberListState.synchronizingContacts,
    };
  }

  private mapSubscriberFields(data: any): Fields[] {
    return data.map((x: any) => ({
      name: x.name,
      value: x.value,
      predefined: x.predefined,
      private: x.private,
      readonly: x.readonly,
      type: x.type,
    }));
  }

  public async getListData(listId: number): Promise<ResultWithoutExpectedErrors<SubscriberList>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/lists/${listId}`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return { success: true, value: this.mapList(response.data) };
      } else {
        return { success: false, error: response.data.title };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }

  public async getSubscriber(email: string): Promise<ResultWithoutExpectedErrors<Subscriber>> {
    try {
      const { jwtToken, userAccount } = this.getDopplerApiConnectionData();

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/subscribers/${email}`,
        headers: { Authorization: `token ${jwtToken}` },
      });

      const subscriber = {
        email: response.data.email,
        fields: this.mapSubscriberFields(response.data.fields),
        unsubscribedDate: response.data.unsubscribedDate,
        unsubscriptionType: response.data.unsubscriptionType,
        manualUnsubscriptionReason: response.data.manualUnsubscriptionReason,
        unsubscriptionComment: response.data.unsubscriptionComment,
        status: response.data.status,
        score: response.data.score,
      };

      return {
        success: true,
        value: subscriber,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }
}
