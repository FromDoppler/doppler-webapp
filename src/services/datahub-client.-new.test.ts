import { AxiosStatic } from 'axios';
import { HttpDatahubClientNew } from './datahub-client-new';
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
  const dataHubClient = new HttpDatahubClientNew({ axiosStatic, baseUrl, connectionDataRef });
  return dataHubClient;
}

const emptyCommonResponse = {
  data: {
    items: [],
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
});
