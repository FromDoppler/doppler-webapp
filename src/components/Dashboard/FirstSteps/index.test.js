import { getByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { FirstSteps, mapSystemUsageSummary } from '.';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { fakeSystemUsageSummary } from '../../../services/dashboardService/SystemUsageSummary.double';
import { AppServicesProvider } from '../../../services/pure-di';

const systemUsageSummaryDouble = () => ({
  getSystemUsageSummaryData: async () => ({
    success: true,
    value: fakeSystemUsageSummary,
  }),
});

describe('FirstSteps component', () => {
  it('should render FirstSteps component', async () => {
    // Arrange
    const firstStepsData = mapSystemUsageSummary(fakeSystemUsageSummary);

    // Act
    render(
      <AppServicesProvider forcedServices={{ systemUsageSummary: systemUsageSummaryDouble() }}>
        <IntlProvider>
          <FirstSteps />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    const firstSteps = firstStepsData.firstSteps;
    const allSteps = screen.getAllByRole('alert', { name: 'step' });
    firstSteps.forEach((step, index) => {
      const node = allSteps[index];
      expect(getByText(node, step.titleId)).toBeInTheDocument();
    });
  });

  it('should render unexpected error', async () => {
    // Act
    render(
      <AppServicesProvider
        forcedServices={{
          systemUsageSummary: {
            getSystemUsageSummaryData: async () => ({
              success: false,
              error: 'something wrong!',
            }),
          },
        }}
      >
        <IntlProvider>
          <FirstSteps />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    // because first steps is not visible
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    // should render unexpected error because the request fail
    screen.getByTestId('unexpected-error');
  });
});
