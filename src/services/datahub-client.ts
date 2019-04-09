import { AxiosInstance, AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { DatahubConnectionData } from './app-session';

export interface DomainEntry {
  id: number;
  name: string;
  verified_date: Date;
}

export type emailFilterOptions = 'with_email' | 'without_email' | null;

export interface DatahubClient {
  // See: https://github.com/MakingSense/Customer-Data-Hub/blob/0f28f0906b22198622f71867e1cdaf00abd41af1/apisec/swaggerDef.js#L74
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

const fakeData = [
  {
    id: 1,
    name: 'www.fromdoppler.com',
    verified_date: new Date('2017-12-17'),
    pages: [],
  },
  {
    id: 2,
    name: 'www.makingsense.com',
    verified_date: new Date('2010-12-17'),
    pages: [],
  },
  {
    id: 3,
    name: 'www.google.com',
    verified_date: new Date('2017-12-17'),
    pages: [],
  },
];

const fakePagesData = [
  {
    name: 'https://www.fromdoppler.com/email-marketing',
    totalVisits: 10122,
  },
  {
    name: 'https://www.fromdoppler.com/precios',
    totalVisits: 9000,
  },
  {
    name: 'https://www.fromdoppler.com/login',
    totalVisits: 5001,
  },
  {
    name: 'https://www.fromdoppler.com/productos',
    totalVisits: 3800,
  },
  {
    name: 'https://www.fromdoppler.com/servicios',
    totalVisits: 1023,
  },
];

export class HttpDatahubClient implements DatahubClient {
  private readonly axios: AxiosInstance;
  private readonly baseUrl: string;
  private readonly connectionDataRef: RefObject<DatahubConnectionData>;

  constructor({
    axiosStatic,
    baseUrl,
    connectionDataRef,
  }: {
    axiosStatic: AxiosStatic;
    baseUrl: string;
    connectionDataRef: RefObject<DatahubConnectionData>;
  }) {
    this.baseUrl = baseUrl;
    this.axios = axiosStatic.create({
      baseURL: baseUrl,
      withCredentials: true,
    });
    this.connectionDataRef = connectionDataRef;
  }

  // TODO: implement this class
  public async getAccountDomains(): Promise<DomainEntry[]> {
    console.log('getAccountDomains');
    return fakeData.map((x) => ({ id: x.id, name: x.name, verified_date: x.verified_date }));
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
    console.log('getVisitsByPeriod', { domainName, dateFrom, emailFilter });
    const visits = Math.round(Math.random() * (100 - 1) + 1);
    return visits;
  }

  public async getPagesRankingByPeriod({
    domainName,
    dateFrom,
  }: {
    domainName: number;
    dateFrom: Date;
  }): Promise<{ name: string; totalVisits: number }[]> {
    console.log('getPagesRankingByPeriod', { domainName, dateFrom });
    return fakePagesData.map((x) => ({ name: x.name, totalVisits: x.totalVisits }));
  }
}
