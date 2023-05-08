import { AxiosStatic } from 'axios';
import { HttpStaticDataClient } from './static-data-client';
import {
  fakeDocumentTypes,
  fakeIndustries,
  fakeStates,
  fakeTaxRegimes,
} from './static-data-client.double';

const consoleError = console.error;

function createHttpStaticDataClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;

  const apiClient = new HttpStaticDataClient({
    axiosStatic,
    baseUrl: 'http://api.test',
  });
  return apiClient;
}

describe('HttpStaticDataClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should get industries', async () => {
    // Arrange
    const request = jest.fn(async () => fakeIndustries);
    const staticDataClient = createHttpStaticDataClient({ request });

    // Act
    const result = await staticDataClient.getIndustriesData('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail', async () => {
    // Arrange
    const request = jest.fn(async () => {});
    request.mockImplementation(() => {
      throw new Error();
    });
    const staticDataClient = createHttpStaticDataClient({ request });

    console.error = jest.fn(); // silence console error for this test run only

    // Act
    const result = await staticDataClient.getIndustriesData('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
    expect(result.error).not.toBe(undefined);
  });

  it('should get states', async () => {
    // Arrange
    const fakeResponse = {
      data: fakeStates,
      status: 200,
    };

    const request = jest.fn(async () => fakeResponse);
    const staticDataClient = createHttpStaticDataClient({ request });

    // Act
    const result = await staticDataClient.getStatesData('ar', 'es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail trying to get the states information ', async () => {
    // Arrange
    const request = jest.fn(async () => {});
    request.mockImplementation(() => {
      throw new Error();
    });
    const staticDataClient = createHttpStaticDataClient({ request });

    console.error = jest.fn(); // silence console error for this test run only

    // Act
    const result = await staticDataClient.getStatesData('ar', 'es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
    expect(result.error).not.toBe(undefined);
  });

  it('should get cfdi', async () => {
    // Arrange
    const fakeResponse = {
      data: fakeStates,
      status: 200,
    };

    const request = jest.fn(async () => fakeResponse);
    const staticDataClient = createHttpStaticDataClient({ request });

    // Act
    const result = await staticDataClient.getUseCfdiData('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail trying to get the cfdi information ', async () => {
    // Arrange
    const request = jest.fn(async () => {});
    request.mockImplementation(() => {
      throw new Error();
    });
    const staticDataClient = createHttpStaticDataClient({ request });

    console.error = jest.fn(); // silence console error for this test run only

    // Act
    const result = await staticDataClient.getUseCfdiData('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
    expect(result.error).not.toBe(undefined);
  });

  it('should get payment types', async () => {
    // Arrange
    const fakeResponse = {
      data: fakeStates,
      status: 200,
    };

    const request = jest.fn(async () => fakeResponse);
    const staticDataClient = createHttpStaticDataClient({ request });

    // Act
    const result = await staticDataClient.getPaymentTypesData('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail trying to get the payment types information ', async () => {
    // Arrange
    const request = jest.fn(async () => {});
    request.mockImplementation(() => {
      throw new Error();
    });
    const staticDataClient = createHttpStaticDataClient({ request });

    console.error = jest.fn(); // silence console error for this test run only

    // Act
    const result = await staticDataClient.getPaymentTypesData('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
    expect(result.error).not.toBe(undefined);
  });

  it('should get payment ways', async () => {
    // Arrange
    const fakeResponse = {
      data: fakeStates,
      status: 200,
    };

    const request = jest.fn(async () => fakeResponse);
    const staticDataClient = createHttpStaticDataClient({ request });

    // Act
    const result = await staticDataClient.getPaymentWaysData('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail trying to get the payment ways information ', async () => {
    // Arrange
    const request = jest.fn(async () => {});
    request.mockImplementation(() => {
      throw new Error();
    });
    const staticDataClient = createHttpStaticDataClient({ request });

    console.error = jest.fn(); // silence console error for this test run only

    // Act
    const result = await staticDataClient.getPaymentWaysData('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
    expect(result.error).not.toBe(undefined);
  });

  it('should get document types', async () => {
    // Arrange
    const fakeResponse = {
      data: fakeDocumentTypes,
      status: 200,
    };

    const request = jest.fn(async () => fakeResponse);
    const staticDataClient = createHttpStaticDataClient({ request });

    // Act
    const result = await staticDataClient.getDocumentTypesData('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail trying to get the document types information ', async () => {
    // Arrange
    const request = jest.fn(async () => {});
    request.mockImplementation(() => {
      throw new Error();
    });
    const staticDataClient = createHttpStaticDataClient({ request });

    console.error = jest.fn(); // silence console error for this test run only

    // Act
    const result = await staticDataClient.getDocumentTypesData('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
    expect(result.error).not.toBe(undefined);
  });

  it('should get tax regimes', async () => {
    // Arrange
    const fakeResponse = {
      data: fakeTaxRegimes,
      status: 200,
    };

    const request = jest.fn(async () => fakeResponse);
    const staticDataClient = createHttpStaticDataClient({ request });

    // Act
    const result = await staticDataClient.getTaxRegimes('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result.success).toBe(true);
  });

  it('should set error when the connection fails trying to get the tax regimes information ', async () => {
    // Arrange
    const request = jest.fn(async () => {});
    request.mockImplementation(() => {
      throw new Error();
    });
    const staticDataClient = createHttpStaticDataClient({ request });

    console.error = jest.fn(); // silence console error for this test run only

    // Act
    const result = await staticDataClient.getTaxRegimes('es');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
    expect(result.error).not.toBe(undefined);
  });
});
