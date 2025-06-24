import { AxiosInstance, AxiosStatic } from 'axios';
import { ResultWithoutExpectedErrors } from '../doppler-types';
import { RefObject } from 'react';
import { AppSession } from './app-session';

export interface DopplerPopupHubApiClient {
  getImpressions(dateFrom: string, dateTo: string): Promise<ResultWithoutExpectedErrors<number>>;
}

interface DopplerPopupHubApiConnectionData {
  jwtToken: string;
  idUser: number;
  email: string;
}

export class HttpDopplerPopupHubApiClient implements DopplerPopupHubApiClient {
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

  private getDopplerPopupHubApiConnectionData(): DopplerPopupHubApiConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.userData
    ) {
      throw new Error('Doppler Popup Hub API connection data is not available');
    }
    return {
      jwtToken: connectionData.jwtToken,
      idUser: connectionData.userData.user.idUser,
      email: connectionData.userData.user.email,
    };
  }

  public async getImpressions(
    dateFrom: string,
    dateTo: string,
  ): Promise<ResultWithoutExpectedErrors<number>> {
    try {
      const { jwtToken } = this.getDopplerPopupHubApiConnectionData();
      const response = await this.axios.request({
        method: 'GET',
        url: `/api/userplan/get-account-plan-info`,
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
        return {
          success: true,
          value: response.data.totalViewsConsumed,
        };
      } else {
        return { success: false, error: response };
      }
    } catch (error) {
      return { success: false, error: error };
    }
  }
}
