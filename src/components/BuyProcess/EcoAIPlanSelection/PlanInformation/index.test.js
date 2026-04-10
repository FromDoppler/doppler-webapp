import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { PlanInformation } from '.';

describe('PlanInformation', () => {
  it('should render PlanInformation', async () => {
    // Act
    render(
      <IntlProvider>
        <PlanInformation />
      </IntlProvider>,
    );

    // Assert
    screen.getByText('eco_ai_selection.eco_ai_plan_info.legend');
    screen.getByText('eco_ai_selection.eco_ai_plan_info.section_1.title');
    screen.getByText('eco_ai_selection.eco_ai_plan_info.section_1.legend');
    screen.getByText('eco_ai_selection.eco_ai_plan_info.section_2.title');
    screen.getByText('eco_ai_selection.eco_ai_plan_info.section_2.legend');
  });
});
