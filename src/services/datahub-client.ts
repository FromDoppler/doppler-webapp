import { AxiosInstance, AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { DatahubConnectionData } from './app-session';

interface DomainEntry {
  id: number;
  name: string;
  verified_date: Date;
}

export interface DatahubClient {
  // See: https://github.com/MakingSense/Customer-Data-Hub/blob/0f28f0906b22198622f71867e1cdaf00abd41af1/apisec/swaggerDef.js#L74
  getAccountDomains(): Promise<DomainEntry[]>;
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
}
