import { BrowserRouter } from 'react-router-dom';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { EcoAIPlan } from '.';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

const JSDOM_NAVIGATION_WARNING = /Not implemented: navigation \(except hash changes\)/i;

describe('EcoAIPlan component', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    const originalConsoleError = console.error;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (typeof args[0] === 'string' && JSDOM_NAVIGATION_WARNING.test(args[0])) {
        return;
      }

      originalConsoleError(...args);
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render component', async () => {
    // Assert
    var ecoAiPlan = {
      active: true,
      additional: 0,
      trialExpired: false,
    };

    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              addOnPromotions: [],
              plan: {
                isFreeAccount: false,
                planType: 'subscribers',
                maxSubscribers: 500,
                itemDescription: 'subscribers',
                remainingCredits: 500,
                planSubscription: 1,
              },
            },
          },
        },
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <BrowserRouter>
          <IntlProvider>
            <EcoAIPlan addOnPromotions={[]} ecoAiPlan={ecoAiPlan} isFreeAccount={false} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.subscription_details.addon.eco_ai_plan.title'),
    ).toBeInTheDocument();
  });

  it('should render component - with trial expired', async () => {
    // Assert
    var ecoAiPlan = {
      active: true,
      additional: 0,
      trialExpired: true,
    };

    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              addOnPromotions: [],
              plan: {
                isFreeAccount: false,
                planType: 'subscribers',
                maxSubscribers: 500,
                itemDescription: 'subscribers',
                remainingCredits: 500,
                planSubscription: 1,
              },
            },
          },
        },
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <BrowserRouter>
          <IntlProvider>
            <EcoAIPlan addOnPromotions={[]} ecoAiPlan={ecoAiPlan} isFreeAccount={false} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.subscription_details.addon.eco_ai_plan.title'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('my_plan.subscription_details.addon_plan_expired_message'),
    ).toBeInTheDocument();
  });

  it('should render component - with free plan', async () => {
    // Assert
    var ecoAiPlan = {
      active: true,
      fee: 0,
      trialExpired: false,
    };

    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              addOnPromotions: [],
              plan: {
                isFreeAccount: false,
                planType: 'subscribers',
                maxSubscribers: 500,
                itemDescription: 'subscribers',
                remainingCredits: 500,
                planSubscription: 1,
              },
            },
          },
        },
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <BrowserRouter>
          <IntlProvider>
            <EcoAIPlan addOnPromotions={[]} ecoAiPlan={ecoAiPlan} isFreeAccount={false} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.subscription_details.addon.eco_ai_plan.title'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('my_plan.subscription_details.addon.eco_ai_plan.free_label'),
    ).toBeInTheDocument();
  });

  it('should render component - simulate cancel plan', async () => {
    // Assert
    var ecoAiPlan = {
      active: true,
      fee: 10,
      trialExpired: false,
    };

    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              addOnPromotions: [],
              plan: {
                isFreeAccount: false,
                planType: 'subscribers',
                maxSubscribers: 500,
                itemDescription: 'subscribers',
                remainingCredits: 500,
                planSubscription: 1,
              },
            },
          },
        },
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <BrowserRouter>
          <IntlProvider>
            <EcoAIPlan addOnPromotions={[]} ecoAiPlan={ecoAiPlan} isFreeAccount={false} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    const getCancelButton = () =>
      screen.queryByRole('button', {
        name: 'cancel-plan',
      });

    expect(getCancelButton()).toBeEnabled();
  });
});
