import { DatahubClient } from './datahub-client';
import { timeout } from '../utils';

// TODO: use more realistic data
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

export class HardcodedDatahubClient implements DatahubClient {
  public async getAccountDomains() {
    console.log('getAccountDomains');
    await timeout(1500);
    return fakeData.map((x) => ({ id: x.id, name: x.name, verified_date: x.verified_date }));
  }

  public async getVisitsByPeriod({
    domainName,
    dateFrom,
    isVisitsWithEmail,
  }: {
    domainName: number;
    dateFrom: Date;
    isVisitsWithEmail: boolean;
  }) {
    console.log('getVisitsByPeriod', { domainName, dateFrom, isVisitsWithEmail });
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
  }) {
    console.log('getPagesRankingByPeriod', { domainName, dateFrom });
    await timeout(1500);
    return fakePagesData.map((x) => ({ name: x.name, totalVisits: x.totalVisits }));
  }
}
