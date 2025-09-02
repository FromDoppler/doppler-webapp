import { AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';
import { HttpDopplerBillingUserApiClient } from './doppler-billing-user-api-client';
import {
  fakeBillingInformation,
  fakePaymentMethodInformation,
  fakePaymentMethod,
  fakeAgreement,
  fakeInvoiceRecipients,
  fakeUserPlan,
  fakeInvoices,
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

  it('should update billing information with idselectedPlan correctly', async () => {
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
    const values = fakeAgreement;

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

  it('should create agreement when user purchase new plan', async () => {
    // Arrange
    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.purchase(fakeAgreement);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(request).toBeCalledWith(
      expect.objectContaining({
        method: 'POST',
        data: {
          total: 'data.total',
          discountId: '12',
          planId: '34',
        },
        url: '/accounts/email@mail.com/agreements',
      }),
    );
  });

  it('should get invoice recipients information', async () => {
    // Arrange
    const invoiceRecipients = {
      data: fakeInvoiceRecipients,
      status: 200,
    };
    const request = jest.fn(async () => invoiceRecipients);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.getInvoiceRecipientsData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail to get invoice recipients information', async () => {
    // Arrange
    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.getInvoiceRecipientsData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  it('should update invoice recipients', async () => {
    // Arrange
    const values = fakeInvoiceRecipients;
    const planId = 5;

    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.updateInvoiceRecipients(values, planId);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should get current plan information', async () => {
    // Arrange
    const userPlan = {
      data: fakeUserPlan,
      status: 200,
    };
    const request = jest.fn(async () => userPlan);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.getCurrentUserPlanData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail to get invoice recipients information', async () => {
    // Arrange
    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.getCurrentUserPlanData();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  it('should get success response when updating purchase intention', async () => {
    // Arrange
    const response = {
      status: 200,
    };
    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.updatePurchaseIntention();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should get invoices', async () => {
    // Arrange
    const response = {
      status: 200,
      data: fakeInvoices,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.getInvoices(['pending', 'approved']);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
    expect(request).toBeCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/accounts/email@mail.com/invoices?withStatus=pending&withStatus=approved',
      }),
    );
  });

  it('should request additional services', async () => {
    // Arrange
    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.requestAdditionalServices({});

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should cancellation account', async () => {
    // Arrange
    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.cancellationAccount({
      cancellationReason: 'test',
    });

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should save account cancellation request', async () => {
    // Arrange
    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.saveAccountCancellationRequest({
      cancellationReason: 'test',
    });

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set scheduled cancellation', async () => {
    // Arrange
    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.setScheduledCancellation({
      cancellationReason: 'test',
    });

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should send consulting offer notification', async () => {
    // Arrange
    const response = {
      status: 200,
    };

    const request = jest.fn(async () => response);
    const dopplerBillingUserApiClient = createHttpDopplerBillingUserApiClient({ request });

    // Act
    const result = await dopplerBillingUserApiClient.sendConsultingOfferNotification({
      cancellationReason: 'test',
    });

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });
});
