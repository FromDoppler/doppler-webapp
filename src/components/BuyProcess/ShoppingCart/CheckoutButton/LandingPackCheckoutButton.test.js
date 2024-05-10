import '@testing-library/jest-dom/extend-expect';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter as Router } from 'react-router-dom';
import { DELAY_BEFORE_REDIRECT_TO_SUMMARY } from '.';
import { BUY_LANDING_PACK } from '..';
import { ACCOUNT_TYPE } from '../../../../hooks/useUserTypeAsQueryParam';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { LandingPackCheckoutButton } from './LandingPackCheckoutButton';

const getFakePurchase = (success) => {
  const purchaseMock = jest.fn(async () => ({
    success,
    error: { response: { data: success ? '' : 'error' } },
  }));
  const dependencies = {
    dopplerBillingUserApiClient: {
      purchaseLandings: purchaseMock,
    },
  };

  return {
    purchaseMock,
    dependencies,
  };
};

describe('LandingPackCheckoutButton component', () => {
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
      total: 1_000,
      keyTextButton: 'buy_process.buy_now_title',
      landingPacks: [
        {
          idPlan: 1,
        },
        {
          idPlan: 2,
        },
      ],
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
              `/checkout/premium/subscribers?origin_inbound=${originInbound}&${ACCOUNT_TYPE}=FREE`,
            ]}
          >
            <LandingPackCheckoutButton {...props} />
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
      total: props.total,
      landingPacks: props.landingPacks,
    });

    // simulate redirect to checkout summary
    jest.advanceTimersByTime(DELAY_BEFORE_REDIRECT_TO_SUMMARY);
    expect(window.location.href).toBe(
      `/checkout-summary?buyType=${BUY_LANDING_PACK}&${ACCOUNT_TYPE}=FREE`,
    );
    jest.useRealTimers();
  });

  it('should generate an error in the purchase process', async () => {
    //Arrange
    const originInbound = 'fake-origin-originInbound';
    const props = {
      canBuy: true,
      total: 1_000,
      keyTextButton: 'buy_process.buy_now_title',
    };
    const successRequest = false;
    const { purchaseMock, dependencies } = getFakePurchase(successRequest);

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/checkout/premium/subscribers?origin_inbound=${originInbound}&${ACCOUNT_TYPE}=FREE`,
            ]}
          >
            <LandingPackCheckoutButton {...props} />
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
      total: props.total,
      landingPacks: props.landingPacks,
    });
    expect(getBuyButton()).toBeEnabled();
  });
});
