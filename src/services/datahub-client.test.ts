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
        sourceName: 'Email',
        quantity: 2000,
        withEmail: 500,
      },
      {
        sourceName: 'Social',
        quantity: 1000,
        withEmail: 500,
      },
    ],
  },
};

const emptyDailyVisitsResponse = {
  data: {
    periods: [],
  },
};

const fullDailyVisitsResponse = {
  data: {
    periods: [
      {
        periodNumber: 0,
        from: '2018-10-10T03:00:00.000Z',
        to: '2018-10-11T03:00:00.000Z',
        quantity: 20,
      },
      {
        periodNumber: 1,
        from: '2018-10-11T03:00:00.000Z',
        to: '2018-10-12T03:00:00.000Z',
        quantity: 40,
      },
    ],
  },
};

const fullRankingByPeriodResponse = {
  data: {
    items: [
      {
        page: '/email-marketing',
        visitorsQuantity: 10122,
        withEmail: 400,
      },
      {
        page: '/precios',
        visitorsQuantity: 9000,
        withEmail: 300,
      },
    ],
  },
};

describe('HttpDataHubClient', () => {
  describe('getTrafficSourcesByPeriod', () => {
    it('should call datahub with the right url', async () => {
      // Arrange
      const request = jest.fn(async () => emptyCommonResponse);

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');

      // Act
      await dataHubClient.getTrafficSourcesByPeriod({ domainName, dateFrom });

      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
          },
          url:
            '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-source',
        }),
      );
    });

    it('should call datahub and return correct data', async () => {
      // Arrange
      const request = jest.fn(async () => fullTrafficSourceResponse);

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');

      // Act
      const response = await dataHubClient.getTrafficSourcesByPeriod({ domainName, dateFrom });
      // Assert
      expect(request).toBeCalledTimes(1);
      expect(request).toBeCalledWith(
        expect.objectContaining({
          method: 'GET',
          params: {
            startDate: '2019-01-01T00:00:00.000Z',
          },
          url:
            '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-source',
        }),
      );
      expect(response).toEqual({
        success: true,
        value: [
          { sourceName: 'Email', quantity: 2000, withEmail: 500 },
          { sourceName: 'Social', quantity: 1000, withEmail: 500 },
        ],
      });
    });
  });

  describe('getDailyVisitsByPeriod', () => {
    it('should call datahub with the right url', async () => {
      // Arrange
      const request = jest.fn(async () => {
        emptyDailyVisitsResponse;
      });

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-08');
      const periodBy = 'days';

      // Act
      await dataHubClient.getVisitsQuantitySummarizedByPeriod({
        domainName,
        dateFrom,
        dateTo,
        periodBy,
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
            periodBy: 'days',
          },
          url:
            '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/quantity-summarized-by-period',
        }),
      );
    });

    it('should call datahub and return correct data', async () => {
      // Arrange
      const request = jest.fn(async () => fullDailyVisitsResponse);

      const dataHubClient = createHttpDataHubClient({ request });
      const domainName = 'doppler.test';
      const dateFrom = new Date('2019-01-01');
      const dateTo = new Date('2019-01-08');
      const periodBy = 'days';

      // Act
      const response = await dataHubClient.getVisitsQuantitySummarizedByPeriod({
        domainName,
        dateFrom,
        dateTo,
        periodBy,
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
            periodBy: 'days',
          },
          url:
            '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/quantity-summarized-by-period',
        }),
      );
      expect(response).toEqual({
        success: true,
        value: [
          {
            periodNumber: 0,
            from: new Date('2018-10-10T03:00:00.000Z'),
            to: new Date('2018-10-11T03:00:00.000Z'),
            quantity: 20,
          },
          {
            periodNumber: 1,
            from: new Date('2018-10-11T03:00:00.000Z'),
            to: new Date('2018-10-12T03:00:00.000Z'),
            quantity: 40,
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
      const periodBy = 'days';

      // Act
      const response = await dataHubClient.getVisitsQuantitySummarizedByPeriod({
        domainName,
        dateFrom,
        dateTo,
        periodBy,
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
            periodBy: 'days',
          },
          url:
            '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/quantity-summarized-by-period',
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
      const pageNumber = 0;
      const pageSize = 0;

      // Act
      await dataHubClient.getPagesRankingByPeriod({ domainName, dateFrom, pageNumber, pageSize });

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
      const pageNumber = 0;
      const pageSize = 2;

      // Act
      const response = await dataHubClient.getPagesRankingByPeriod({
        domainName,
        dateFrom,
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
            pageNumber: 0,
            pageSize: 2,
            sortBy: 'visitors',
          },
          url: '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/summarized-by-page',
        }),
      );
      expect(response).toEqual({
        success: true,
        value: [
          {
            name: '/email-marketing',
            totalVisitors: 10122,
            url: 'http://doppler.test/email-marketing',
            withEmail: 400,
          },
          {
            name: '/precios',
            totalVisitors: 9000,
            url: 'http://doppler.test/precios',
            withEmail: 300,
          },
        ],
      });
    });
  });
});
