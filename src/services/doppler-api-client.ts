import { ResultWithoutExpectedErrors } from '../doppler-types';
import { AxiosInstance, AxiosStatic } from 'axios';
import { AppSession } from './app-session';
import { RefObject } from 'react';
import { SubscriberList, SubscriberListState } from './shopify-client';
import { ExperimentalFeatures } from './experimental-features';

export interface DopplerApiClient {
  getListData(idList: number, apikey: string): Promise<ResultWithoutExpectedErrors<SubscriberList>>;
}
interface DopplerApiConnectionData {
  jwtToken: string;
  userAccount: string;
}

export class HttpDopplerApiClient implements DopplerApiClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;
  private readonly connectionDataRef: RefObject<AppSession>;
  private readonly experimentalFeatures?: ExperimentalFeatures;

  constructor({
    axiosStatic,
    baseUrl,
    connectionDataRef,
    experimentalFeatures,
  }: {
    axiosStatic: AxiosStatic;
    baseUrl: string;
    connectionDataRef: RefObject<AppSession>;
    experimentalFeatures?: ExperimentalFeatures;
  }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: this.baseUrl,
    });
    this.connectionDataRef = connectionDataRef;
    this.experimentalFeatures = experimentalFeatures;
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

  public async getListData(listId: number): Promise<ResultWithoutExpectedErrors<SubscriberList>> {
    try {
      const dopplerAPIFeature =
        this.experimentalFeatures && this.experimentalFeatures.getFeature('DopplerAPI');
      const apikey =
        dopplerAPIFeature && dopplerAPIFeature.apikey ? dopplerAPIFeature.apikey : null;

      const { userAccount } = this.getDopplerApiConnectionData();
      const jwtToken = apikey ? apikey : this.getDopplerApiConnectionData().jwtToken;

      const response = await this.axios.request({
        method: 'GET',
        url: `/accounts/${userAccount}/lists/${
          dopplerAPIFeature && dopplerAPIFeature.listId ? dopplerAPIFeature.listId : listId
        }`,
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
}
