import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { PLAN_TYPE } from '../../../doppler-types';
import {
  fakeAccountPlanDiscounts,
  fakePlan,
} from '../../../services/doppler-account-plans-api-client.double';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPacksSelection } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import '@testing-library/jest-dom/extend-expect';

describe('LandingPacksSelection component', () => {
  it('should render LandingPacksSelection component', async () => {
    // Arrange
    const selectedPlan = 1;

    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              addOnPromotions: [],
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.byContact,
              },
            },
            features: {
              landingsEditorEnabled: true,
            },
          },
        },
      },
      dopplerAccountPlansApiClient: {
        getPlanData: async (selectedPlan) => ({ success: true, value: fakePlan }),
        getDiscountsData: async () => ({ success: true, value: fakeAccountPlanDiscounts }),
        getLandingPacks: (async) => ({ success: false, value: [] }),
      },
    };
    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router initialEntries={[`/landing-packages?buyType=3`]}>
            <Routes>
              <Route path="/landing-packages" element={<LandingPacksSelection />} />
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
