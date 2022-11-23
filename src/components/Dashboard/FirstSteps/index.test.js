import { getByText, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { fakeSystemUsageSummary } from '../../../services/dashboardService/SystemUsageSummary.double';
import { FirstSteps } from '.';
import { mapSystemUsageSummary } from '../reducers/firstStepsReducer';

describe('FirstSteps component', () => {
  it('should render FirstSteps component when is loading', async () => {
    // Arrange
    const firstStepsData = mapSystemUsageSummary(fakeSystemUsageSummary);
    const loading = true;
    const hasError = null;
    const firstSteps = firstStepsData.firstSteps;

    // Act
    render(
      <IntlProvider>
        <FirstSteps loading={loading} hasError={hasError} firstSteps={firstSteps} />
      </IntlProvider>,
    );

    // Assert
    screen.getByTestId('loading-box');

    const allSteps = screen.getAllByRole('alert', { name: 'step' });
    firstSteps.forEach((step, index) => {
      const node = allSteps[index];
      expect(getByText(node, step.titleId)).toBeInTheDocument();
    });
  });

  it('should render FirstSteps component when is not loading', async () => {
    // Arrange
    const firstStepsData = mapSystemUsageSummary(fakeSystemUsageSummary);
    const loading = false;
    const hasError = null;
    const firstSteps = firstStepsData.firstSteps;

    // Act
    render(
      <IntlProvider>
        <FirstSteps loading={loading} hasError={hasError} firstSteps={firstSteps} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByTestId('loading-box')).not.toBeInTheDocument();

    const allSteps = screen.getAllByRole('alert', { name: 'step' });
    firstSteps.forEach((step, index) => {
      const node = allSteps[index];
      expect(getByText(node, step.titleId)).toBeInTheDocument();
    });
  });

  it('should render unexpected error', async () => {
    // Arrange
    const firstStepsData = {};
    const loading = false;
    const hasError = 'something wrong!';
    const firstSteps = firstStepsData.firstSteps;

    // Act
    render(
      <IntlProvider>
        <FirstSteps loading={loading} hasError={hasError} firstSteps={firstSteps} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByTestId('loading-box')).not.toBeInTheDocument();

    // because first steps is not visible
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    // should render unexpected error because the request fail
    screen.getByTestId('unexpected-error');
  });
});
