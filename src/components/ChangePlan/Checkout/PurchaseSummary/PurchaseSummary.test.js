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

    // Acn
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

  it('should show "Plan Standard - by contacts" when the planType is "subscribers"', async () => {
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

    expect(
      screen.getByText(
        'checkoutProcessForm.purchase_summary.plan_standard_title' +
          ' - ' +
          'checkoutProcessForm.purchase_summary.plan_type_subscribers',
      ),
    ).not.toBeNull();
    expect(
      screen.getByText('checkoutProcessForm.purchase_summary.plan_type_subscribers_label'),
    ).not.toBeNull();
  });

  it('should show "Plan Standard - by emails" when the planType is "monthly"', async () => {
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
        url="checkout/standard/monthly-deliveries"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByText(
        'checkoutProcessForm.purchase_summary.plan_standard_title' +
          ' - ' +
          'checkoutProcessForm.purchase_summary.plan_type_monthly_deliveries',
      ),
    ).not.toBeNull();
    expect(
      screen.getByText('checkoutProcessForm.purchase_summary.plan_type_monthly_deliveries_label'),
    ).not.toBeNull();
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

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) =>
          node.textContent ===
          'checkoutProcessForm.purchase_summary.plan_type_subscribers_label 1500';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === 'US$ 55.00';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();
  });

  it('should show the price for 1 month when the subscription is "Monthly"', async () => {
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
      screen.getByText((content, node) => {
        const hasText = (node) =>
          node.textContent ===
          'checkoutProcessForm.purchase_summary.months_to_pay checkoutProcessForm.purchase_summary.month_with_plural';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();

    expect(
      screen.getAllByText((content, node) => {
        const hasText = (node) => node.textContent === 'US$ 55.00';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }).length,
    ).toEqual(2);
  });

  it('should show the price for 3 months when the subscription is "Quaterly"', async () => {
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
        url="checkout/standard/subscribers?discountId=2"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) =>
          node.textContent ===
          'checkoutProcessForm.purchase_summary.months_to_pay checkoutProcessForm.purchase_summary.month_with_plural';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === 'US$ 165.00';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();
  });

  it('should show the price for 6 months when the subscription is "Half-Yearly"', async () => {
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
        url="checkout/standard/subscribers?discountId=4"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) =>
          node.textContent ===
          'checkoutProcessForm.purchase_summary.months_to_pay checkoutProcessForm.purchase_summary.month_with_plural';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === 'US$ 330.00';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();
  });

  it('should show the price for 12 months when the subscription is "Yearly"', async () => {
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
      screen.getByText((content, node) => {
        const hasText = (node) =>
          node.textContent ===
          'checkoutProcessForm.purchase_summary.months_to_pay checkoutProcessForm.purchase_summary.month_with_plural';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === 'US$ 660.00';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();
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
      screen.queryByText((content, node) => {
        const hasText = (node) =>
          node.textContent === 'checkoutProcessForm.purchase_summary.discount_for_prepayment';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).toBeNull();
  });

  it('should show the discount when the subscription is "Quaterly"', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const fakePlanAmountDetails = {
      discountPrepayment: { discountPercentage: 5, amount: 8.25 },
      discountPaymentAlreadyPaid: 0,
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
        url="checkout/standard/subscribers?discountId=2"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) =>
          node.textContent === 'checkoutProcessForm.purchase_summary.discount_for_prepayment - 5%';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === '-US$ 8.25';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();
  });

  it('should show the discount when the subscription is "Half-Yearly"', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const fakePlanAmountDetails = {
      discountPrepayment: { discountPercentage: 15, amount: 49.5 },
      discountPaymentAlreadyPaid: 0,
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
        url="checkout/standard/subscribers?discountId=4"
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        dopplerBillingUserApiClientDouble={dopplerBillingUserApiClientDoubleBase}
      />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) =>
          node.textContent === 'checkoutProcessForm.purchase_summary.discount_for_prepayment - 15%';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === '-US$ 49.50';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();
  });

  it('should show the discount when the subscription is "Annual"', async () => {
    // Arrange
    const fakePlan = fakeSubscribersPlan;

    const fakePlanAmountDetails = {
      discountPrepayment: { discountPercentage: 25, amount: 165 },
      discountPaymentAlreadyPaid: 0,
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
      screen.getByText((content, node) => {
        const hasText = (node) =>
          node.textContent === 'checkoutProcessForm.purchase_summary.discount_for_prepayment - 25%';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === '-US$ 165.00';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();
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
      screen.getByText((content, node) => {
        const hasText = (node) =>
          node.textContent === 'checkoutProcessForm.purchase_summary.discount_for_payment_paid';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === '-US$ 100.00';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();
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

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === 'checkoutProcessForm.purchase_summary.total';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();

    expect(
      screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === ' US$ 395.00';
        const nodeHasText = hasText(node);
        return nodeHasText;
      }),
    ).not.toBeNull();
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

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.buy_button',
    });

    //console.log(submitButton);
    user.click(submitButton);

    // Assert
    expect(submitButton).toBeDisabled();

    const summarySuccessMessage = await screen.findByText(
      'checkoutProcessForm.purchase_summary.success_message',
    );

    expect(summarySuccessMessage).not.toBeNull();
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

    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.buy_button',
    });

    //console.log(submitButton);
    user.click(submitButton);

    // Assert
    expect(submitButton).toBeDisabled();

    const summaryErrorMessage = await screen.findByText(
      'checkoutProcessForm.purchase_summary.error_message',
    );

    expect(summaryErrorMessage).not.toBeNull();
  });
});
