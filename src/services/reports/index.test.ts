import { AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { addDays, getStartOfDate } from '../../utils';
import { DopplerLegacyUserData } from '../doppler-legacy-client';
import { AppSession } from '../app-session';
import { HttpReportClient } from '.';

function createHttpReportClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const connectionDataRef = {
    current: {
      status: 'authenticated',
      jwtToken: 'jwtToken',
      userData: {} as DopplerLegacyUserData,
    },
  } as RefObject<AppSession>;
  const reportClient = new HttpReportClient({
    axiosStatic,
    baseUrl: 'http://reporting.test',
    connectionDataRef,
  });
  return reportClient;
}

describe('HttpReportClient', () => {
  it('should get campaign summary', async () => {
    // Arrange
    const dateTo = getStartOfDate(new Date()) ?? new Date();
    const dateFrom = addDays(dateTo, -30);
    const response = {
      headers: {},
      data: {
        totalSentEmails: 21.458,
        totalOpenClicks: 57,
        clickThroughRate: 17,
      },
    };
    const request = jest.fn(async () => response);
    const reportClient = createHttpReportClient({ request });

    // Act
    const result = await reportClient.getCampaignsSummary({
      dateFrom,
      dateTo,
    });

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.totalSentEmails).toEqual(response.data.totalSentEmails);
    expect(result.value.totalOpenClicks).toEqual(response.data.totalOpenClicks);
    expect(result.value.clickThroughRate).toEqual(response.data.clickThroughRate);
  });
});
