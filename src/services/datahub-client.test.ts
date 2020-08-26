import { AxiosStatic } from 'axios';
import { HttpDatahubClient } from './datahub-client';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';

function createHttpDataHubClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const connectionDataRef = {
    current: {
      status: 'authenticated',
      jwtToken: 'jwtToken',
      datahubCustomerId: 'dataHubCustomerId',
      userData: {} as DopplerLegacyUserData,
    },
  } as RefObject<AppSession>;
  const baseUrl = 'http://datahub.test';
  const dataHubClient = new HttpDatahubClient({ axiosStatic, baseUrl, connectionDataRef });
  return dataHubClient;
}

const emptyCommonResponse = {
  data: {
    items: [],
  },
};

const fullTrafficSourceResponse = {
  data: {
    items: [
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
    ],
  },
};

const emptyDailyVisitsResponse = {
  data: {
    periods: [],
  },
};

const fullDailyResponse = {
  data: {
    items: [
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
    ],
  },
};

const fullRankingByPeriodResponse = {
  data: {
    hasMorePages: true,
    items: [
      {
        page: '/email-marketing',
        qVisits: 10122,
        qVisitsWithEmail: 400,
      },
      {
        page: '/precios',
        qVisits: 9000,
        qVisitsWithEmail: 300,
      },
    ],
  },
};

