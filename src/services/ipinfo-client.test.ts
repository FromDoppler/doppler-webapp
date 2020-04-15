import { AxiosStatic } from 'axios';
import { HttpIpinfoClient } from './ipinfo-client';
import { exception } from 'react-ga';

function createHttpIpinfoClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const ipinfoClient = new HttpIpinfoClient({
    axiosStatic,
  });
  return ipinfoClient;
}

describe('HttpIpinfoClient', () => {
  it('should return the received country code', async () => {
    // Arrange
    const countryCode = 'FR';
    const request = jest.fn(async () => ({ data: { country: countryCode } }));
    const ipinfoClient = createHttpIpinfoClient({ request });

    // Act
    const result = await ipinfoClient.getCountryCode();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).toBe('FR');
  });

  it('should return AR if the country code is null', async () => {
    // Arrange
    const countryCode = null;
    const request = jest.fn(async () => ({ data: { country: countryCode } }));
    const ipinfoClient = createHttpIpinfoClient({ request });

    // Act
    const result = await ipinfoClient.getCountryCode();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).toBe('AR');
  });

  it('should return AR if the response is unexpected', async () => {
    // Arrange
    const request = jest.fn(async () => ({ data: {} }));
    const ipinfoClient = createHttpIpinfoClient({ request });

    // Act
    const result = await ipinfoClient.getCountryCode();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).toBe('AR');
  });

  it('should return AR if the response is an exception', async () => {
    // Arrange
    const request = jest.fn(async () => {
      throw new Error();
    });
    const ipinfoClient = createHttpIpinfoClient({ request });

    // Act
    const result = await ipinfoClient.getCountryCode();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).toBe('AR');
  });

  it('should call ipinfo API with the right parameters', async () => {
    // Arrange
    const countryCode = 'FR';
    const request = jest.fn(async () => ({ data: { country: countryCode } }));
    const ipinfoClient = createHttpIpinfoClient({ request });

    // Act
    const result = await ipinfoClient.getCountryCode();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).toBe(countryCode);
    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://ipinfo.io/json',
    });
  });
});
