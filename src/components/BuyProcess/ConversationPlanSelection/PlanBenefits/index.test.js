import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { PlanBenefits } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PlanBenefits compoment', () => {
  it(`should render PlanBenefits`, async () => {
    // Arrange
    const selectedPlan = { additionalConversation: 1, additionalAgent: 1, additionalChannel: 1 };

    // Act
    render(
      <IntlProvider>
        <PlanBenefits selectedPlan={selectedPlan} />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('chat_selection.plan_benefits.title');
    screen.getByText('chat_selection.plan_benefits.website_chat_message');
    screen.getAllByText('chat_selection.plan_benefits.included_all_plans_message');
  });
});
