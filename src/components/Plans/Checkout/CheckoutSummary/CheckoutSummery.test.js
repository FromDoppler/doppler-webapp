import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { PLAN_TYPE } from '../../../../doppler-types';
import { CheckoutSummary } from './CheckoutSummary';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

describe('CheckoutSummury component', () => {
  it('should render CheckoutSummury component', async () => {
    // Arrange
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.free,
              },
              chat: {
                plan: {
                  buttonUrl: '',
                },
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
      dopplerBillingUserApiClient: {
        getBillingInformationData: async (selectedPlan) => ({ success: true, value: [] }),
        getCurrentUserPlanDataByType: async (type) => ({
          success: true,
          value: { planType: PLAN_TYPE.byContact },
        }),
      },
    };
    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router initialEntries={[`/checkout-summary?buyType=4`]}>
            <Routes>
              <Route path="/checkout-summary" element={<CheckoutSummary />} />
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
