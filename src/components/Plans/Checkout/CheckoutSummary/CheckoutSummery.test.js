import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { PLAN_TYPE } from '../../../../doppler-types';
import { CheckoutSummary } from './CheckoutSummary';
import IntlProvider from '../../../../i18n/DopplerIntlProvider';
import { AppServicesProvider } from '../../../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

describe('CheckoutSummury component', () => {
  const renderCheckoutSummary = async (planType, quantity) => {
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
          value: {
            planType,
            emailQty: quantity,
            subscribersQty: quantity,
            remainingCredits: 0,
          },
        }),
      },
    };

    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider locale="es">
          <Router initialEntries={[`/checkout-summary?buyType=1&discount=yearly`]}>
            <Routes>
              <Route path="/checkout-summary" element={<CheckoutSummary />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  };

  it('should render CheckoutSummury component for contacts plans', async () => {
    await renderCheckoutSummary(PLAN_TYPE.byContact, 500);

    expect(screen.getByText('Detalle')).toBeInTheDocument();
    expect(screen.getByText('Plan Contactos')).toBeInTheDocument();
    expect(screen.getByText('Cantidad')).toBeInTheDocument();
    expect(screen.getByText('500 Contactos')).toBeInTheDocument();
    expect(screen.getByText('Facturación')).toBeInTheDocument();
    expect(screen.getByText('Anual')).toBeInTheDocument();
  });

  it('should render CheckoutSummury component for email plans', async () => {
    await renderCheckoutSummary(PLAN_TYPE.byEmail, 500);

    expect(screen.getByText('Detalle')).toBeInTheDocument();
    expect(screen.getByText('Plan Envíos')).toBeInTheDocument();
    expect(screen.getByText('Cantidad')).toBeInTheDocument();
    expect(screen.getByText('500 Envíos')).toBeInTheDocument();
    expect(screen.getByText('Facturación')).toBeInTheDocument();
    expect(screen.getByText('Mensual')).toBeInTheDocument();
  });

  it('should render CheckoutSummury component for credit plans', async () => {
    await renderCheckoutSummary(PLAN_TYPE.byCredit, 100000);

    expect(screen.getByText('Detalle')).toBeInTheDocument();
    expect(screen.getByText('Por Créditos')).toBeInTheDocument();
    expect(screen.getByText('Cantidad')).toBeInTheDocument();
    expect(screen.getByText('100.000 Créditos')).toBeInTheDocument();
    expect(screen.getByText('Facturación')).toBeInTheDocument();
    expect(screen.getByText('Pago único')).toBeInTheDocument();
  });
});
