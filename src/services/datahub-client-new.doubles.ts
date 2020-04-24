import {
  DatahubClientNew,
  emailFilterOptions,
  DomainEntry,
  TrafficSourceResult,
  VisitsQuantitySummarizedResult,
} from './datahub-client-new';
import { timeout } from '../utils';

// TODO: use more realistic data
const fakeData = [
  {
    name: 'www.fromdoppler.com',
    verified_date: new Date('2010-12-17'),
    pages: [],
  },
  {
    name: 'www.makingsense.com',
    verified_date: null,
    pages: [],
  },
  {
    name: 'www.google.com',
    verified_date: new Date('2017-12-17'),
    pages: [],
  },
];

const fakeTrafficSourcesData = [
  {
    sourceType: 'Email',
    qVisits: 2000,
    qVisitsWithEmail: 500,
    qVisitors: 1000,
    qVisitorsWithEmail: 200,
  },
  {
    sourceType: 'Social',
    qVisits: 1000,
    qVisitsWithEmail: 800,
    qVisitors: 500,
    qVisitorsWithEmail: 100,
  },
  {
    sourceType: 'Paid',
    qVisits: 250,
    qVisitsWithEmail: 50,
    qVisitors: 100,
    qVisitorsWithEmail: 30,
  },
  {
    sourceType: 'Organic',
    qVisits: 100,
    qVisitsWithEmail: 10,
    qVisitors: 60,
    qVisitorsWithEmail: 20,
  },
  {
    sourceType: 'Referral',
    qVisits: 50,
    qVisitsWithEmail: 40,
    qVisitors: 40,
    qVisitorsWithEmail: 28,
  },
  {
    sourceType: 'Direct',
    qVisits: 100,
    qVisitsWithEmail: 0,
    qVisitors: 65,
    qVisitorsWithEmail: 0,
  },
];

const fakeDailyVisitsData = [
  {
    periodNumber: 0,
    from: '2018-10-10T03:00:00.000Z',
    to: '2018-10-11T03:00:00.000Z',
    qVisitors: 20,
    qVisitorsWithEmail: 3,
    qVisits: 30,
    qVisitsWithEmail: 10,
  },
  {
    periodNumber: 1,
    from: '2018-10-11T03:00:00.000Z',
    to: '2018-10-12T03:00:00.000Z',
    qVisitors: 40,
    qVisitorsWithEmail: 10,
    qVisits: 50,
    qVisitsWithEmail: 20,
  },
  {
    periodNumber: 2,
    from: '2018-10-12T03:00:00.000Z',
    to: '2018-10-13T03:00:00.000Z',
    qVisitors: 70,
    qVisitorsWithEmail: 2,
    qVisits: 100,
    qVisitsWithEmail: 10,
  },
  {
    periodNumber: 3,
    from: '2018-10-13T03:00:00.000Z',
    to: '2018-10-14T03:00:00.000Z',
    qVisitors: 80,
    qVisitorsWithEmail: 40,
    qVisits: 120,
    qVisitsWithEmail: 40,
  },
];

export class HardcodedDatahubClientNew implements DatahubClientNew {
  public async getAccountDomains(): Promise<DomainEntry[]> {
    console.log('getAccountDomains');
    await timeout(1500);
    return fakeData.map((x) => ({ name: x.name, verified_date: x.verified_date }));
    // return [];
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
    console.log('getTotalVisitsOfPeriod', { domainName, dateFrom, emailFilter, dateTo });
    await timeout(1500);
    const visits = Math.round(Math.random() * (100 - 1) + 1);
    return visits;
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
    console.log('getTrafficSourcesByPeriod', { domainName, dateFrom, dateTo });
    await timeout(1000);
    const trafficSources = fakeTrafficSourcesData.map((x) => ({
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

    //return {
    //  success: false,
    //  error: new Error('Dummy error'),
    //};
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
    console.log('getVisitsQuantitySummarizedByPeriod', { domainName, dateFrom, dateTo });
    await timeout(1000);

    const data = fakeDailyVisitsData;

    const visitsByPeriod = data.map((x) => ({
      periodNumber: x.periodNumber,
      from: new Date(x.from),
      to: new Date(x.to),
      qVisitors: x.qVisitors,
      qVisitorsWithEmail: x.qVisitorsWithEmail,
      qVisitorsWithOutEmail: x.qVisitors - x.qVisitorsWithEmail,
      qVisits: x.qVisits,
      qVisitsWithEmail: x.qVisitsWithEmail,
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
