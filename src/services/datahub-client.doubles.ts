import {
  DatahubClient,
  emailFilterOptions,
  DomainsResult,
  PageRankingResult,
  VisitorsResult,
  TrafficSourceResult,
  VisitsQuantitySummarizedByDayResult,
  VisitsQuantitySummarizedByWeekAndHourResult,
} from './datahub-client';
import { timeout } from '../utils';

const domains = [
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

const fakePagesData = [
  {
    name: '/email-marketing',
    qVisits: 10122,
    qVisitsWithEmail: 400,
  },
  {
    name: '/precios',
    qVisits: 9000,
    qVisitsWithEmail: 300,
  },
  {
    name: '/login',
    qVisits: 5001,
    qVisitsWithEmail: 900,
  },
  {
    name: '/productos',
    qVisits: 3800,
    qVisitsWithEmail: 1000,
  },
  {
    name: '/servicios',
    qVisits: 1023,
    qVisitsWithEmail: 500,
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
    periods: [
      {
        from: '2018-10-10T03:00:00.000Z',
        to: '2018-10-11T03:00:00.000Z',
      },
    ],
    qVisitors: 20,
    qVisitorsWithEmail: 3,
    qVisits: 30,
    qVisitsWithEmail: 10,
  },
  {
    periods: [
      {
        from: '2018-10-11T03:00:00.000Z',
        to: '2018-10-12T03:00:00.000Z',
      },
    ],
    qVisitors: 40,
    qVisitorsWithEmail: 10,
    qVisits: 50,
    qVisitsWithEmail: 20,
  },
  {
    periods: [
      {
        from: '2018-10-12T03:00:00.000Z',
        to: '2018-10-13T03:00:00.000Z',
      },
    ],
    qVisitors: 70,
    qVisitorsWithEmail: 2,
    qVisits: 100,
    qVisitsWithEmail: 10,
  },
  {
    periods: [
      {
        from: '2018-10-13T03:00:00.000Z',
        to: '2018-10-14T03:00:00.000Z',
      },
    ],
    qVisitors: 80,
    qVisitorsWithEmail: 40,
    qVisits: 120,
    qVisitsWithEmail: 40,
  },
];

const getFakeVisitsWeekdayHoursData = () => {
  let date = new Date(1970, 1, 1);
  return [...Array(168)].map((index) => {
    date.setHours(date.getHours() + 1);
    return {
      periods: [
        {
          from: date.toString(),
          to: date.toString(),
        },
      ],
      qVisitors: Math.floor(Math.random() * 1000),
      qVisitorsWithEmail: 1,
      qVisits: Math.floor(Math.random() * 1000 + 1000),
      qVisitsWithEmail: Math.floor(Math.random() * 100),
    };
  });
};

export class HardcodedDatahubClient implements DatahubClient {
  public async getAccountDomains(): Promise<DomainsResult> {
    console.log('getAccountDomains');
    await timeout(1500);
    const data = domains.map((x) => ({ name: x.name, verified_date: x.verified_date }));
    return {
      success: true,
      value: data,
    };

    //return {
    //  success: false,
    //  error: new Error('Dummy error'),
    //};
  }

  public async getTotalVisitsOfPeriod({
    domainName,
    dateFrom,
    dateTo,
    emailFilter,
  }: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
    emailFilter: emailFilterOptions;
  }): Promise<VisitorsResult> {
    console.log('getTotalVisitsOfPeriod', { domainName, dateFrom, emailFilter, dateTo });
    await timeout(1500);

    const visitors = Math.round(Math.random() * (100 - 50) + 1);
    const visitorsWithEmail = Math.round(Math.random() * (50 - 1) + 1);

    return {
      success: true,
      value: { qVisitors: visitors, qVisitorsWithEmail: visitorsWithEmail },
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
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
    console.log('getPagesRankingByPeriod', { domainName, dateFrom, dateTo, pageSize, pageNumber });
    await timeout(1500);
    const pages = fakePagesData.map((x) => ({
      name: x.name,
      totalVisits: x.qVisits,
      url: `http://${domainName}${x.name}`,
      visitsWithEmail: x.qVisitsWithEmail,
    }));

    let pagesSubArray = [];
    let hasMorePages = false;

    if (pageSize) {
      const indexStart = pageSize * (pageNumber - 1);
      const indexEnd = indexStart + pageSize;
      pagesSubArray = pages.slice(indexStart, indexEnd);
      hasMorePages = indexEnd < pages.length;
    } else {
      pagesSubArray = pages;
    }

    return {
      success: true,
      value: {
        hasMorePages: hasMorePages,
        pages: pagesSubArray,
      },
    };

    // return {
    //   success: false,
    //   error: new Error('Dummy error'),
    // };
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
    console.log('getTrafficSourcesByPeriodOld', { domainName, dateFrom, dateTo });
    await timeout(1000);
    const trafficSources = fakeTrafficSourcesData.map((x) => ({
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
  }): Promise<VisitsQuantitySummarizedByDayResult> {
    console.log('getVisitsQuantitySummarizedByDay', { domainName, dateFrom, dateTo });
    await timeout(1000);

    const data = fakeDailyVisitsData;

    const visitsByPeriod = data.map((x) => ({
      from: new Date(x.periods[0].from),
      to: new Date(x.periods[0].to),
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

  public async getVisitsQuantitySummarizedByWeekdayAndHour({
    domainName,
    dateFrom,
    dateTo,
  }: {
    domainName: string;
    dateFrom: Date;
    dateTo: Date;
  }): Promise<VisitsQuantitySummarizedByWeekAndHourResult> {
    console.log('getVisitsQuantitySummarizedByWeekdayAndHour', { domainName, dateFrom, dateTo });
    await timeout(1000);

    const data = getFakeVisitsWeekdayHoursData();

    const visits = data.map((x) => ({
      weekday: new Date(x.periods[0].from).getDay(),
      hour: new Date(x.periods[0].to).getHours(),
      qVisitors: x.qVisitors,
      qVisitorsWithEmail: x.qVisitorsWithEmail,
      qVisitorsWithOutEmail: x.qVisitors - x.qVisitorsWithEmail,
      qVisits: x.qVisits,
      qVisitsWithEmail: x.qVisitsWithEmail,
    }));

    return {
      success: true,
      value: visits,
    };

    //return {
    //  success: false,
    //  error: new Error('Dummy error'),
    //};
  }
}
