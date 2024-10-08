import '@testing-library/jest-dom/extend-expect';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DELAY_BEFORE_REDIRECT_TO_SUMMARY, CheckoutButton } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { MemoryRouter as Router } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../../../hooks/useUserTypeAsQueryParam';
import { paymentType } from '../../../Plans/Checkout/PaymentMethod/PaymentMethod';
import { BUY_MARKETING_PLAN } from '../../../../doppler-types';

const getFakePurchase = (success) => {
  const purchaseMock = jest.fn(async () => ({
    success,
    error: { response: { data: success ? '' : 'error' } },
  }));
  const dependencies = {
    dopplerBillingUserApiClient: {
      purchase: purchaseMock,
    },
  };

  return {
    purchaseMock,
    dependencies,
  };
};

const getFakePurchaseWithError = (error) => {
  const purchaseMock = jest.fn(async () => ({
    success: false,
    error: { response: { data: error } },
  }));
  const dependencies = {
    dopplerBillingUserApiClient: {
      purchase: purchaseMock,
    },
  };

  return {
    purchaseMock,
    dependencies,
  };
};

describe('BuyButton component', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  it('should complete the purchase process satisfactorily', async () => {
    // Arrange
    const originInbound = 'fake-origin-originInbound';
    const props = {
      canBuy: true,
      planId: '1',
      total: 1_000,
      paymentMethod: paymentType.creditCard,
      keyTextButton: 'buy_process.buy_now_title',
    };
    const successRequest = true;
    const { purchaseMock, dependencies } = getFakePurchase(successRequest);
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers('legacy');

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/checkout/premium/subscribers?selected-plan=${props.planId}&origin_inbound=${originInbound}&${ACCOUNT_TYPE}=FREE`,
            ]}
          >
            <CheckoutButton {...props} />
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const getBuyButton = () =>
      screen.queryByRole('button', {
        name: 'buy',
      });

    expect(getBuyButton()).toBeEnabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // simulate click to buy button
    await act(() => user.click(getBuyButton()));
    expect(purchaseMock).toHaveBeenCalledTimes(1);
    expect(purchaseMock).toHaveBeenCalledWith({
      planId: props.planId,
      discountId: 0, // because hasn't discount
      total: props.total,
      promocode: '', // because hasn't promotion
      originInbound,
      additionalServices: [],
    });

    // simulate redirect to checkout summary
    jest.advanceTimersByTime(DELAY_BEFORE_REDIRECT_TO_SUMMARY);
    expect(window.location.href).toBe(
      `/checkout-summary?planId=${props.planId}&buyType=${BUY_MARKETING_PLAN}&paymentMethod=${props.paymentMethod}&${ACCOUNT_TYPE}=FREE`,
    );
    jest.useRealTimers();
  });

  it('should generate an error in the purchase process', async () => {
    //Arrange
    const props = {
      canBuy: true,
      planId: '1',
      total: 1_000,
      paymentMethod: paymentType.transfer,
      keyTextButton: 'buy_process.buy_now_title',
    };
    const successRequest = false;
    const { purchaseMock, dependencies } = getFakePurchase(successRequest);

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router initialEntries={[`/checkout/premium/subscribers?selected-plan=${props.planId}`]}>
            <CheckoutButton {...props} />
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const getBuyButton = () =>
      screen.queryByRole('button', {
        name: 'buy',
      });

    expect(getBuyButton()).toBeEnabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // simulate click to buy button
    await act(() => userEvent.click(getBuyButton()));
    expect(purchaseMock).toHaveBeenCalledTimes(1);
    expect(purchaseMock).toHaveBeenCalledWith({
      planId: props.planId,
      discountId: 0, // because hasn't discount
      total: props.total,
      promocode: '', // because hasn't promotion
      originInbound: '', // because hasn't origin_inbound
      additionalServices: [],
    });
    expect(getBuyButton()).toBeEnabled();
  });

  it('should complete the purchase process satisfactorily with discount and promocode', async () => {
    //Arrange
    const props = {
      canBuy: true,
      planId: '1',
      total: 1_000,
      paymentMethod: paymentType.transfer,
      keyTextButton: 'buy_process.buy_now_title',
      promotion: {
        extraCredits: '100',
        promocode: 'fake promocode',
      },
      discount: {
        id: 1,
        subscriptionType: 'fake description',
      },
    };
    const successRequest = true;
    const { purchaseMock, dependencies } = getFakePurchase(successRequest);
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers('legacy');

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/checkout/premium/subscribers?selected-plan=${props.planId}&${ACCOUNT_TYPE}=PAID`,
            ]}
          >
            <CheckoutButton {...props} />
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const getBuyButton = () =>
      screen.queryByRole('button', {
        name: 'buy',
      });

    expect(getBuyButton()).toBeEnabled();

    // simulate click to buy button
    await act(() => user.click(getBuyButton()));
    expect(purchaseMock).toHaveBeenCalledTimes(1);
    expect(purchaseMock).toHaveBeenCalledWith({
      planId: props.planId,
      discountId: props.discount.id,
      total: props.total,
      promocode: props.promotion.promocode,
      originInbound: '', // because hasn't origin_inbound
      additionalServices: [],
    });

    expect(getBuyButton()).not.toBeEnabled();

    // simulate redirect to checkout summary
    jest.advanceTimersByTime(DELAY_BEFORE_REDIRECT_TO_SUMMARY);
    expect(window.location.href).toBe(
      `/checkout-summary?planId=${props.planId}&buyType=${BUY_MARKETING_PLAN}&paymentMethod=${props.paymentMethod}&${ACCOUNT_TYPE}=PAID&discount=${props.discount.subscriptionType}&extraCredits=${props.promotion.extraCredits}`,
    );
    jest.useRealTimers();
  });

  it('should generate an oly support upselling error in the purchase process', async () => {
    //Arrange
    const props = {
      canBuy: true,
      planId: '1',
      total: 1_000,
      paymentMethod: paymentType.transfer,
      keyTextButton: 'buy_process.buy_now_title',
    };

    const { purchaseMock, dependencies } = getFakePurchaseWithError(
      'Invalid selected plan. Only supports upselling.',
    );

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router initialEntries={[`/checkout/premium/subscribers?selected-plan=${props.planId}`]}>
            <CheckoutButton {...props} />
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const getBuyButton = () =>
      screen.queryByRole('button', {
        name: 'buy',
      });

    expect(getBuyButton()).toBeEnabled();

    // simulate click to buy button
    await act(() => userEvent.click(getBuyButton()));
    expect(purchaseMock).toHaveBeenCalledTimes(1);
    expect(purchaseMock).toHaveBeenCalledWith({
      planId: props.planId,
      discountId: 0, // because hasn't discount
      total: props.total,
      promocode: '', // because hasn't promotion
      originInbound: '', // because hasn't origin_inbound.
      additionalServices: [],
    });
    expect(getBuyButton()).toBeEnabled();
  });
});
