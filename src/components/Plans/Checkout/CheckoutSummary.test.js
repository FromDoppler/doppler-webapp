import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  fakePaymentMethodInformation,
  fakePaymentMethodInformationWithTransfer,
  fakeBillingInformation,
  fakeUserPlan,
} from '../../../services/doppler-billing-user-api-client.double';
import {
  fakeAccountPlanDiscounts,
  fakePromotion,
  fakePrepaidPlan,
} from '../../../services/doppler-account-plans-api-client.double';
import { CheckoutSummary } from './CheckoutSummary';
import { PLAN_TYPE } from '../../../doppler-types';

const dependencies = (
  dopplerAccountPlansApiClientDouble,
  dopplerBillingUserApiClientDouble,
  currentUser,
) => ({
  appSessionRef: {
    current: {
      userData: {
        user: currentUser,
      },
    },
  },
  dopplerBillingUserApiClient: dopplerBillingUserApiClientDouble,
  dopplerAccountPlansApiClient: dopplerAccountPlansApiClientDouble,
});

const currentUserFake = {
  email: 'hardcoded@email.com',
  plan: {
    planType: 'prepaid',
    planSubscription: 1,
    monthPlan: 1,
  },
};

const dopplerAccountPlansApiClientDoubleBase = {
  validatePromocode: async () => {
    return { success: true, value: fakePromotion };
  },
  getDiscountsData: async () => {
    return { success: true, value: fakeAccountPlanDiscounts };
  },
  getPlanData: async () => {
    return { success: true, value: fakePrepaidPlan };
  },
};

const dopplerBillingUserApiClientDoubleBase = {
  getPaymentMethodData: async () => {
    return { success: true, value: fakePaymentMethodInformation };
  },
  getBillingInformationData: async () => {
    return { success: true, value: fakeBillingInformation };
  },
  getCurrentUserPlanData: async () => {
    return { success: true, value: fakeUserPlan };
  },
};

const CheckoutSummaryElement = ({
  url,
  dopplerAccountPlansApiClientDouble,
  dopplerBillingUserApiClientDouble,
  currentUserFake,
}) => {
  const services = dependencies(
    dopplerAccountPlansApiClientDouble,
    dopplerBillingUserApiClientDouble,
    currentUserFake,
  );
  return (
    <MemoryRouter initialEntries={[url]}>
      <Route path="checkout-summary">
        <AppServicesProvider forcedServices={services}>
          <IntlProvider>
            <CheckoutSummary />
          </IntlProvider>
        </AppServicesProvider>
      </Route>
    </MemoryRouter>
  );
};

describe('CheckoutSummary component', () => {
  it('should show loading box while getting data', async () => {
    // Ac
    render(
      <CheckoutSummaryElement
        url="checkout-summary"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDoubleBase}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
        currentUserFake={currentUserFake}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);
  });

  it('should show the transfer message when the payment method is "Transfer"', async () => {
    //Arrange
    const currentUserFake = {
      email: 'hardcoded@email.com',
      plan: {
        planType: PLAN_TYPE.byCredit,
        planSubscription: 1,
        monthPlan: 1,
        remainingCredits: 5000,
        emailQty: 1500,
      },
    };

    const dopplerBillingUserApiClientDouble = {
      ...dopplerBillingUserApiClientDoubleBase,
      getPaymentMethodData: async () => {
        return { success: true, value: fakePaymentMethodInformationWithTransfer };
      },
    };

    // Ac
    render(
      <CheckoutSummaryElement
        url="checkout-summary?planId=1&paymentMethod=TRANSF"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDoubleBase}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDouble}
        currentUserFake={currentUserFake}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByText(`checkoutProcessSuccess.plan_type_${currentUserFake.plan.planType}`),
    ).toBeInTheDocument();
    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.plan_type_prepaid_promocode`),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(`checkoutProcessSuccess.flashcard_transfer_message`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`checkoutProcessSuccess.flashcard_transfer_note_1`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`checkoutProcessSuccess.flashcard_transfer_note_2`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`checkoutProcessSuccess.flashcard_transfer_note_3_ar`),
    ).toBeInTheDocument();
  });

  describe.each([
    [
      'without extra credits',
      {
        url: 'checkout-summary',
        dopplerAccountPlansApiClientDouble: {
          ...dopplerAccountPlansApiClientDoubleBase,
          getPlanData: async () => {
            return {
              success: true,
              value: fakePrepaidPlan,
            };
          },
        },
        showPromocodeSection: false,
      },
    ],
    [
      'with extra credits',
      {
        url: 'checkout-summary?extraCredits=2500',
        dopplerAccountPlansApiClientDouble: {
          ...dopplerAccountPlansApiClientDoubleBase,
          getPlanData: async () => {
            return {
              success: true,
              value: fakePrepaidPlan,
            };
          },
        },
        showPromocodeSection: true,
      },
    ],
  ])('should show the plan information when the getting data was succeed ', (testName, context) => {
    it(testName, async () => {
      //Arrange
      const currentUserFake = {
        email: 'hardcoded@email.com',
        plan: {
          planType: PLAN_TYPE.byCredit,
          planSubscription: 1,
          monthPlan: 1,
          remainingCredits: 5000,
          emailQty: 1500,
        },
      };

      // Ac
      render(
        <CheckoutSummaryElement
          url={context.url}
          dopplerAccountPlansApiClientDouble={context.dopplerAccountPlansApiClientDouble}
          dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
          currentUserFake={currentUserFake}
        />,
      );

      // Assert
      // Loader should disappear once request resolves
      const loader = screen.getByTestId('loading-box');
      await waitForElementToBeRemoved(loader);

      expect(
        screen.getByText(`checkoutProcessSuccess.plan_type_${currentUserFake.plan.planType}`),
      ).toBeInTheDocument();
      expect(screen.getByText(`1,500`)).toBeInTheDocument();

      if (context.showPromocodeSection) {
        expect(
          screen.queryByText(`checkoutProcessSuccess.plan_type_prepaid_promocode`),
        ).toBeInTheDocument();
      } else {
        expect(
          screen.queryByText(`checkoutProcessSuccess.plan_type_prepaid_promocode`),
        ).not.toBeInTheDocument();
      }
    });
  });
});
