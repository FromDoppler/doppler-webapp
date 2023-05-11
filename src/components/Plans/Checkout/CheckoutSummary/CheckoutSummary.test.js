import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  fakePaymentMethodInformation,
  fakePaymentMethodInformationWithTransfer,
  fakeBillingInformation,
  fakeUserPlan,
} from '../../../../services/doppler-billing-user-api-client.double';
import {
  fakeAccountPlanDiscounts,
  fakePromotion,
  fakePrepaidPlan,
} from '../../../../services/doppler-account-plans-api-client.double';
import { CheckoutSummary } from './CheckoutSummary';
import { PLAN_TYPE } from '../../../../doppler-types';

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
    upgradePendig: true,
  },
};

const userPlanByEmailFake = {
  idPlan: 1,
  planSubscription: 0,
  planType: PLAN_TYPE.byEmail,
  remainingCredits: 69542,
  emailQty: 1500,
  subscribersQty: null,
};

const userPlanByCreditsFake = {
  idPlan: 1,
  planSubscription: 0,
  planType: PLAN_TYPE.byCredit,
  remainingCredits: 69542,
  emailQty: 1500,
  subscribersQty: null,
};

const userPlanByContactFake = {
  idPlan: 1,
  planSubscription: 0,
  planType: PLAN_TYPE.byContact,
  remainingCredits: 69542,
  emailQty: 1500,
  subscribersQty: null,
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
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route path="/checkout-summary" element={<CheckoutSummary />} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('CheckoutSummary component', () => {
  it('should show loading box while getting data', async () => {
    // Ac
    render(
      <CheckoutSummaryElement
        url="/checkout-summary"
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
        url="/checkout-summary?planId=1&paymentMethod=TRANSF"
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
  });

  describe.each([
    [
      'without extra credits',
      {
        url: '/checkout-summary',
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
        url: '/checkout-summary?extraCredits=2500',
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

  it('should not show the transfer message when the payment method is "Transfer" and promocode of the 100% discount ', async () => {
    //Arrange
    const currentUserFake = {
      email: 'hardcoded@email.com',
      plan: {
        planType: PLAN_TYPE.byCredit,
        planSubscription: 1,
        monthPlan: 1,
        remainingCredits: 5000,
        emailQty: 1500,
        upgradePendig: false,
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
        url="/checkout-summary?planId=1&paymentMethod=TRANSF&discountPromocode=100"
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
    expect(screen.queryByText(`checkoutProcessSuccess.transfer_steps_title`)).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_check_email_with_invoice_message`),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_pay_the_invoice_message`),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_send_the_receipt_message`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.transfer_confirmation_message`),
    ).not.toBeInTheDocument();
  });

  it('should not show the mercado pago message when the payment method is "Mercado Pago" and promocode of the 100% discount ', async () => {
    //Arrange
    const currentUserFake = {
      email: 'hardcoded@email.com',
      plan: {
        planType: PLAN_TYPE.byCredit,
        planSubscription: 1,
        monthPlan: 1,
        remainingCredits: 5000,
        emailQty: 1500,
        upgradePendig: false,
      },
    };

    const dopplerBillingUserApiClientDouble = {
      ...dopplerBillingUserApiClientDoubleBase,
      getPaymentMethodData: async () => {
        return {
          success: true,
          value: {
            ...fakePaymentMethod,
            identificationNumber: '12345678',
          },
        };
      },
    };

    // Ac
    render(
      <CheckoutSummaryElement
        url="/checkout-summary?planId=1&paymentMethod=MP&discountPromocode=100"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDoubleBase}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDouble}
        currentUserFake={currentUserFake}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    screen.getByText(`checkoutProcessSuccess.plan_type_${currentUserFake.plan.planType}`);
    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.plan_type_prepaid_promocode`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(`checkoutProcessSuccess.mercado_pago_warning_message`),
    ).not.toBeInTheDocument();
  });

  it('should show the transfer message when the payment method is "Transfer" with promocode smaller than 100%', async () => {
    //Arrange
    const currentUserFake = {
      email: 'hardcoded@email.com',
      plan: {
        planType: PLAN_TYPE.byCredit,
        planSubscription: 1,
        monthPlan: 1,
        remainingCredits: 5000,
        emailQty: 1500,
        upgradePending: true,
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
        url="/checkout-summary?planId=1&paymentMethod=TRANSF&discountPromocode=50"
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

    expect(screen.getByText(`checkoutProcessSuccess.transfer_steps_title`)).toBeInTheDocument();
    expect(
      screen.getByText(`checkoutProcessSuccess.transfer_check_email_with_invoice_message`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`checkoutProcessSuccess.transfer_pay_the_invoice_message`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`checkoutProcessSuccess.transfer_send_the_receipt_message`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`checkoutProcessSuccess.transfer_confirmation_message`),
    ).toBeInTheDocument();
  });

  it('should show the mercado pago message when the payment method is "Mercado Pago" with promocode smaller than 100%', async () => {
    //Arrange
    const currentUserFake = {
      email: 'hardcoded@email.com',
      plan: {
        planType: PLAN_TYPE.byCredit,
        planSubscription: 1,
        monthPlan: 1,
        remainingCredits: 5000,
        emailQty: 1500,
        upgradePending: true,
      },
    };

    const dopplerBillingUserApiClientDouble = {
      ...dopplerBillingUserApiClientDoubleBase,
      getPaymentMethodData: async () => {
        return {
          success: true,
          value: {
            ...fakePaymentMethod,
            identificationNumber: '12345678',
          },
        };
      },
    };

    // Ac
    render(
      <CheckoutSummaryElement
        url="/checkout-summary?planId=1&paymentMethod=MP&discountPromocode=50"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDoubleBase}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDouble}
        currentUserFake={currentUserFake}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    screen.getByText(`checkoutProcessSuccess.plan_type_${currentUserFake.plan.planType}`);
    screen.getByText('1,500');
    expect(
      screen.queryByText(`checkoutProcessSuccess.plan_type_prepaid_promocode`),
    ).not.toBeInTheDocument();

    screen.getByText(`checkoutProcessSuccess.mercado_pago_warning_message`);
  });

  describe.each([
    [
      '1 month renovation message when the plan is contacts and discount is for 1 month',
      {
        url: '/checkout-summary?planId=1&paymentMethod=CC&discount=monthly',
        dopplerBillingUserApiClientDouble: {
          ...dopplerBillingUserApiClientDoubleBase,
          getCurrentUserPlanData: async () => {
            return { success: true, value: userPlanByContactFake };
          },
        },
        message: `checkoutProcessSuccess.discount_monthly`,
      },
    ],
    [
      '1 month renovation message when the plan is emails',
      {
        url: '/checkout-summary?planId=1&paymentMethod=CC',
        dopplerBillingUserApiClientDouble: {
          ...dopplerBillingUserApiClientDoubleBase,
          getCurrentUserPlanData: async () => {
            return { success: true, value: userPlanByEmailFake };
          },
        },
        message: `checkoutProcessSuccess.plan_type_monthly_deliveries_monthly_renovation`,
      },
    ],
    [
      'no expiration message when the plan is credits',
      {
        url: '/checkout-summary?planId=1&paymentMethod=CC',
        dopplerBillingUserApiClientDouble: {
          ...dopplerBillingUserApiClientDoubleBase,
          getCurrentUserPlanData: async () => {
            return { success: true, value: userPlanByCreditsFake };
          },
        },
        message: `checkoutProcessSuccess.plan_type_prepaid_no_expiration`,
      },
    ],
  ])('should show the renovation message ', (testName, context) => {
    it(testName, async () => {
      // Ac
      render(
        <CheckoutSummaryElement
          url={context.url}
          dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDoubleBase}
          dopplerBillingUserApiClientDouble={context.dopplerBillingUserApiClientDouble}
          currentUserFake={currentUserFake}
        />,
      );

      // Assert
      // Loader should disappear once request resolves
      const loader = screen.getByTestId('loading-box');
      await waitForElementToBeRemoved(loader);

      screen.getByText(context.message);
    });
  });
});
