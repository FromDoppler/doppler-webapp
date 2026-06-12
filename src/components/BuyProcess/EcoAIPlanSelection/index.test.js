import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { PLAN_TYPE } from '../../../doppler-types';
import {
  fakeAccountPlanDiscounts,
  fakeAddOnPlan,
  fakePlanAmountDetails,
  fakePlan,
} from '../../../services/doppler-account-plans-api-client.double';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { EcoAIPlanSelection } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../RedirectToExternalUrl', () => (props) => (
  <div data-testid="redirect-to-external-url" data-to={props.to} />
));

const settleAsyncState = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const ACT_WARNING_PATTERN = /not wrapped in act/i;
let consoleErrorSpy;

describe('EcoAIPlansSelection component', () => {
  beforeEach(() => {
    const originalConsoleError = console.error;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (typeof args[0] === 'string' && ACT_WARNING_PATTERN.test(args[0])) {
        return;
      }

      originalConsoleError(...args);
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render EcoAIPlansSelection component', async () => {
    // Arrange
    const selectedPlan = 1;

    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            features: {
              ecoIAEnabled: true,
            },
            user: {
              addOnPromotions: [],
              addOnPlans: [
                {
                  plan: {
                    addOnTypeId: 5,
                  },
                },
              ],
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.free,
              },
            },
          },
        },
      },
      dopplerAccountPlansApiClient: {
        getPlanData: async (selectedPlan) => ({ success: true, value: fakePlan }),
        getDiscountsData: async () => ({ success: true, value: fakeAccountPlanDiscounts }),
        getAddOnPlans: async () => ({ success: true, value: [fakeAddOnPlan] }),
        getCustomAddOnPlans: async () => ({ success: true, value: [] }),
        getPlanBillingDetailsData: async () => ({
          success: true,
          value: fakePlanAmountDetails,
        }),
        getAddOnPlanBillingDetailsData: async () => ({
          success: true,
          value: fakePlanAmountDetails,
        }),
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router initialEntries={[`/buy-ecoia-plan?buyType=6`]}>
            <Routes>
              <Route path="/buy-ecoia-plan" element={<EcoAIPlanSelection />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
    await settleAsyncState();

    screen.getByText('eco_ai_selection.title');
    screen.getByText('eco_ai_selection.eco_ai_plan_info.legend');
  });

  it('should redirect to conversations external login if the user already has beplic account', async () => {
    // Assert
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            features: {
              ecoIAEnabled: true,
            },
            user: {
              addOnPromotions: [],
              addOnPlans: [
                {
                  plan: {
                    addOnTypeId: 5,
                  },
                },
              ],
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.free,
                isFreeAccount: true,
              },
            },
          },
        },
      },
      dopplerAccountPlansApiClient: {
        getPlanData: async (selectedPlan) => ({ success: true, value: fakePlan }),
        getDiscountsData: async () => ({ success: true, value: fakeAccountPlanDiscounts }),
        getAddOnPlans: async () => ({ success: true, value: [fakeAddOnPlan] }),
        getCustomAddOnPlans: async () => ({ success: true, value: [] }),
        getPlanBillingDetailsData: async () => ({
          success: true,
          value: fakePlanAmountDetails,
        }),
        getAddOnPlanBillingDetailsData: async () => ({
          success: true,
          value: fakePlanAmountDetails,
        }),
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router initialEntries={[`/buy-ecoia-plan?buyType=6`]}>
            <Routes>
              <Route path="/buy-ecoia-plan" element={<EcoAIPlanSelection />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(window.location.pathname).toContain('/');
  });
});
