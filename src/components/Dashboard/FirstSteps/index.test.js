import {
  getByRole,
  getByText,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
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

const dopplerSystemUsageApiClientDouble = () => ({
  getUserSystemUsage: async () => ({
    success: true,
    value: {
      email: 'mail@makingsense.com',
      reportsSectionLastVisit: null,
    },
  }),
});

describe('FirstSteps component', () => {
  it('should render FirstSteps component', async () => {
    // Arrange
    const firstStepsData = mapSystemUsageSummary(fakeSystemUsageSummary);

    // Act
    render(
      <AppServicesProvider
        forcedServices={{
          systemUsageSummary: systemUsageSummaryDouble(),
          dopplerSystemUsageApiClient: dopplerSystemUsageApiClientDouble(),
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

    const firstSteps = firstStepsData.firstSteps;
    const allSteps = screen.getAllByRole('alert', { name: 'step' });
    firstSteps.forEach((step, index) => {
      const node = allSteps[index];
      expect(getByText(node, step.titleId)).toBeInTheDocument();
    });
  });

  it('should mark step 4 as not completed when user has not visited the reports section', async () => {
    // Arrange
    const forcedServices = {
      systemUsageSummary: {
        getSystemUsageSummaryData: async () => ({
          success: true,
          value: {
            hasListsCreated: true,
            hasDomainsReady: true,
            hasCampaingsCreated: true,
            hasCampaingsSent: true,
          },
        }),
      },
      dopplerSystemUsageApiClient: {
        getUserSystemUsage: async () => ({
          success: true,
          value: {
            email: 'mail@makingsense.com',
            reportsSectionLastVisit: null,
          },
        }),
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <FirstSteps />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    const allSteps = screen.getAllByRole('alert', { name: 'step' });

    // get last step
    const lastStepNode = allSteps.slice(-1)[0];
    const lastStep = getByRole(lastStepNode, 'heading', {
      level: 4,
      name: 'dashboard.first_steps.has_campaings_sent_title',
    });
    // the last step is incomplete (the step is not crossed)
    expect(lastStep).not.toHaveClass('dp-crossed-text');
  });

  it('should mark step 4 as completed when user has visited the reports section', async () => {
    // Arrange
    const forcedServices = {
      systemUsageSummary: {
        getSystemUsageSummaryData: async () => ({
          success: true,
          value: {
            hasListsCreated: true,
            hasDomainsReady: true,
            hasCampaingsCreated: true,
            hasCampaingsSent: true,
          },
        }),
      },
      dopplerSystemUsageApiClient: {
        getUserSystemUsage: async () => ({
          success: true,
          value: {
            email: 'mail@makingsense.com',
            reportsSectionLastVisit: '2022-10-25T13:39:34.707Z',
          },
        }),
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <FirstSteps />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    const allSteps = screen.getAllByRole('alert', { name: 'step' });

    // get last step
    const lastStepNode = allSteps.slice(-1)[0];
    const lastStep = getByRole(lastStepNode, 'heading', {
      level: 4,
      name: 'dashboard.first_steps.has_campaings_sent_title',
    });
    // the last step is completed (the step is crossed)
    expect(lastStep).toHaveClass('dp-crossed-text');
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
