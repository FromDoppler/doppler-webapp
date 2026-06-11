import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { PLAN_TYPE } from '../../../../doppler-types';
import { CheckoutSummary } from './CheckoutSummary';
import IntlProvider from '../../../../i18n/DopplerIntlProvider';
import IntlProviderWithIds from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import DopplerIntlProvider from '../../../../i18n/DopplerIntlProvider';
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
        getBillingInformationData: async () => ({ success: true, value: [] }),
        getCurrentUserPlanDataByType: async () => ({
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

  const renderCheckoutSummaryWithAddOns = async () => {
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            features: {
              landingsEditorEnabled: true,
              ecoIAEnabled: true,
            },
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
        getBillingInformationData: async () => ({ success: true, value: [] }),
        getCurrentUserPlanDataByType: async () => ({
          success: true,
          value: {
            planType: PLAN_TYPE.byContact,
            emailQty: 500,
            subscribersQty: 500,
            remainingCredits: 0,
          },
        }),
      },
      dopplerAccountPlansApiClient: {
        getAddOnPlans: jest.fn(async () => ({
          success: true,
          value: [{ fee: 10 }],
        })),
        getLandingPacks: jest.fn(async () => ({
          success: true,
          value: [{ price: 20 }],
        })),
      },
    };

    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProviderWithIds locale="es">
          <Router initialEntries={[`/checkout-summary?buyType=1&discount=yearly`]}>
            <Routes>
              <Route path="/checkout-summary" element={<CheckoutSummary />} />
            </Routes>
          </Router>
        </IntlProviderWithIds>
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

  it('should render new transfer details variant for Argentina in checkout summary', async () => {
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            features: {
              landingsEditorEnabled: false,
            },
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.free,
                upgradePending: true,
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
        getBillingInformationData: async () => ({
          success: true,
          value: { country: 'ar' },
        }),
        getCurrentUserPlanDataByType: async () => ({
          success: true,
          value: {
            planType: PLAN_TYPE.byContact,
            remainingCredits: 0,
            subscribersQty: 5000,
          },
        }),
      },
    };

    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <DopplerIntlProvider locale="es">
          <Router
            initialEntries={[`/checkout-summary?buyType=1&paymentMethod=TRANSF&discount=monthly`]}
          >
            <Routes>
              <Route path="/checkout-summary" element={<CheckoutSummary />} />
            </Routes>
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByTestId('dp-new-transfer-details')).toBeInTheDocument();
    expect(
      screen.getAllByText((_, node) => {
        const text = node?.textContent ?? '';
        return (
          text.includes('Completa el pago de') &&
          text.includes('(ARS)') &&
          text.includes('realizando un depósito o transferencia')
        );
      }),
    ).not.toHaveLength(0);
    expect(screen.getByText('BBVA BANCO FRANCES S.A.')).toBeInTheDocument();
    expect(screen.getByText(/Una vez que realices el pago/i)).toBeInTheDocument();
    expect(
      screen.getAllByText((_, node) => node?.textContent?.includes('Cuando confirmemos')),
    ).not.toHaveLength(0);
    expect(
      screen.getByText(/Mientras tanto, te invitamos a continuar explorando tu cuenta/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'billing@fromdoppler.com' })).toHaveAttribute(
      'href',
      'mailto:billing@fromdoppler.com',
    );
  });

  it('should keep legacy transfer summary for Mexico in checkout summary', async () => {
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            features: {
              landingsEditorEnabled: false,
            },
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.free,
                upgradePending: true,
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
        getBillingInformationData: async () => ({
          success: true,
          value: { country: 'mx' },
        }),
        getCurrentUserPlanDataByType: async () => ({
          success: true,
          value: {
            planType: PLAN_TYPE.byContact,
            remainingCredits: 0,
            subscribersQty: 5000,
          },
        }),
      },
    };

    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <DopplerIntlProvider locale="es">
          <Router
            initialEntries={[`/checkout-summary?buyType=1&paymentMethod=TRANSF&discount=monthly`]}
          >
            <Routes>
              <Route path="/checkout-summary" element={<CheckoutSummary />} />
            </Routes>
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.queryByTestId('dp-new-transfer-details')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /Revisa tu correo, y dentro de las proximas 24 horas h[aá]biles recibir[aá]s la factura/i,
      ),
    ).toBeInTheDocument();
  });
});
