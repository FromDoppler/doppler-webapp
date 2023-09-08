import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import { usePaymentMethodData } from '.';
import { fakePaymentMethodInformation } from '../../services/doppler-billing-user-api-client.double';
import { PaymentMethodType } from '../../doppler-types';

describe('usePaymentMethodData', () => {
  it('should complete getPaymentMethodData with success', async () => {
    // Arrange
    const dopplerBillingUserApiClientFake = {
      getPaymentMethodData: jest
        .fn()
        .mockResolvedValue({ success: true, value: fakePaymentMethodInformation }),
    };
    const props = {
      dopplerBillingUserApiClient: dopplerBillingUserApiClientFake,
      selectedPaymentMethod: null,
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() => usePaymentMethodData(props));

    // Assert
    await waitForNextUpdate();
    expect(result.current).toBe(fakePaymentMethodInformation.paymentMethodName);
  });

  it('should complete getPaymentMethodData with failure', async () => {
    // Arrange
    const dopplerBillingUserApiClientFake = {
      getPaymentMethodData: jest.fn().mockResolvedValue({ success: false, value: null }),
    };
    const props = {
      dopplerBillingUserApiClient: dopplerBillingUserApiClientFake,
      selectedPaymentMethod: null,
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() => usePaymentMethodData(props));

    // Assert
    await waitForNextUpdate();
    expect(result.current).toBe(PaymentMethodType.creditCard);
  });

  it('should complete getPaymentMethodData with success but without payment method name', async () => {
    // Arrange
    const dopplerBillingUserApiClientFake = {
      getPaymentMethodData: jest.fn().mockResolvedValue({
        success: true,
        value: {
          ...fakePaymentMethodInformation,
          paymentMethodName: 'NONE',
        },
      }),
    };
    const props = {
      dopplerBillingUserApiClient: dopplerBillingUserApiClientFake,
      selectedPaymentMethod: null,
    };

    // Act
    const { result, waitForNextUpdate } = renderHook(() => usePaymentMethodData(props));

    // Assert
    await waitForNextUpdate();
    expect(result.current).toBe(PaymentMethodType.creditCard);
  });
});
