import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { PlanSelection } from '.';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { AppServicesProvider } from '../../../services/pure-di';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../doppler-types';
import { allPlans } from '../../../services/doppler-legacy-client.doubles';

const plansByContacts = allPlans.filter((plan) => plan.type === PLAN_TYPE.byContact);

describe('PlanSelection component', () => {
  it('should render PlanSelection component', async () => {
    // Arrange
    const planTypes = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit];
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.free,
              },
            },
          },
        },
      },
      planService: {
        getDistinctPlans: async () =>
          planTypes.map((planType) => ({
            type: planType,
            minPrice: 5,
            info: 'buy_process.plan_selection.plan_type_monthly_deliveries_info',
          })),
        getPlansByType: async () => plansByContacts,
      },
      dopplerLegacyClient: {
        sendTrackUpgradeIntention: jest.fn(async () => true),
      },
    };
    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router
            initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`]}
          >
            <Routes>
              <Route path="/plan-selection/premium/:planType" element={<PlanSelection />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
    expect(forcedServices.dopplerLegacyClient.sendTrackUpgradeIntention).toHaveBeenCalledTimes(1);
  });

  it('should not track upgrade intention when the new plan selection is enabled', async () => {
    // Arrange
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            features: { newPlanSelectionEnabled: true },
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.free,
              },
            },
          },
        },
      },
      planService: {
        getDistinctPlans: async () => [],
        getPlansByType: async () => [],
      },
      dopplerLegacyClient: {
        sendTrackUpgradeIntention: jest.fn(async () => true),
      },
    };
    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router
            initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`]}
          >
            <Routes>
              <Route path="/plan-selection/premium/:planType" element={<PlanSelection />} />
              <Route path="/new-plan-selection" element={<span>new plan selection</span>} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    await screen.findByText('new plan selection');
    expect(forcedServices.dopplerLegacyClient.sendTrackUpgradeIntention).not.toHaveBeenCalled();
  });
});
