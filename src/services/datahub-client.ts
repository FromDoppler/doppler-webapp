import { AxiosInstance, AxiosStatic, AxiosPromise } from 'axios';
import { RefObject } from 'react';
import { AppSession, DatahubConnectionData } from './app-session';

export interface DomainEntry {
  name: string;
  verified_date: Date | null;
}

export type emailFilterOptions = 'with_email' | 'without_email' | null;

export interface DatahubClient {
  getAccountDomains(): Promise<DomainEntry[]>;
  getVisitsByPeriod(query: {
    domainName: number;
    dateFrom: Date;
    emailFilter: emailFilterOptions;
  }): Promise<number>;
  getPagesRankingByPeriod(query: {
    domainName: number;
    dateFrom: Date;
  }): Promise<{ name: string; totalVisits: number }[]>;
}

export class HttpDatahubClient implements DatahubClient {
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

  public async getAccountDomains(): Promise<DomainEntry[]> {
    const response = await this.customerGet<{ items: any[] }>('domains');
    return response.data.items
      .filter((x) => x.enabled)
      .map((x) => ({
        name: x.domainName,
        verified_date: (x.lastNavigationEventTime && new Date(x.lastNavigationEventTime)) || null,
      }));
  }

  public async getVisitsByPeriod({
    domainName,
    dateFrom,
    emailFilter,
  }: {
    domainName: number;
    dateFrom: Date;
    emailFilter: emailFilterOptions;
  }): Promise<number> {
    const response = await this.customerGet<{ visitors_quantity: number }>(
      `domains/${domainName}/visitors/quantity`,
      {
        startDate: dateFrom.toISOString(),
        emailFilterBy: emailFilter,
      },
    );
    return response.data.visitors_quantity;
  }

  public async getPagesRankingByPeriod({
    domainName,
    dateFrom,
  }: {
    domainName: number;
    dateFrom: Date;
  }): Promise<{ name: string; totalVisits: number }[]> {
    const response = await this.customerGet<{ items: { page: string; count: number }[] }>(
      `domains/${domainName}/events/summarized-by-page`,
      {
        startDate: dateFrom.toISOString(),
      },
    );
    return response.data.items.map((x) => ({ name: x.page, totalVisits: x.count }));
  }
}
