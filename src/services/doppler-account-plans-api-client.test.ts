import { AxiosStatic } from 'axios';
import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';
import { HttpDopplerAccountPlansApiClient } from './doppler-account-plans-api-client';
import {
  fakeAccountPlanDiscounts,
  fakePlan,
  fakePromotion,
} from './doppler-account-plans-api-client.double';

const consoleError = console.error;
const jwtToken = 'jwtToken';
const accountEmail = 'email@mail.com';

function createHttpDopplerAccountPlansApiClient(axios: any) {
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

  const apiClient = new HttpDopplerAccountPlansApiClient({
    axiosStatic,
    baseUrl: 'http://api.test',
    connectionDataRef,
  });
  return apiClient;
}

describe('HttpDopplerAccountPlansApiClient', () => {
  beforeEach(() => {
    console.error = consoleError; // Restore console error logs
  });

  it('should get discounts data', async () => {
    // Arrange
    const planDiscounts = {
      data: fakeAccountPlanDiscounts,
      status: 200,
    };
    const request = jest.fn(async () => planDiscounts);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getDiscountsData(1, '5');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail', async () => {
    // Arrange
    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getDiscountsData(1, '5');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  it('should get plan data', async () => {
    // Arrange
    const plan = {
      data: fakePlan,
      status: 200,
    };
    const request = jest.fn(async () => plan);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getPlanData(1, 1);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail to get plan information', async () => {
    // Arrange
    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getPlanData(1, 1);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  it('should validate promocode', async () => {
    // Arrange
    const promotion = {
      data: fakePromotion,
      status: 200,
    };
    const request = jest.fn(async () => promotion);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.validatePromocode(1, 'promocode');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should set error when the connecting fail to validate promocode', async () => {
    // Arrange
    const response = {
      status: 500,
    };

    const request = jest.fn(async () => response);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.validatePromocode(1, 'promocode');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(false);
  });

  it('should get PlanAmountDetails data', async () => {
    // Arrange
    const planDiscounts = {
      data: fakeAccountPlanDiscounts,
      status: 200,
    };
    const request = jest.fn(async () => planDiscounts);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getPlanAmountDetailsData(1, 1, '');

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should get CustomCoversationsPlans data', async () => {
    // Arrange
    const addOnPlans = {
      data: [{ quantity: 10, planId: 1 }],
      status: 200,
    };
    const request = jest.fn(async () => addOnPlans);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getCustomCoversationsPlans();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should get getCoversationsPLans data', async () => {
    // Arrange
    const addOnPlans = {
      data: [{ quantity: 10, planId: 1 }],
      status: 200,
    };
    const request = jest.fn(async () => addOnPlans);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getCoversationsPLans();

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should get AddOnPlans data', async () => {
    // Arrange
    const addOnPlans = {
      data: [{ quantity: 10, planId: 1 }],
      status: 200,
    };
    const request = jest.fn(async () => addOnPlans);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getAddOnPlans(3);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should get CustomAddOnPlans data', async () => {
    // Arrange
    const addOnPlans = {
      data: [{ quantity: 10, planId: 1 }],
      status: 200,
    };
    const request = jest.fn(async () => addOnPlans);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getCustomAddOnPlans(3);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should get AddOnPlanBillingDetailsData', async () => {
    // Arrange
    const plan = {
      data: fakePlan,
      status: 200,
    };
    const request = jest.fn(async () => plan);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getAddOnPlanBillingDetailsData(1, 1, 1);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should get AddOnPlanData', async () => {
    // Arrange
    const plan = {
      data: fakePlan,
      status: 200,
    };
    const request = jest.fn(async () => plan);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getAddOnPlanData(1, 1);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });

  it('should get FreeAddOnPlan', async () => {
    // Arrange
    const plan = {
      data: fakePlan,
      status: 200,
    };
    const request = jest.fn(async () => plan);
    const dopplerAccountPlansApiClient = createHttpDopplerAccountPlansApiClient({ request });

    // Act
    const result = await dopplerAccountPlansApiClient.getFreeAddOnPlan(1);

    // Assert
    expect(request).toBeCalledTimes(1);
    expect(result).not.toBe(undefined);
    expect(result.success).toBe(true);
  });
});
