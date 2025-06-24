import { AxiosInstance, AxiosStatic } from 'axios';
import { ResultWithoutExpectedErrors } from '../doppler-types';
import { RefObject } from 'react';
import { AppSession } from './app-session';

export interface DopplerBeplicApiClient {
  getConversations(dateFrom: string, dateTo: string): Promise<ResultWithoutExpectedErrors<number>>;
}

interface DopplerBeplicApiConnectionData {
  jwtToken: string;
  idUser: number;
}

export class HttpDopplerBeplicApiClient implements DopplerBeplicApiClient {
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

  private getDopplerBeplicApiConnectionData(): DopplerBeplicApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler Beplic API connection data is not available');
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
      const { idUser, jwtToken } = this.getDopplerBeplicApiConnectionData();
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
