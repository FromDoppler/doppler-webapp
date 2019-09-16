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

const emptyTrafficSourceResponse = {
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

describe('HttpDataHubClient', () => {
  describe('getTrafficSourcesByPeriod', () => {
    it('should call datahub with the right url', async () => {
      // Arrange
      const request = jest.fn(async () => emptyTrafficSourceResponse);

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
      const periodBy = 'days';

      // Act
      await dataHubClient.getVisitsQuantitySummarizedByPeriod({ domainName, dateFrom, periodBy });

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
      const periodBy = 'days';

      // Act
      const response = await dataHubClient.getVisitsQuantitySummarizedByPeriod({
        domainName,
        dateFrom,
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
      const periodBy = 'days';

      // Act
      const response = await dataHubClient.getVisitsQuantitySummarizedByPeriod({
        domainName,
        dateFrom,
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
            periodBy: 'days',
          },
          url:
            '/cdhapi/customers/dataHubCustomerId/domains/doppler.test/events/quantity-summarized-by-period',
        }),
      );
      expect(response.success).toEqual(false);
    });
  });
});
