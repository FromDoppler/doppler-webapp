import { AxiosInstance, AxiosStatic, AxiosPromise } from 'axios';
import { RefObject } from 'react';
import { AppSession, DatahubConnectionData } from './app-session';
import { ResultWithoutExpectedErrors } from '../doppler-types';

export interface DomainEntry {
  name: string;
  verified_date: Date | null;
}

export interface Page {
  name: string;
  totalVisitors: number;
  url: string;
  withEmail: number;
}

export interface TrafficSource {
  sourceName: string;
  quantity: number;
  withEmail: number;
}

export interface VisitsQuantitySummarized {
  periodNumber: number;
  from: Date;
  to: Date;
  quantity: number;
  withEmail: number;
  withoutEmail: number;
}

export type emailFilterOptions = 'with_email' | 'without_email' | null;

export type filterByPeriodOptions = 'days' | 'hours';

export interface DatahubClient {
  getAccountDomains(): Promise<DomainEntry[]>;
  getTotalVisitsOfPeriod(query: {
    domainName: number;
    dateFrom: Date;
    emailFilter?: emailFilterOptions;
  }): Promise<number>;
  getPagesRankingByPeriod(query: {
    domainName: string;
    dateFrom: Date;
    pageSize: number;
    pageNumber: number;
  }): Promise<PageRankingResult>;
  getTrafficSourcesByPeriod(query: {
    domainName: string;
    dateFrom: Date;
  }): Promise<TrafficSourceResult>;
  getVisitsQuantitySummarizedByPeriod(query: {
    domainName: string;
    dateFrom: Date;
    periodBy: filterByPeriodOptions;
  }): Promise<VisitsQuantitySummarizedResult>;
}

export type TrafficSourceResult = ResultWithoutExpectedErrors<TrafficSource[]>;

export type VisitsQuantitySummarizedResult = ResultWithoutExpectedErrors<
  VisitsQuantitySummarized[]
>;

export type PageRankingResult = ResultWithoutExpectedErrors<Page[]>;

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

  public async getTotalVisitsOfPeriod({
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
    pageSize,
    pageNumber,
  }: {
    domainName: string;
    dateFrom: Date;
    pageSize: number;
    pageNumber: number;
  }): Promise<PageRankingResult> {
    try {
      const response = await this.customerGet<any>(
        `domains/${domainName}/events/summarized-by-page`,
        {
          startDate: dateFrom.toISOString(),
          sortBy: 'visitors',
          pageSize: pageSize || 0,
          pageNumber: pageNumber || 0,
        },
      );

      // By the moment we are hard-coding it because DataHub does not have this
      // information. I am looking you Leo :P
      const urlSchema = response.data.protocol || 'http://';

      const pages = response.data.items.map((x: any) => ({
        name: x.page,
        totalVisitors: x.visitorsQuantity,
        url: `${urlSchema}${domainName}${x.page}`,
        withEmail: x.withEmail,
      }));

      return {
        success: true,
        value: pages,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  public async getTrafficSourcesByPeriod({
    domainName,
    dateFrom,
  }: {
    domainName: string;
    dateFrom: Date;
  }): Promise<TrafficSourceResult> {
    try {
      const response = await this.customerGet<{ items: TrafficSource[] }>(
        `domains/${domainName}/events/summarized-by-source`,
        {
          startDate: dateFrom.toISOString(),
        },
      );

      const trafficSources = response.data.items.map((x) => ({
        sourceName: x.sourceName,
        quantity: x.quantity,
        withEmail: x.withEmail,
      }));

      return {
        success: true,
        value: trafficSources,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  public async getVisitsQuantitySummarizedByPeriod({
    domainName,
    dateFrom,
    dateTo,
    periodBy,
  }: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
    periodBy: filterByPeriodOptions;
  }): Promise<VisitsQuantitySummarizedResult> {
    try {
      const response = await this.customerGet<any>(
        `domains/${domainName}/events/quantity-summarized-by-period`,
        {
          startDate: dateFrom.toISOString(),
          endDate: dateTo.toISOString(),
          periodBy: periodBy,
          uniqueVisites: true,
        },
      );

      const visitsByPeriod = response.data.periods.map((x: any) => ({
        periodNumber: x.periodNumber,
        from: new Date(x.from),
        to: new Date(x.to),
        quantity: x.quantity,
        withEmail: x.withEmail,
        withoutEmail: x.withEmail !== undefined ? x.quantity - x.withEmail : x.withEmail,
      }));

      return {
        success: true,
        value: visitsByPeriod,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }
}
