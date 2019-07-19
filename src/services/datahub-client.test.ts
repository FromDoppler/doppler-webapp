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
      },
      {
        sourceName: 'Social',
        quantity: 1000,
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
      expect(response).toEqual([
        { sourceName: 'Email', quantity: 2000 },
        { sourceName: 'Social', quantity: 1000 },
      ]);
    });
  });
});
