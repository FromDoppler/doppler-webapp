import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { useOnSitePlans } from '.';
import { PLAN_TYPE } from '../../doppler-types';

describe('useOnSitePlans', () => {
  it('should complete onsite-plans with success', async () => {
    // Arrange
    const appSessionRef = {
      current: {
        userData: {
          user: {
            plan: {
              idPlan: 3,
              planType: PLAN_TYPE.free,
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
      getOnSitePlans: jest.fn().mockResolvedValue({ success: true, value: onSitePlansData }),
      getCustomOnSitePlans: jest
        .fn()
        .mockResolvedValue({ success: true, value: customOnSitePlansData }),
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useOnSitePlans(dopplerAccountPlansApiClientFake, appSessionRef),
    );

    // Assert
    expect(result.current[0].loading).toBe(true);

    await waitForNextUpdate();
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].hasError).toBe(false);
    expect(result.current[0].onSitePlans).toEqual([{ printQty: 0 }, ...onSitePlansData]);
  });
});
