import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { PricePerExtraEmail } from '.';
import { PLAN_TYPE } from '../../../../../doppler-types';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PricePerExtraEmail', () => {
  it('should render price per email when plan type is by email or by credit', () => {
    // Arrange
    const selectedPlan = {
      type: PLAN_TYPE.byEmail,
      fee: 30,
      extraEmailPrice: 1,
    };

    // Act
    render(
      <IntlProvider>
        <PricePerExtraEmail selectedPlan={selectedPlan} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByText('plan_calculator.cost_per_email')).toBeInTheDocument();
    expect(screen.getByText(/1.00000/i)).toBeInTheDocument();
  });

  it('should return a empty component when plan type is by contact', () => {
    // Arrange
    const selectedPlan = {
      type: PLAN_TYPE.byContact,
      price: 30,
    };

    // Act
    render(
      <IntlProvider>
        <PricePerExtraEmail selectedPlan={selectedPlan} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByText('plan_calculator.cost_per_email')).not.toBeInTheDocument();
  });
});
