import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';
import { PurchaseSummary } from './PurchaseSummary';
import { fakePaymentMethodInformation } from '../../../../services/doppler-billing-user-api-client.double';
import { fakeAccountPlanDiscounts } from '../../../../services/doppler-account-plans-api-client.double';
import { fakePlanAmountDetails } from '../../../..//services/doppler-account-plans-api-client';
import user from '@testing-library/user-event';

const dependencies = (dopplerAccountPlansApiClientDouble, dopplerBillingUserApiClientDouble) => ({
  dopplerBillingUserApiClient: dopplerBillingUserApiClientDouble,
  dopplerAccountPlansApiClient: dopplerAccountPlansApiClientDouble,
});

const dopplerAccountPlansApiClientDoubleBase = {
  getDiscountsData: async () => {
    return { success: true, value: fakeAccountPlanDiscounts };
  },
};

const dopplerBillingUserApiClientDoubleBase = {
  getPaymentMethodData: async () => {
    return { success: true, value: fakePaymentMethodInformation };
  },
};

const PurchaseSummaryElement = ({
  url,
  canBuy,
  dopplerAccountPlansApiClientDouble,
  dopplerBillingUserApiClientDouble,
}) => {
  const services = dependencies(
    dopplerAccountPlansApiClientDouble,
    dopplerBillingUserApiClientDouble,
  );
  return (
    <MemoryRouter initialEntries={[url]}>
      <Route path="checkout/:pathType/:planType?">
        <AppServicesProvider forcedServices={services}>
          <IntlProvider>
            <PurchaseSummary discountId={0} canBuy={canBuy} />
          </IntlProvider>
        </AppServicesProvider>
      </Route>
    </MemoryRouter>
  );
};

const fakeSubscribersPlan = {
  emailQty: 0,
  subscribersQty: 1500,
  fee: 55,
  type: 'Subscribers',
};

