import { render, screen } from '@testing-library/react';
import { CompleteSteps } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import '@testing-library/jest-dom/extend-expect';

describe('CompleteSteps', () => {
  it('should render CompleteSteps component when loading = true', async () => {
    // Act
    render(
      <IntlProvider>
        <CompleteSteps loading={true} onClick={null} />
      </IntlProvider>,
    );

    // Assert
    screen.getByTestId('loading-box');
    screen.getByText('dashboard.first_steps.completed_message');
  });

  it('should render CompleteSteps component when loading = false', async () => {
    // Act
    render(
      <IntlProvider>
        <CompleteSteps loading={false} onClick={null} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByTestId('loading-box')).not.toBeInTheDocument();
    screen.getByText('dashboard.first_steps.completed_message');
  });
});
