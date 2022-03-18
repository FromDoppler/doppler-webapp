import { HttpSurveyClient } from './index';
import { AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from '../app-session';
import { DopplerLegacyUserData } from '../doppler-legacy-client';

const consoleError = console.error;

function createHttpSurveyClient(axios: any) {
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
  const surveyClient = new HttpSurveyClient({
    axiosStatic,
    baseUrl: 'http://Integration/Integration/GetSurveyFormStatus.test',
    connectionDataRef,
  });
  return surveyClient;
}

describe('HttpSurveyClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should get survey form status', async () => {
    // Arrange
    const response = {
      data: {
        surveyFormCompleted: true,
      },
    };
    const request = jest.fn(async () => response);
    const surveyClient = createHttpSurveyClient({ request });

    // Act
    const result = await surveyClient.getSurveyFormStatus();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(result.value.surveyFormCompleted).toEqual(response.data.surveyFormCompleted);
  });
});
