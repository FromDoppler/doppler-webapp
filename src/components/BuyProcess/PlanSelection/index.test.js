import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { PlanSelection } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { MemoryRouter as Router } from 'react-router-dom';

describe('PlanSelection component', () => {
  it('should render PlanSelection component', async () => {
    // Act
    render(
      <IntlProvider>
        <Router>
          <PlanSelection />
        </Router>
      </IntlProvider>,
    );

    // Assert
    screen.getByText('buy_process.plan_selection.plan_title');
  });
});
