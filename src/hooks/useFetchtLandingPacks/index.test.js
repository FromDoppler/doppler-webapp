import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { useFetchLandingPacks } from '.';

const fakeLandingPacks = [
  {
    planId: 1,
    description: 'PACK 5',
    landingsQty: 5,
    fee: 10,
  },
  {
    planId: 2,
    description: 'PACK 25',
    landingsQty: 25,
    fee: 10,
  },
  {
    planId: 3,
    description: 'PACK 100',
    landingsQty: 100,
    fee: 50,
  },
];

describe('useFetchLandingPacks', () => {
  it('should complete getLandingPacks with success', async () => {
    // Arrange
    const dopplerAccountPlansApiClientFake = {
      getLandingPacks: jest.fn().mockResolvedValue({ success: true, value: fakeLandingPacks }),
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchLandingPacks(dopplerAccountPlansApiClientFake),
    );

    // Assert
    await waitForNextUpdate();
    expect(result.current.error).toBeNull();
    expect(result.current.landingPacks).toBe(fakeLandingPacks);
  });

  it('should complete getPaymentMethodData with failure', async () => {
    // Arrange
    const dopplerAccountPlansApiClientFake = {
      getLandingPacks: jest.fn().mockResolvedValue({ success: false, value: null }),
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchLandingPacks(dopplerAccountPlansApiClientFake),
    );

    // Assert
    await waitForNextUpdate();
    expect(result.current.error).not.toBeNull();
  });
});
