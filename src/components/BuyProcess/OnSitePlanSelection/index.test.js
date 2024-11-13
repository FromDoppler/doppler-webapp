import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { PLAN_TYPE } from '../../../doppler-types';
import {
  fakeAccountPlanDiscounts,
  fakePlan,
} from '../../../services/doppler-account-plans-api-client.double';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { OnSitePlansSelection } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import '@testing-library/jest-dom/extend-expect';

describe('OnSitePlansSelection component', () => {
  it('should render OnSitePlansSelection component', async () => {
    // Arrange
    const selectedPlan = 1;

    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.free,
              },
              onSite: {
                plan: {
                  idPlan: 3,
                  printQty: 500,
                },
              },
            },
          },
        },
      },
      dopplerAccountPlansApiClient: {
        getPlanData: async (selectedPlan) => ({ success: true, value: fakePlan }),
        getDiscountsData: async () => ({ success: true, value: fakeAccountPlanDiscounts }),
      },
    };
    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router initialEntries={[`/buy-onsite-plans?buyType=4`]}>
            <Routes>
              <Route path="/buy-onsite-plans" element={<OnSitePlansSelection />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });
});