describe('PurchaseSummary component', () => {
  it('should show loading box while getting data', async () => {
    //Arrange
    const fakePlan = fakeSubscribersPlan;

    const dopplerAccountPlansApiClientDouble = {
      ...dopplerAccountPlansApiClientDoubleBase,
      getPlanData: async () => {
        return { success: true, value: fakePlan };
      },
      getPlanAmountDetailsData: async () => {
        return { success: true, value: fakePlanAmountDetails };
      },
    };

    // Ac
    render(
      <PurchaseSummaryElement
        url="checkout/standard/subscribers"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  describe.each([
    [
      'should show "Plan Standard - by contacts" when the planType is "subscribers"',
      'checkout/standard/subscribers',
      'subscribers',
    ],
    [
      'should show "Plan Standard - by emails" when the planType is "monthly"',
      'checkout/standard/monthly-deliveries',
      'monthly_deliveries',
    ],
    [
      'should show "Plan Standard - by credits" when the planType is "prepaid"',
      'checkout/standard/prepaid',
      'prepaid',
    ],
  ])('plan information', (testName, url, planType) => {
    it(testName, async () => {
      // Arrange
      const fakePlan = fakeSubscribersPlan;

      const dopplerAccountPlansApiClientDouble = {
        ...dopplerAccountPlansApiClientDoubleBase,
        getPlanData: async () => {
          return { success: true, value: fakePlan };
        },
        getPlanAmountDetailsData: async () => {
          return { success: true, value: fakePlanAmountDetails };
        },
      };

      // Act
      render(
        <PurchaseSummaryElement
          url={url}
          dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
          dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
        />,
      );

      // Assert
      // Loader should disappear once request resolves
      const loader = screen.getByTestId('wrapper-loading');
      await waitForElementToBeRemoved(loader);

      const title =
        'checkoutProcessForm.purchase_summary.plan_standard_title' +
        ' - ' +
        `checkoutProcessForm.purchase_summary.plan_type_${planType}`;
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(
        screen.getByText(`checkoutProcessForm.purchase_summary.plan_type_${planType}_label`),
      ).toBeInTheDocument();
    });
  });

  it('should show the "contacts", "fee" of the plan', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const dopplerAccountPlansApiClientDouble = {
      ...dopplerAccountPlansApiClientDoubleBase,
      getPlanData: async () => {
        return { success: true, value: fakePlan };
      },
      getPlanAmountDetailsData: async () => {
        return { success: true, value: fakePlanAmountDetails };
      },
    };

    // Act
    render(
      <PurchaseSummaryElement
        url="checkout/standard/subscribers"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByRole('listitem', { name: 'units' })).toHaveTextContent(1500);
    expect(screen.getByRole('listitem', { name: 'units' })).toHaveTextContent('US$ 55.00');
  });

  describe.each([
    ['should show the price for 1 month when the subscription is "Monthly"', 1, 'US$ 55.00'],
    ['should show the price for 3 months when the subscription is "Quaterly"', 2, 'US$ 165.00'],
    ['should show the price for 6 months when the subscription is "Half-Yearly"', 4, 'US$ 330.00'],
    ['should show the price for 12 months when the subscription is "Yearly"', 6, 'US$ 660.00'],
  ])('price by subscription', (testName, discountId, amount) => {
    it(testName, async () => {
      // Arrange
      const fakePlan = fakeSubscribersPlan;

      const dopplerAccountPlansApiClientDouble = {
        ...dopplerAccountPlansApiClientDoubleBase,
        getPlanData: async () => {
          return { success: true, value: fakePlan };
        },
        getPlanAmountDetailsData: async () => {
          return { success: true, value: fakePlanAmountDetails };
        },
      };

      // Act
      render(
        <PurchaseSummaryElement
          url={`checkout/standard/subscribers?discountId=${discountId}`}
          dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
          dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
        />,
      );

      // Assert
      // Loader should disappear once request resolves
      const loader = screen.getByTestId('wrapper-loading');
      await waitForElementToBeRemoved(loader);

      expect(screen.getByRole('listitem', { name: 'months to pay' })).toHaveTextContent(
        'checkoutProcessForm.purchase_summary.months_to_pay checkoutProcessForm.purchase_summary.month_with_plural',
      );
      expect(screen.getByRole('listitem', { name: 'months to pay' })).toHaveTextContent(amount);
    });
  });

  it('should not show the discount when the subscription is "Monthly"', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const dopplerAccountPlansApiClientDouble = {
      ...dopplerAccountPlansApiClientDoubleBase,
      getPlanData: async () => {
        return { success: true, value: fakePlan };
      },
      getPlanAmountDetailsData: async () => {
        return { success: true, value: fakePlanAmountDetails };
      },
    };

    // Act
    render(
      <PurchaseSummaryElement
        url="checkout/standard/subscribers?discountId=1"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.queryByText('checkoutProcessForm.purchase_summary.discount_for_prepayment'),
    ).not.toBeInTheDocument();
  });

  describe.each([
    [
      'the subscription is "Quaterly"',
      {
        fakePlanAmountDetails: {
          discountPrepayment: { discountPercentage: 5, amount: 8.25 },
          discountPaymentAlreadyPaid: 0,
          total: 229.5,
        },
        discountId: 2,
      },
    ],
    [
      'the subscription is "Half-Yearly"',
      {
        fakePlanAmountDetails: {
          discountPrepayment: { discountPercentage: 15, amount: 49.5 },
          discountPaymentAlreadyPaid: 0,
          total: 229.5,
        },
        discountId: 4,
      },
    ],
    [
      'the subscription is "Annual"',
      {
        fakePlanAmountDetails: {
          discountPrepayment: { discountPercentage: 25, amount: 165.0 },
          discountPaymentAlreadyPaid: 0,
          total: 229.5,
        },
        discountId: 6,
      },
    ],
  ])('should show the discount when', (testName, context) => {
    it(testName, async () => {
      // Arrange
      const fakePlan = fakeSubscribersPlan;
      const { discountId } = context;
      const { discountPercentage, amount } = context.fakePlanAmountDetails.discountPrepayment;

      const dopplerAccountPlansApiClientDouble = {
        ...dopplerAccountPlansApiClientDoubleBase,
        getPlanData: async () => {
          return { success: true, value: fakePlan };
        },
        getPlanAmountDetailsData: async () => {
          return { success: true, value: context.fakePlanAmountDetails };
        },
      };

      // Act
      render(
        <PurchaseSummaryElement
          url={`checkout/standard/subscribers?discountId=${discountId}`}
          dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
          dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
        />,
      );

      // Assert
      // Loader should disappear once request resolves
      const loader = screen.getByTestId('wrapper-loading');
      await waitForElementToBeRemoved(loader);

      const discount = screen.getByRole('listitem', { name: 'discount' });
      expect(discount).toHaveTextContent(
        `checkoutProcessForm.purchase_summary.discount_for_prepayment - ${discountPercentage}%`,
      );
      expect(discount).toHaveTextContent(`-US$ ${amount}`);
    });
  });

  it('should show the discount payment already paid', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const fakePlanAmountDetails = {
      discountPrepayment: { discountPercentage: 0, amount: 0 },
      discountPaymentAlreadyPaid: 100,
      total: 229.5,
    };

    const dopplerAccountPlansApiClientDouble = {
      ...dopplerAccountPlansApiClientDoubleBase,
      getPlanData: async () => {
        return { success: true, value: fakePlan };
      },
      getPlanAmountDetailsData: async () => {
        return { success: true, value: fakePlanAmountDetails };
      },
    };

    // Act
    render(
      <PurchaseSummaryElement
        url="checkout/standard/subscribers?discountId=6"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByText('checkoutProcessForm.purchase_summary.discount_for_payment_paid'),
    ).toBeInTheDocument();
    expect(screen.getByText('-US$ 100.00')).toBeInTheDocument();
  });

  it('should show the total with discount', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const fakePlanAmountDetails = {
      discountPrepayment: { discountPercentage: 25, amount: 165 },
      discountPaymentAlreadyPaid: 100,
      total: 229.5,
    };

    const dopplerAccountPlansApiClientDouble = {
      ...dopplerAccountPlansApiClientDoubleBase,
      getPlanData: async () => {
        return { success: true, value: fakePlan };
      },
      getPlanAmountDetailsData: async () => {
        return { success: true, value: fakePlanAmountDetails };
      },
    };
    // Act
    render(
      <PurchaseSummaryElement
        url="checkout/standard/subscribers?discountId=6"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByText('checkoutProcessForm.purchase_summary.total')).toBeInTheDocument();
    expect(screen.getByText('395.00')).toBeInTheDocument();
  });

  it('should show disabled the "buy" button when canBuy is false', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const fakePlanAmountDetails = {
      discountPrepayment: { discountPercentage: 25, amount: 165 },
      discountPaymentAlreadyPaid: 100,
      total: 229.5,
    };

    const dopplerAccountPlansApiClientDouble = {
      ...dopplerAccountPlansApiClientDoubleBase,
      getPlanData: async () => {
        return { success: true, value: fakePlan };
      },
      getPlanAmountDetailsData: async () => {
        return { success: true, value: fakePlanAmountDetails };
      },
    };

    // Act
    render(
      <PurchaseSummaryElement
        url="checkout/standard/subscribers?discountId=6"
        canBuy={false}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByRole('button', { name: 'checkoutProcessForm.purchase_summary.buy_button' }),
    ).toBeDisabled();
  });

  it('should show enabled the "buy" button when canBuy is true', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const fakePlanAmountDetails = {
      discountPrepayment: { discountPercentage: 25, amount: 165 },
      discountPaymentAlreadyPaid: 100,
      total: 229.5,
    };

    const dopplerAccountPlansApiClientDouble = {
      ...dopplerAccountPlansApiClientDoubleBase,
      getPlanData: async () => {
        return { success: true, value: fakePlan };
      },
      getPlanAmountDetailsData: async () => {
        return { success: true, value: fakePlanAmountDetails };
      },
    };

    // Act
    render(
      <PurchaseSummaryElement
        url="checkout/standard/subscribers?discountId=6"
        canBuy={true}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByRole('button', { name: 'checkoutProcessForm.purchase_summary.buy_button' }),
    ).not.toBeDisabled();
  });

  it('should show success message when the buy process was successfully', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const fakePlanAmountDetails = {
      discountPrepayment: { discountPercentage: 25, amount: 165 },
      discountPaymentAlreadyPaid: 100,
      total: 229.5,
    };

    const dopplerAccountPlansApiClientDouble = {
      ...dopplerAccountPlansApiClientDoubleBase,
      getPlanData: async () => {
        return { success: true, value: fakePlan };
      },
      getPlanAmountDetailsData: async () => {
        return { success: true, value: fakePlanAmountDetails };
      },
    };

    const dopplerBillingUserApiClientDouble = {
      ...dopplerBillingUserApiClientDoubleBase,
      purchase: async () => {
        return { success: true };
      },
    };

    // Act
    render(
      <PurchaseSummaryElement
        url="checkout/standard/subscribers?discountId=6"
        canBuy={true}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDouble}
      />,
    );

    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Assert
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.buy_button',
    });
    user.click(submitButton);
    expect(submitButton).toBeDisabled();

    const summarySuccessMessage = await screen.findByText(
      'checkoutProcessForm.purchase_summary.success_message',
    );

    expect(summarySuccessMessage).toBeInTheDocument();
  });

  it('should show error message when the buy process was failed', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const fakePlanAmountDetails = {
      discountPrepayment: { discountPercentage: 25, amount: 165 },
      discountPaymentAlreadyPaid: 100,
      total: 229.5,
    };

    const dopplerAccountPlansApiClientDouble = {
      ...dopplerAccountPlansApiClientDoubleBase,
      getPlanData: async () => {
        return { success: true, value: fakePlan };
      },
      getPlanAmountDetailsData: async () => {
        return { success: true, value: fakePlanAmountDetails };
      },
    };

    const dopplerBillingUserApiClientDouble = {
      ...dopplerBillingUserApiClientDoubleBase,
      purchase: async () => {
        return { success: false };
      },
    };

    // Act
    render(
      <PurchaseSummaryElement
        url="checkout/standard/subscribers?discountId=6"
        canBuy={true}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDouble}
      />,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.buy_button',
    });
    user.click(submitButton);
    expect(submitButton).toBeDisabled();

    const summaryErrorMessage = await screen.findByText(
      'checkoutProcessForm.purchase_summary.error_message',
    );

    expect(summaryErrorMessage).toBeInTheDocument();
  });
});
