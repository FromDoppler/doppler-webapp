import { HttpDopplerMvcClient } from './doppler-mvc-client';
import { AxiosStatic, AxiosInstance, AxiosRequestConfig } from 'axios';

describe('HttpDopplerMvcClient', () => {
  it('constructor should initialize axios with baseUrl and withCredentials', () => {
    // Arrange
    const baseUrl = 'https://baseUrl.com/';

    const axiosInstanceDouble: any = {
      get: () => {},
    };

    // It is the same of
    // const axiosStaticCreate = jest.fn(
    const axiosStaticCreate = jest.fn<AxiosInstance, [AxiosRequestConfig]>(
      () => axiosInstanceDouble,
    );

    const axiosStaticDouble: any = {
      create: axiosStaticCreate,
    };

    // Act
    new HttpDopplerMvcClient(axiosStaticDouble, baseUrl);

    // Assert
    expect(axiosStaticCreate).toHaveBeenCalledTimes(1);
    expect(axiosStaticCreate).toHaveBeenCalledWith({
      baseURL: baseUrl,
      withCredentials: true,
    });
  });
});
