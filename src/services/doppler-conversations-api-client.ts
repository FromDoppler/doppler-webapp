import { AxiosInstance, AxiosStatic } from 'axios';
import { ResultWithoutExpectedErrors } from '../doppler-types';
import { RefObject } from 'react';
import { AppSession } from './app-session';

export interface DopplerConversationsApiClient {
  getConversations(dateFrom: string, dateTo: string): Promise<ResultWithoutExpectedErrors<number>>;
}

interface DopplerConversationsApiConnectionData {
  jwtToken: string;
  idUser: number;
}

export class HttpDopplerConversationsApiClient implements DopplerConversationsApiClient {
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

  private getDopplerConversationsApiConnectionData(): DopplerConversationsApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler Conversations API connection data is not available');
    }
    return {
      jwtToken: connectionData.jwtToken,
      idUser: connectionData.userData.user.idUser,
    };
  }

  public async getConversations(
    dateFrom: string,
    dateTo: string,
  ): Promise<ResultWithoutExpectedErrors<number>> {
    try {
      const { idUser, jwtToken } = this.getDopplerConversationsApiConnectionData();
      const response = await this.axios.request({
        method: 'GET',
        url: `/customer/${idUser}/conversations?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200) {
        return {
          success: true,
          value: response.data,
        };
      } else {
        return { success: false, error: response };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }
}
