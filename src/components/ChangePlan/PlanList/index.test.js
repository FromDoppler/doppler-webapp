import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlanList } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PlanList component', () => {
  it('should render PlanList component', () => {
    // Act
    render(
      <IntlProvider>
        <PlanList />
      </IntlProvider>,
    );

    // Assert
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveTextContent('change_plan.show_features');
    userEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('change_plan.hide_features');
  });
});
