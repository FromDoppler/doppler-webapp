import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { useFetchPlanTypes } from '.';

describe('useFetchPlanTypes', () => {
  it('should complete getDistinctPlans with success', async () => {
    // Arrange
    const planTypesData = [
      {
        type: 'subscribers',
        minPrice: 8,
      },
      {
        type: 'monthly-deliveries',
        minPrice: 134,
      },
      {
        type: 'prepaid',
        minPrice: 15,
      },
    ];
    const planServiceFake = {
      getDistinctPlans: jest.fn().mockResolvedValue({ success: true, value: planTypesData }),
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() => useFetchPlanTypes(planServiceFake));

    // Assert
    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.planTypes.value).toBe(planTypesData);
  });
});
