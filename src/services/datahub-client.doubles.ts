import { DatahubClient, emailFilterOptions, DomainEntry } from './datahub-client';
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
    totalVisits: 10122,
  },
  {
    name: '/precios',
    totalVisits: 9000,
  },
  {
    name: '/login',
    totalVisits: 5001,
  },
  {
    name: '/productos',
    totalVisits: 3800,
  },
  {
    name: '/servicios',
    totalVisits: 1023,
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
  }): Promise<{ name: string; totalVisits: number; url: string }[]> {
    console.log('getPagesRankingByPeriod', { domainName, dateFrom });
    await timeout(1500);
    return fakePagesData.map((x) => ({
      name: x.name,
      totalVisits: x.totalVisits,
      url: `http://${domainName}${x.name}`,
    }));
  }
}
