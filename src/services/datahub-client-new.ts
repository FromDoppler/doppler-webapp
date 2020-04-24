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
  qVisits: number;
  qVisitsWithEmail: number;
  qVisitors: number;
  qVisitorsWithEmail: number;
  qVisitorsWithOutEmail: number;
}

export type emailFilterOptions = 'with_email' | 'without_email' | null;

export type filterByPeriodOptions = 'days' | 'hours';

export interface DatahubClientNew {
  getAccountDomains(): Promise<DomainEntry[]>;
  getTotalVisitsOfPeriod(query: {
    domainName: number;
    dateFrom: Date;
    dateTo: Date;
    emailFilter?: emailFilterOptions;
  }): Promise<number>;
  getTrafficSourcesByPeriod(query: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
  }): Promise<TrafficSourceResult>;
  getVisitsQuantitySummarizedByDay(query: {
    domainName: string;
    dateFrom: Date;
  }): Promise<VisitsQuantitySummarizedResult>;
}

export type TrafficSourceResult = ResultWithoutExpectedErrors<TrafficSource[]>;

export type VisitsQuantitySummarizedResult = ResultWithoutExpectedErrors<
  VisitsQuantitySummarized[]
>;

export type PageRankingResult = ResultWithoutExpectedErrors<PageRanking>;

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
    dateTo,
    emailFilter,
  }: {
    domainName: number;
    dateFrom: Date;
    dateTo: Date;
    emailFilter: emailFilterOptions;
  }): Promise<number> {
    const response = await this.customerGet<{ qVisitorsWithEmail: number; qVisitors: number }>(
      `domains/${domainName}/visitors/summarization`,
      {
        startDate: dateFrom.toISOString(),
        endDate: dateTo.toISOString(),
      },
    );
    const visitors_quantity =
      emailFilter === 'with_email' ? response.data.qVisitorsWithEmail : response.data.qVisitors;
    return visitors_quantity;
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
        `domains/${domainName}/events/summarized-by-type`,
        {
          startDate: dateFrom.toISOString(),
          endDate: dateTo.toISOString(),
        },
      );

      const trafficSources = response.data.items.map((x) => ({
        sourceType: x.sourceType,
        qVisits: x.qVisits,
        qVisitsWithEmail: x.qVisitsWithEmail,
        qVisitors: x.qVisitors,
        qVisitorsWithEmail: x.qVisitorsWithEmail,
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

  public async getVisitsQuantitySummarizedByDay({
    domainName,
    dateFrom,
    dateTo,
  }: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
  }): Promise<VisitsQuantitySummarizedResult> {
    try {
      const response = await this.customerGet<any>(
        `domains/${domainName}/events/summarized-by-day`,
        {
          startDate: dateFrom.toISOString(),
          endDate: dateTo.toISOString(),
        },
      );

      const visitsByPeriod = response.data.periods.map((x: any) => ({
        periodNumber: x.periodNumber,
        from: new Date(x.from),
        to: new Date(x.to),
        qVisitors: x.qVisitors,
        qVisitorsWithEmail: x.qVisitorsWithEmail,
        qVisitorsWithOutEmail:
          x.qVisitorsWithEmail !== undefined
            ? x.qVisitors - x.qVisitorsWithEmail
            : x.qVisitorsWithEmail,
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
