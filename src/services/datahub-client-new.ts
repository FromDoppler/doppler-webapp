import { AxiosInstance, AxiosStatic, AxiosPromise } from 'axios';
import { RefObject } from 'react';
import { AppSession, DatahubConnectionData } from './app-session';
import { ResultWithoutExpectedErrors } from '../doppler-types';

export interface DomainEntry {
  name: string;
  verified_date: Date | null;
}

export interface DatahubClientNew {
  getAccountDomains(): Promise<DomainsResult>;
}

export type DomainsResult = ResultWithoutExpectedErrors<DomainEntry[]>;

export class HttpDatahubClientNew implements DatahubClientNew {
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

  private getDatahubConnectionData(): DatahubConnectionData {
    const connectionData = this.connectionDataRef.current;
    if (
      !connectionData ||
      connectionData.status !== 'authenticated' ||
      !connectionData.jwtToken ||
      !connectionData.datahubCustomerId
    ) {
      throw new Error('DataHub connection data is not available');
    }
    return connectionData;
  }

  private customerGet<T>(subUrl: string, params?: any): AxiosPromise<T> {
    const { datahubCustomerId: customerId, jwtToken } = this.getDatahubConnectionData();
    return this.axios.request<T>({
      method: 'GET',
      url: `/cdhapi/customers/${customerId}/${subUrl}`,
      params: params,
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
  }

  public async getAccountDomains(): Promise<DomainsResult> {
    try {
      const response = await this.customerGet<{ items: any[] }>('domains');
      const data = response.data.items
        .filter((x) => x.enabled)
        .map((x) => ({
          name: x.domainName,
          verified_date: (x.lastNavigationEventTime && new Date(x.lastNavigationEventTime)) || null,
        }));
      return {
        success: true,
        value: data,
      }
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }
}
