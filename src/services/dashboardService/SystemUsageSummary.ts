import { AxiosInstance, AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from './../app-session';
import { ResultWithoutExpectedErrors } from '../../doppler-types';

type DefaultType = boolean | null | undefined;

export interface SystemUsageSummary {
  hasListsCreated: DefaultType;
  hasDomainsReady: DefaultType;
  hasCampaingsCreated: DefaultType;
  hasCampaingsSent: DefaultType;
}

export interface SystemUsageSummaryApiConectionData {
  email: string;
  jwtToken: string;
}

export interface SystemUsageSummaryClient {
  getSystemUsageSummaryData(): ResultWithoutExpectedErrors<SystemUsageSummary>;
}

export class HttpSystemUsageSummaryClient implements SystemUsageSummaryClient {
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

  private getSystemUsageSummaryApiConectionData(): SystemUsageSummaryApiConectionData {
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
      email: connectionData ? connectionData.userData.user.email : '',
    };
  }

  async getSystemUsageSummaryData(): Promise<ResultWithoutExpectedErrors<SystemUsageSummary>> {
    try {
      const { email, jwtToken } = this.getSystemUsageSummaryApiConectionData();
      const response = await this.axios.request({
        method: 'GET',
        url: `/${email}/summary/system-usage`,
        headers: { Authorization: `bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data) {
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
