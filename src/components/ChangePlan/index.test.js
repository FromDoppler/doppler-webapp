import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { ChangePlan } from '.';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('ChangePlan component', () => {
  it('should render ChangePlan component', async () => {
    // Act
    render(
      <Router>
        <IntlProvider>
          <ChangePlan />
        </IntlProvider>
      </Router>,
    );

    // Assert
    expect(screen.queryByRole('heading', { name: 'change_plan.title' })).not.toBeInTheDocument();

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByRole('heading', { name: 'change_plan.title' })).toBeInTheDocument();
  });
});
