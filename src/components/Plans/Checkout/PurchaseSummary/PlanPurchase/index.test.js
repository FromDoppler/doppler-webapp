import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DELAY_BEFORE_REDIRECT_TO_SUMMARY, PlanPurchase } from '.';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { paymentType } from '../../PaymentMethod/PaymentMethod';
import { MemoryRouter as Router } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../../../../hooks/useUserTypeAsQueryParam';

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

describe('PlanPurchase component', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  it('should complete the purchase process satisfactorily', async () => {
    //Arrange
    const originInbound = 'fake-origin-originInbound';
    const props = {
      canBuy: true,
      planId: '1',
      total: 1_000,
      paymentMethod: paymentType.creditCard,
    };
    const successRequest = true;
    const { purchaseMock, dependencies } = getFakePurchase(successRequest);
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/checkout/premium/subscribers?selected-plan=${props.planId}&origin_inbound=${originInbound}&${ACCOUNT_TYPE}=FREE`,
            ]}
          >
            <PlanPurchase {...props} />
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const getBuyButton = () =>
      screen.queryByRole('button', {
        name: 'checkoutProcessForm.purchase_summary.buy_button',
      });

    expect(getBuyButton()).toBeEnabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // simulate click to buy button
    await user.click(getBuyButton());
    expect(purchaseMock).toHaveBeenCalledTimes(1);
    expect(purchaseMock).toHaveBeenCalledWith({
      planId: props.planId,
      discountId: 0, // because hasn't discount
      total: props.total,
      promocode: '', // because hasn't promotion
      originInbound,
    });
    expect(await screen.findByRole('alert', { name: 'success' })).toBeInTheDocument();

    // simulate redirect to checkout summary
    jest.advanceTimersByTime(DELAY_BEFORE_REDIRECT_TO_SUMMARY);
    expect(window.location.href).toBe(
      `/checkout-summary?planId=${props.planId}&paymentMethod=${props.paymentMethod}&${ACCOUNT_TYPE}=FREE`,
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
    };
    const successRequest = false;
    const { purchaseMock, dependencies } = getFakePurchase(successRequest);

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router initialEntries={[`/checkout/premium/subscribers?selected-plan=${props.planId}`]}>
            <PlanPurchase {...props} />
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const getBuyButton = () =>
      screen.queryByRole('button', {
        name: 'checkoutProcessForm.purchase_summary.buy_button',
      });

    expect(getBuyButton()).toBeEnabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // simulate click to buy button
    await userEvent.click(getBuyButton());
    expect(purchaseMock).toHaveBeenCalledTimes(1);
    expect(purchaseMock).toHaveBeenCalledWith({
      planId: props.planId,
      discountId: 0, // because hasn't discount
      total: props.total,
      promocode: '', // because hasn't promotion
      originInbound: '', // because hasn't origin_inbound
    });
    expect(await screen.findByRole('alert', { name: 'cancel' })).toBeInTheDocument();
    expect(getBuyButton()).toBeEnabled();
  });

  it('should complete the purchase process satisfactorily with discount and promocode', async () => {
    //Arrange
    const props = {
      canBuy: true,
      planId: '1',
      total: 1_000,
      paymentMethod: paymentType.transfer,
      promotion: {
        extraCredits: '100',
        promocode: 'fake promocode',
      },
      discount: {
        id: 1,
        description: 'fake description',
      },
    };
    const successRequest = true;
    const { purchaseMock, dependencies } = getFakePurchase(successRequest);
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/checkout/premium/subscribers?selected-plan=${props.planId}&${ACCOUNT_TYPE}=PAID`,
            ]}
          >
            <PlanPurchase {...props} />
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const getBuyButton = () =>
      screen.queryByRole('button', {
        name: 'checkoutProcessForm.purchase_summary.buy_button',
      });

    expect(getBuyButton()).toBeEnabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // simulate click to buy button
    await user.click(getBuyButton());
    expect(purchaseMock).toHaveBeenCalledTimes(1);
    expect(purchaseMock).toHaveBeenCalledWith({
      planId: props.planId,
      discountId: props.discount.id,
      total: props.total,
      promocode: props.promotion.promocode,
      originInbound: '', // because hasn't origin_inbound
    });

    expect(await screen.findByRole('alert', { name: 'success' })).toBeInTheDocument();
    expect(getBuyButton()).not.toBeEnabled();

    // simulate redirect to checkout summary
    jest.advanceTimersByTime(DELAY_BEFORE_REDIRECT_TO_SUMMARY);
    expect(window.location.href).toBe(
      `/checkout-summary?planId=${props.planId}&paymentMethod=${props.paymentMethod}&${ACCOUNT_TYPE}=PAID&discount=${props.discount.description}&extraCredits=${props.promotion.extraCredits}`,
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
    };

    const { purchaseMock, dependencies } = getFakePurchaseWithError(
      'Invalid selected plan. Only supports upselling.',
    );

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router initialEntries={[`/checkout/premium/subscribers?selected-plan=${props.planId}`]}>
            <PlanPurchase {...props} />
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const getBuyButton = () =>
      screen.queryByRole('button', {
        name: 'checkoutProcessForm.purchase_summary.buy_button',
      });

    expect(getBuyButton()).toBeEnabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // simulate click to buy button
    await userEvent.click(getBuyButton());
    expect(purchaseMock).toHaveBeenCalledTimes(1);
    expect(purchaseMock).toHaveBeenCalledWith({
      planId: props.planId,
      discountId: 0, // because hasn't discount
      total: props.total,
      promocode: '', // because hasn't promotion
      originInbound: '', // because hasn't origin_inbound
    });
    expect(await screen.findByRole('alert', { name: 'cancel' })).toBeInTheDocument();
    expect(
      await screen.findByText(
        'checkoutProcessForm.purchase_summary.error_only_supports_upselling_message',
      ),
    ).toBeInTheDocument();
    expect(getBuyButton()).toBeEnabled();
  });
});
