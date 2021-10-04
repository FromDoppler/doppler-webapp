import { AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';
import { HttpDopplerBillingUserApiClient } from './doppler-billing-user-api-client';
import {
  fakeBillingInformation,
  fakePaymentMethodInformation,
  fakePaymentMethod,
} from './doppler-billing-user-api-client.double';

const consoleError = console.error;
const jwtToken = 'jwtToken';
const accountEmail = 'email@mail.com';

function createHttpDopplerBillingUserApiClient(axios: any) {
  const axiosStatic = {
    create: () => axios,
  } as AxiosStatic;
  const connectionDataRef = {
    current: {
      status: 'authenticated',
      jwtToken,
      userData: { user: { email: accountEmail } } as DopplerLegacyUserData,
    },
  } as RefObject<AppSession>;

  const apiClient = new HttpDopplerBillingUserApiClient({
    axiosStatic,
    baseUrl: 'http://api.test',
    connectionDataRef,
  });
  return apiClient;
}

describe('HttpDopplerBillingUserApiClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should get billing information', async () => {
    // Arrange
    const billingInformation = {
      data: fakeBillingInformation,
      status: 200,
    };
    const request = jest.fn(async () => billingInformation);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.getBillingInformationData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should update billing information', async () => {
    // Arrange
    const values = fakeBillingInformation;

    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.updateBillingInformation(values);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail', async () => {
    // Arrange
    const values = fakeBillingInformation;

    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.updateBillingInformation(values);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  it('should get payment method information', async () => {
    // Arrange
    const paymentMethodInformation = {
      data: fakePaymentMethodInformation,
      status: 200,
    };
    const request = jest.fn(async () => paymentMethodInformation);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.getPaymentMethodData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail to get payment method information', async () => {
    // Arrange
    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.getPaymentMethodData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  it('should put payment method information', async () => {
    // Arrange
    const values = fakePaymentMethod;
    const response = {
      status: 200,
    };
    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.updatePaymentMethod(values);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail to put payment method information', async () => {
    // Arrange
    const values = fakePaymentMethod;
    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.updatePaymentMethod(values);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  it('should update payment method', async () => {
    // Arrange
    const values = fakePaymentMethod;

    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.updatePaymentMethod(values);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should purchase', async () => {
    // Arrange
    const values = {
      planId: 1,
      discountId: 1,
      total: 500,
    };

    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.purchase(values);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });
});
