import {
  DatahubClient,
  emailFilterOptions,
  DomainEntry,
  TrafficSourceResult,
} from './datahub-client';
import { timeout } from '../utils';

// TODO: use more realistic data
const fakeData = [
  {
    name: 'www.fromdoppler.com',
    verified_date: new Date('2017-12-17'),
    pages: [],
  },
  {
    name: 'www.makingsense.com',
    verified_date: new Date('2010-12-17'),
    pages: [],
  },
  {
    name: 'www.google.com',
    verified_date: new Date('2017-12-17'),
    pages: [],
  },
];

const fakePagesData = [
  {
    name: '/email-marketing',
    totalVisitors: 10122,
  },
  {
    name: '/precios',
    totalVisitors: 9000,
  },
  {
    name: '/login',
    totalVisitors: 5001,
  },
  {
    name: '/productos',
    totalVisitors: 3800,
  },
  {
    name: '/servicios',
    totalVisitors: 1023,
  },
];

const fakeTrafficSourcesData = [
  {
    sourceName: 'Email',
    quantity: 2000,
  },
  {
    sourceName: 'Social',
    quantity: 1000,
  },
  {
    sourceName: 'Paid',
    quantity: 250,
  },
  {
    sourceName: 'Organic',
    quantity: 100,
  },
  {
    sourceName: 'Referal',
    quantity: 50,
  },
  {
    sourceName: 'Direct',
    quantity: 100,
  },
];

export class HardcodedDatahubClient implements DatahubClient {
  public async getAccountDomains(): Promise<DomainEntry[]> {
    console.log('getAccountDomains');
    await timeout(1500);
    return fakeData.map((x) => ({ name: x.name, verified_date: x.verified_date }));
    // return [];
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
    await timeout(1500);
    const visits = Math.round(Math.random() * (100 - 1) + 1);
    return visits;
  }

  public async getPagesRankingByPeriod({
    domainName,
    dateFrom,
  }: {
    domainName: number;
    dateFrom: Date;
  }): Promise<{ name: string; totalVisitors: number; url: string }[]> {
    console.log('getPagesRankingByPeriod', { domainName, dateFrom });
    await timeout(1500);
    return fakePagesData.map((x) => ({
      name: x.name,
      totalVisitors: x.totalVisitors,
      url: `http://${domainName}${x.name}`,
    }));
  }

  public async getTrafficSourcesByPeriod({
    domainName,
    dateFrom,
  }: {
    domainName: string;
    dateFrom: Date;
  }): Promise<TrafficSourceResult> {
    console.log('getTrafficSourcesByPeriod', { domainName, dateFrom });
    await timeout(1000);
    const trafficSources = fakeTrafficSourcesData.map((x) => ({
      sourceName: x.sourceName,
      quantity: x.quantity,
    }));

    return {
      success: true,
      value: trafficSources,
    };

    //return {
    //  success: false,
    //  error: new Error('Dummy error'),
    //};
  }
}
