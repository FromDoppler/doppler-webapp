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

export interface PageRanking {
  hasMorePages: boolean;
  pages: Page[];
}

export interface TrafficSourceOld {
  sourceName: string;
  quantity: number;
  withEmail: number;
}

export interface TrafficSource {
  sourceType: string;
  qVisits: number;
  qVisitsWithEmail: number;
  qVisitors: number;
  qVisitorsWithEmail: number;
}

export interface VisitsQuantitySummarized {
  periodNumber: number;
  from: Date;
  to: Date;
  quantity: number;
  withEmail: number;
  withoutEmail: number;
}

export interface Visitors {
  qVisitors: number;
  qVisitorsWithEmail: number;
}

export type emailFilterOptions = 'with_email' | 'without_email' | null;

export type filterByPeriodOptions = 'days' | 'hours';

export interface DatahubClient {
  getAccountDomains(): Promise<DomainsResult>;
  getTotalVisitsOfPeriodOld(query: {
    domainName: number;
    dateFrom: Date;
    dateTo: Date;
    emailFilter?: emailFilterOptions;
  }): Promise<number>;
  getTotalVisitsOfPeriod(query: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
  }): Promise<VisitorsResult>;
  getPagesRankingByPeriod(query: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
    pageSize: number;
    pageNumber: number;
  }): Promise<PageRankingResult>;
  getTrafficSourcesByPeriodOld(query: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
  }): Promise<TrafficSourceResultOld>;
  getTrafficSourcesByPeriod(query: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
  }): Promise<TrafficSourceResult>;
  getVisitsQuantitySummarizedByPeriod(query: {
    domainName: string;
    dateFrom: Date;
    periodBy: filterByPeriodOptions;
  }): Promise<VisitsQuantitySummarizedResult>;
}

export type VisitorsResult = ResultWithoutExpectedErrors<Visitors>;

export type DomainsResult = ResultWithoutExpectedErrors<DomainEntry[]>;

export type TrafficSourceResultOld = ResultWithoutExpectedErrors<TrafficSourceOld[]>;

export type TrafficSourceResult = ResultWithoutExpectedErrors<TrafficSource[]>;

export type VisitsQuantitySummarizedResult = ResultWithoutExpectedErrors<
  VisitsQuantitySummarized[]
>;

export type PageRankingResult = ResultWithoutExpectedErrors<PageRanking>;

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
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  public async getTotalVisitsOfPeriodOld({
    domainName,
    dateFrom,
    dateTo,
    emailFilter,
  }: {
    domainName: number;
    dateFrom: Date;
    emailFilter: emailFilterOptions;
    dateTo: Date;
  }): Promise<number> {
    const response = await this.customerGet<{ visitors_quantity: number }>(
      `domains/${domainName}/visitors/quantity`,
      {
        startDate: dateFrom.toISOString(),
        endDate: dateTo.toISOString(),
        emailFilterBy: emailFilter,
      },
    );
    return response.data.visitors_quantity;
  }

  public async getTotalVisitsOfPeriod({
    domainName,
    dateFrom,
    dateTo,
  }: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
  }): Promise<VisitorsResult> {
    try {
      const response = await this.customerGet<any>(`domains/${domainName}/visitors/summarization`, {
        startDate: dateFrom.toISOString(),
        endDate: dateTo.toISOString(),
      });
      return {
        success: true,
        value: {
          qVisitors: response.data.qVisitors,
          qVisitorsWithEmail: response.data.qVisitorsWithEmail,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  public async getPagesRankingByPeriod({
    domainName,
    dateFrom,
    dateTo,
    pageSize,
    pageNumber,
  }: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
    pageSize: number;
    pageNumber: number;
  }): Promise<PageRankingResult> {
    try {
      const response = await this.customerGet<any>(
        `domains/${domainName}/events/summarized-by-page`,
        {
          startDate: dateFrom.toISOString(),
          endDate: dateTo.toISOString(),
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
        value: {
          hasMorePages: response.data.hasMorePages,
          pages: pages,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error,
      };
    }
  }

  public async getTrafficSourcesByPeriodOld({
    domainName,
    dateFrom,
    dateTo,
  }: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
  }): Promise<TrafficSourceResultOld> {
    try {
      const response = await this.customerGet<{ items: TrafficSourceOld[] }>(
        `domains/${domainName}/events/summarized-by-source`,
        {
          startDate: dateFrom.toISOString(),
          endDate: dateTo.toISOString(),
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

  public async getTrafficSourcesByPeriod({
    domainName,
    dateFrom,
    dateTo,
  }: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
  }): Promise<TrafficSourceResult> {
    try {
      const response = await this.customerGet<{ items: TrafficSource[] }>(
        `domains/${domainName}/events/summarized-by-source-type`,
        {
          startDate: dateFrom.toISOString(),
          endDate: dateTo.toISOString(),
        },
      );

      const trafficSources = response.data.items.map((x) => ({
        sourceType: x.sourceType,
        qVisitors: x.qVisitors,
        qVisitorsWithEmail: x.qVisitorsWithEmail,
        qVisitsWithEmail: x.qVisitsWithEmail,
        qVisits: x.qVisits,
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
