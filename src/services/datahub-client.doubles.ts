import {
  DatahubClient,
  emailFilterOptions,
  DomainEntry,
  TrafficSourceResult,
  VisitsQuantitySummarizedResult,
  PageRankingResult,
  filterByPeriodOptions,
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
    withEmail: 400,
  },
  {
    name: '/precios',
    totalVisitors: 9000,
    withEmail: 300,
  },
  {
    name: '/login',
    totalVisitors: 5001,
    withEmail: 900,
  },
  {
    name: '/productos',
    totalVisitors: 3800,
    withEmail: 1000,
  },
  {
    name: '/servicios',
    totalVisitors: 1023,
    withEmail: 500,
  },
];

const fakeTrafficSourcesData = [
  {
    sourceName: 'Email',
    quantity: 2000,
    withEmail: 500,
  },
  {
    sourceName: 'Social',
    quantity: 1000,
    withEmail: 800,
  },
  {
    sourceName: 'Paid',
    quantity: 250,
    withEmail: 50,
  },
  {
    sourceName: 'Organic',
    quantity: 100,
    withEmail: 10,
  },
  {
    sourceName: 'Referral',
    quantity: 50,
    withEmail: 40,
  },
  {
    sourceName: 'Direct',
    quantity: 100,
    withEmail: 0,
  },
];

const fakeDailyVisitsData = [
  {
    periodNumber: 0,
    from: '2018-10-10T03:00:00.000Z',
    to: '2018-10-11T03:00:00.000Z',
    quantity: 20,
    withEmail: 3,
  },
  {
    periodNumber: 1,
    from: '2018-10-11T03:00:00.000Z',
    to: '2018-10-12T03:00:00.000Z',
    quantity: 40,
    withEmail: 10,
  },
  {
    periodNumber: 2,
    from: '2018-10-12T03:00:00.000Z',
    to: '2018-10-13T03:00:00.000Z',
    quantity: 70,
    withEmail: 2,
  },
  {
    periodNumber: 3,
    from: '2018-10-13T03:00:00.000Z',
    to: '2018-10-14T03:00:00.000Z',
    quantity: 80,
    withEmail: 40,
  },
];

const getFakeHoursVisitsData = () => {
  let date = new Date(1970, 1, 1);
  return [...Array(168)].map((index) => {
    date.setHours(date.getHours() + 1);
    return {
      periodNumber: index,
      from: date.toString(),
      to: date.toString(),
      quantity: Math.floor(Math.random() * 1000),
      withEmail: 1,
    };
  });
};

export class HardcodedDatahubClient implements DatahubClient {
  public async getAccountDomains(): Promise<DomainEntry[]> {
    console.log('getAccountDomains');
    await timeout(1500);
    return fakeData.map((x) => ({ name: x.name, verified_date: x.verified_date }));
    // return [];
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
    console.log('getTotalVisitsOfPeriod', { domainName, dateFrom, emailFilter });
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
  }): Promise<PageRankingResult> {
    console.log('getPagesRankingByPeriod', { domainName, dateFrom });
    await timeout(1500);
    const pages = fakePagesData.map((x) => ({
      name: x.name,
      totalVisitors: x.totalVisitors,
      url: `http://${domainName}${x.name}`,
      withEmail: x.withEmail,
    }));

    return {
      success: true,
      value: pages,
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
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
      withEmail: x.withEmail,
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

  public async getVisitsQuantitySummarizedByPeriod({
    domainName,
    dateFrom,
    periodBy,
  }: {
    domainName: string;
    dateFrom: Date;
    periodBy: filterByPeriodOptions;
  }): Promise<VisitsQuantitySummarizedResult> {
    console.log('getVisitsQuantitySummarizedByPeriod', { domainName, dateFrom });
    await timeout(1000);

    const data = periodBy === 'days' ? fakeDailyVisitsData : getFakeHoursVisitsData();

    const visitsByPeriod = data.map((x) => ({
      periodNumber: x.periodNumber,
      from: new Date(x.from),
      to: new Date(x.to),
      quantity: x.quantity,
      withEmail: x.withEmail,
      withoutEmail: x.quantity - x.withEmail,
    }));

    return {
      success: true,
      value: visitsByPeriod,
    };

    //return {
    //  success: false,
    //  error: new Error('Dummy error'),
    //};
  }
}
