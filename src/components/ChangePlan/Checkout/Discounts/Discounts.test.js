import { Discounts } from './Discounts';
import { fakeAccountPlanDiscounts } from '../../../../services/doppler-account-plans-api-client.double';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

const mockedhandleChange = jest.fn();

const DiscountsElement = ({ discountsList, sessionPlan, selectedPlanDiscount, disabled }) => (
  <IntlProvider>
    <Discounts
      discountsList={discountsList}
      sessionPlan={sessionPlan}
      selectedPlanDiscount={selectedPlanDiscount}
      disabled={disabled}
      handleChange={mockedhandleChange}
    />
  </IntlProvider>
);

describe('Discount component', () => {
  it('should show discount message when subscription is quarterly or higher', async () => {
    // Arrange
    const fakeSessionPlan = {
      idPlan: 42,
      planSubscription: 6,
    };

    // Act
    render(
      <DiscountsElement discountsList={fakeAccountPlanDiscounts} sessionPlan={fakeSessionPlan} />,
    );

    // Assert
    expect(
      screen.getByText('checkoutProcessForm.discount_subscription_half_yearly'),
    ).toBeInTheDocument();
    expect(screen.queryByText('checkoutProcessForm.discount_title')).toBeNull();
  });

  it('should show discount element when selected plan has discounts and user has monthly subscription', async () => {
    // Arrange
    const fakeSessionPlan = {
      idPlan: 42,
      planSubscription: 1,
    };

    // Act
    render(
      <DiscountsElement discountsList={fakeAccountPlanDiscounts} sessionPlan={fakeSessionPlan} />,
    );

    // Assert
    expect(screen.getByText('checkoutProcessForm.discount_title')).not.toBeNull();
  });

  it('should not show discount element when selected plan has not discounts', async () => {
    // Arrange
    const fakeSessionPlan = {
      idPlan: 42,
      planSubscription: 1,
    };

    const fakeEmptyPlanDiscounts = [];

    // Act
    render(
      <DiscountsElement discountsList={fakeEmptyPlanDiscounts} sessionPlan={fakeSessionPlan} />,
    );

    // Assert
    expect(screen.queryByText('checkoutProcessForm.discount_title')).toBeNull();
  });

  it("should show monthly discount element selected as default when the user doesn't select any subscription", async () => {
    // Arrange
    const fakeSessionPlan = {
      idPlan: 42,
      planSubscription: 1,
    };

    const selectedDiscount = undefined;

    // Act
    render(
      <DiscountsElement
        discountsList={fakeAccountPlanDiscounts}
        sessionPlan={fakeSessionPlan}
        selectedPlanDiscount={selectedDiscount}
      />,
    );

    // Assert
    expect(
      screen.getByRole('button', { name: 'checkoutProcessForm.discount_monthly' }).className,
    ).toContain('btn-active');
    expect(screen.getByText('checkoutProcessForm.discount_title')).not.toBeNull();
  });

  it('should show monthly discount element selected when the user select monthly subscription', async () => {
    // Arrange
    const fakeSessionPlan = {
      idPlan: 42,
      planSubscription: 1,
    };

    const selectedDiscount = {
      id: 1,
    };

    // Act
    render(
      <DiscountsElement
        discountsList={fakeAccountPlanDiscounts}
        sessionPlan={fakeSessionPlan}
        selectedPlanDiscount={selectedDiscount}
      />,
    );

    // Assert
    expect(
      screen.getByRole('button', { name: 'checkoutProcessForm.discount_monthly' }).className,
    ).toContain('btn-active');
    expect(screen.getByText('checkoutProcessForm.discount_title')).not.toBeNull();
  });

  it('should show quarterly discount element selected when the user select quarterly subscription', async () => {
    // Arrange
    const fakeSessionPlan = {
      idPlan: 42,
      planSubscription: 1,
    };

    const selectedDiscount = {
      id: 2,
    };

    // Act
    render(
      <DiscountsElement
        discountsList={fakeAccountPlanDiscounts}
        sessionPlan={fakeSessionPlan}
        selectedPlanDiscount={selectedDiscount}
      />,
    );

    // Assert
    expect(
      screen.getByRole('button', { name: 'checkoutProcessForm.discount_quarterly' }).className,
    ).toContain('btn-active');
    expect(screen.getByText('checkoutProcessForm.discount_title')).not.toBeNull();
  });

  it('should show half-yearly discount element selected when the user select half-yearly subscription', async () => {
    // Arrange
    const fakeSessionPlan = {
      idPlan: 42,
      planSubscription: 1,
    };

    const selectedDiscount = {
      id: 4,
    };

    // Act
    render(
      <DiscountsElement
        discountsList={fakeAccountPlanDiscounts}
        sessionPlan={fakeSessionPlan}
        selectedPlanDiscount={selectedDiscount}
      />,
    );

    // Assert
    expect(
      screen.getByRole('button', { name: 'checkoutProcessForm.discount_half_yearly' }).className,
    ).toContain('btn-active');
    expect(screen.getByText('checkoutProcessForm.discount_title')).not.toBeNull();
  });

  it('should show yearly discount element selected when the user select yearly subscription', async () => {
    // Arrange
    const fakeSessionPlan = {
      idPlan: 42,
      planSubscription: 1,
    };

    const selectedDiscount = {
      id: 6,
    };

    // Act
    render(
      <DiscountsElement
        discountsList={fakeAccountPlanDiscounts}
        sessionPlan={fakeSessionPlan}
        selectedPlanDiscount={selectedDiscount}
      />,
    );

    // Assert
    expect(
      screen.getByRole('button', { name: 'checkoutProcessForm.discount_yearly' }).className,
    ).toContain('btn-active');
    expect(screen.getByText('checkoutProcessForm.discount_title')).not.toBeNull();
  });
});