describe('HttpDataHubClient', () => {
  describe('getAccountDomains', () => {
    it('should call datahub with the right url', async () => {
      // Arrange
      const request = jest.fn(async () => emptyCommonResponse);
      const dataHubClient = createHttpDataHubClient({ request });

      // Act
      await dataHubClient.getAccountDomains();

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/cdhapi/customers/dataHubCustomerId/domains',
        }),
      );
    });

    it('should call datahub and return error', async () => {
      // Arrange
      const request = jest.fn(async () => {});
      const dataHubClient = createHttpDataHubClient({ request });

      // Act
      const response = await dataHubClient.getAccountDomains();

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/cdhapi/customers/dataHubCustomerId/domains',
        }),
      );
      expect(response.success).toEqual(false);
    });

    it('should call datahub and return the enabled domains', async () => {
      // Arrange
      const domains = {
        data: {
          items: [
            {
              domainName: 'www.fromdoppler.com',
              lastNavigationEventTime: '2010-12-17',
              enabled: true,
            },
            {
              domainName: 'www.makingsense.com',
              verified_date: null,
              enabled: true,
            },
            {
              domainName: 'www.google.com',
              lastNavigationEventTime: '2017-12-17',
            },
          ],
        },
      };
      const request = jest.fn(async () => domains);
      const dataHubClient = createHttpDataHubClient({ request });

      // Act
      const response = await dataHubClient.getAccountDomains();

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/cdhapi/customers/dataHubCustomerId/domains',
        }),
      );
      expect(response.success).toEqual(true);
      expect(response.value).toEqual([
        {
          name: 'www.fromdoppler.com',
          verified_date: new Date('2010-12-17'),
        },
        {
          name: 'www.makingsense.com',
          verified_date: null,
        },
      ]);
    });
  });

  describe('getTotalVisitsOfPeriod', () => {
    it('should call datahub with the right url', async () => {
      // Arrange
      const request = jest.fn(async () => emptyCommonResponse);
      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-07');

      // Act
      await dataHubClient.getTotalVisitsOfPeriod({ domainName, dateFrom, dateTo });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-07T00:00:00.000Z',
          },
          url: '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/visitors/summarization',
        }),
      );
    });

    it('should call datahub and return correct data', async () => {
      // Arrange
      const request = jest.fn(async () => {
        return { data: { qVisitors: 10, qVisitorsWithEmail: 5 } };
      });
      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-07');

      // Act
      const response = await dataHubClient.getTotalVisitsOfPeriod({ domainName, dateFrom, dateTo });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-07T00:00:00.000Z',
          },
          url: '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/visitors/summarization',
        }),
      );
      expect(response).toEqual({
        success: true,
        value: { qVisitors: 10, qVisitorsWithEmail: 5 },
      });
    });
  });

  describe('getTrafficSourcesByPeriod', () => {
    it('should call datahub with the right url', async () => {
      // Arrange
      const request = jest.fn(async () => emptyCommonResponse);

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-07');

      // Act
      await dataHubClient.getTrafficSourcesByPeriod({ domainName, dateFrom, dateTo });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-07T00:00:00.000Z',
          },
          url:
            '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-source-type',
        }),
      );
    });

    it('should call datahub and return correct data', async () => {
      // Arrange
      const request = jest.fn(async () => fullTrafficSourceResponse);

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-07');

      // Act
      const response = await dataHubClient.getTrafficSourcesByPeriod({
        domainName,
        dateFrom,
        dateTo,
      });
      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-07T00:00:00.000Z',
          },
          url:
            '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-source-type',
        }),
      );
      expect(response).toEqual({
        success: true,
        value: [
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
        ],
      });
    });
  });

  describe('getVisitsQuantitySummarizedByDay', () => {
    it('should call datahub with the right url', async () => {
      // Arrange
      const request = jest.fn(async () => {
        emptyDailyVisitsResponse;
      });

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-08');

      // Act
      await dataHubClient.getVisitsQuantitySummarizedByDay({
        domainName,
        dateFrom,
        dateTo,
      });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer jwtToken',
          },
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-08T00:00:00.000Z',
          },
          url: '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-day',
        }),
      );
    });

    it('should call datahub and return correct data', async () => {
      // Arrange
      const request = jest.fn(async () => fullDailyResponse);

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-08');

      // Act
      const response = await dataHubClient.getVisitsQuantitySummarizedByDay({
        domainName,
        dateFrom,
        dateTo,
      });
      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer jwtToken',
          },
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-08T00:00:00.000Z',
          },
          url: '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-day',
        }),
      );
      expect(response).toEqual({
        success: true,
        value: [
          {
            from: new Date('2018-10-10T03:00:00.000Z'),
            to: new Date('2018-10-11T03:00:00.000Z'),
            qVisitors: 20,
            qVisitorsWithEmail: 3,
            qVisitorsWithOutEmail: 17,
            qVisits: 30,
            qVisitsWithEmail: 10,
          },
          {
            from: new Date('2018-10-11T03:00:00.000Z'),
            to: new Date('2018-10-12T03:00:00.000Z'),
            qVisitors: 40,
            qVisitorsWithEmail: 10,
            qVisitorsWithOutEmail: 30,
            qVisits: 50,
            qVisitsWithEmail: 20,
          },
        ],
      });
    });

    it('should call datahub and get and error', async () => {
      // Arrange
      const unauthorizedResponse = {
        code: 401,
        detail: 'unauthorized',
      };

      const request = jest.fn(async () => {
        unauthorizedResponse;
      });

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-08');

      // Act
      const response = await dataHubClient.getVisitsQuantitySummarizedByDay({
        domainName,
        dateFrom,
        dateTo,
      });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer jwtToken',
          },
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-08T00:00:00.000Z',
          },
          url: '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-day',
        }),
      );
      expect(response.success).toEqual(false);
    });
  });

  describe('getVisitsQuantitySummarizedByWeekdayAndHour', () => {
    it('should call datahub with the right url', async () => {
      // Arrange
      const request = jest.fn(async () => {
        emptyDailyVisitsResponse;
      });

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-08');

      // Act
      await dataHubClient.getVisitsQuantitySummarizedByWeekdayAndHour({
        domainName,
        dateFrom,
        dateTo,
      });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer jwtToken',
          },
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-08T00:00:00.000Z',
          },
          url:
            '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-weekday-and-hour',
        }),
      );
    });

    it('should call datahub and get and error', async () => {
      // Arrange
      const unauthorizedResponse = {
        code: 401,
        detail: 'unauthorized',
      };

      const request = jest.fn(async () => {
        unauthorizedResponse;
      });

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-08');

      // Act
      const response = await dataHubClient.getVisitsQuantitySummarizedByWeekdayAndHour({
        domainName,
        dateFrom,
        dateTo,
      });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer jwtToken',
          },
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-08T00:00:00.000Z',
          },
          url:
            '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-weekday-and-hour',
        }),
      );
      expect(response.success).toEqual(false);
    });
  });

  describe('getPagesRankingByPeriod', () => {
    it('should call datahub with the right url', async () => {
      // Arrange
      const request = jest.fn(async () => {
        emptyCommonResponse;
      });

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-07');
      const pageNumber = 0;
      const pageSize = 0;

      // Act
      await dataHubClient.getPagesRankingByPeriod({
        domainName,
        dateFrom,
        dateTo,
        pageNumber,
        pageSize,
      });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer jwtToken',
          },
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-07T00:00:00.000Z',
            pageNumber: 0,
            pageSize: 0,
            sortBy: 'visitors',
          },
          url: '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-page',
        }),
      );
    });

    it('should call datahub and return correct data', async () => {
      // Arrange
      const request = jest.fn(async () => fullRankingByPeriodResponse);

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-07');
      const pageNumber = 0;
      const pageSize = 2;

      // Act
      const response = await dataHubClient.getPagesRankingByPeriod({
        domainName,
        dateFrom,
        dateTo,
        pageNumber,
        pageSize,
      });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer jwtToken',
          },
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
            endDate: '2019-01-07T00:00:00.000Z',
            pageNumber: 0,
            pageSize: 2,
            sortBy: 'visitors',
          },
          url: '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-page',
        }),
      );
      expect(response).toEqual({
        success: true,
        value: {
          hasMorePages: true,
          pages: [
            {
              name: '/email-marketing',
              totalVisits: 10122,
              url: 'http://doppler.test/email-marketing',
              visitsWithEmail: 400,
            },
            {
              name: '/precios',
              totalVisits: 9000,
              url: 'http://doppler.test/precios',
              visitsWithEmail: 300,
            },
          ],
        },
      });
    });
  });
});
