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
          planTypes.map((planType) => ({ type: planType, minPrice: 5 })),
        getPlansByType: async () => plansByContacts,
      },
    };
    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router
            initialEntries={[`/buy-process/primer-pantalla/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`]}
          >
            <Routes>
              <Route path="/buy-process/primer-pantalla/:planType" element={<PlanSelection />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    screen.getByText('buy_process.plan_selection.plan_title');
  });
});
