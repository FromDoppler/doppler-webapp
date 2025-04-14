import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { useAddOnPlans } from '.';
import { AddOnType, PLAN_TYPE } from '../../doppler-types';

describe('useAddOnPlans', () => {
  it('should complete addon plans (onsite) with success', async () => {
    // Arrange
    const appSessionRef = {
      current: {
        userData: {
          user: {
            plan: {
              idPlan: 3,
              planType: PLAN_TYPE.free,
            },
            onSite: {
              plan: {
                idPlan: 3,
                printQty: 500,
              },
            },
          },
        },
      },
    };

    const onSitePlansData = [
      {
        planId: 1,
        printQty: 500,
        active: true,
      },
      {
        planId: 2,
        printQty: 1000,
        active: true,
      },
    ];

    const customOnSitePlansData = [
      {
        planId: 1,
        printQty: 500,
        active: true,
      },
    ];

    const dopplerAccountPlansApiClientFake = {
      getAddOnPlans: jest.fn().mockResolvedValue({ success: true, value: onSitePlansData }),
      getCustomAddOnPlans: jest
        .fn()
        .mockResolvedValue({ success: true, value: customOnSitePlansData }),
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useAddOnPlans(AddOnType.OnSite, dopplerAccountPlansApiClientFake, appSessionRef),
    );

    // Assert
    expect(result.current[0].loading).toBe(true);

    await waitForNextUpdate();
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].hasError).toBe(false);
    expect(result.current[0].addOnPlans).toEqual([{ quantity: 0 }, ...onSitePlansData]);
  });

  it('should complete addon plans (push notifications) with success', async () => {
    // Arrange
    const appSessionRef = {
      current: {
        userData: {
          user: {
            plan: {
              idPlan: 3,
              planType: PLAN_TYPE.free,
            },
            pushNotification: {
              plan: {
                idPlan: 3,
                quantity: 500,
              },
            },
          },
        },
      },
    };

    const pushNotificationPlansData = [
      {
        planId: 1,
        quantity: 500,
        active: true,
      },
      {
        planId: 2,
        quantity: 1000,
        active: true,
      },
    ];

    const customPushNotificationPlansData = [
      {
        planId: 1,
        quantity: 500,
        active: true,
      },
    ];

    const dopplerAccountPlansApiClientFake = {
      getAddOnPlans: jest
        .fn()
        .mockResolvedValue({ success: true, value: pushNotificationPlansData }),
      getCustomAddOnPlans: jest
        .fn()
        .mockResolvedValue({ success: true, value: customPushNotificationPlansData }),
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useAddOnPlans(AddOnType.PushNotifications, dopplerAccountPlansApiClientFake, appSessionRef),
    );

    // Assert
    expect(result.current[0].loading).toBe(true);

    await waitForNextUpdate();
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].hasError).toBe(false);
    expect(result.current[0].addOnPlans).toEqual([{ quantity: 0 }, ...pushNotificationPlansData]);
  });
});
