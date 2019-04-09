import { AxiosInstance, AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { DatahubConnectionData } from './app-session';

interface PageEntry {
  id: number;
  name: string;
}

interface DomainEntry {
  id: number;
  name: string;
  verified_date: Date;
}

export interface DatahubClient {
  // See: https://github.com/MakingSense/Customer-Data-Hub/blob/0f28f0906b22198622f71867e1cdaf00abd41af1/apisec/swaggerDef.js#L74
  getAccountDomains(): Promise<DomainEntry[]>;
  // TODO: verify what Datahub's service exposes this information, is it based in domain id or domain name?
  getPagesByDomainId(domainId: number): Promise<PageEntry[]>;
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

  public async getPagesByDomainId(domainId: number): Promise<PageEntry[]> {
    console.log('getPagesByDomainId', { domainId });
    const domain = fakeData.find((x) => x.id === domainId);
    if (!domain) {
      throw new Error(`Domain with id ${domainId} does not exist`);
    }
    return domain.pages;
  }
}
