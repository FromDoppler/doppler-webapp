import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { PlanBenefits } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PlanBenefits compoment', () => {
  it(`should render PlanBenefits`, async () => {
    // Arrange
    const selectedPlan = { additionalPrint: 1 };

    // Act
    render(
      <IntlProvider>
        <PlanBenefits selectedPlan={selectedPlan} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('onsite_selection.plan_benefits.title');
    screen.getByText('onsite_selection.plan_benefits.additional_costs.additional_print_message');
  });
});
