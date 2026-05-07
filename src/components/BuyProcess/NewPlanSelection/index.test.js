import '@testing-library/jest-dom/extend-expect';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { PLAN_TYPE } from '../../../doppler-types';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider';
import { AppServicesProvider } from '../../../services/pure-di';
import { NewPlanSelection } from '.';

const contactPlans = [
  {
    type: PLAN_TYPE.byContact,
    id: 10222,
    name: '500-SUBSCRIBERS',
    subscriberLimit: 500,
    fee: 10,
    billingCycleDetails: [
      { id: 795, discountPercentage: 0, billingCycle: 'monthly', applyPromo: true },
      { id: 796, discountPercentage: 5, billingCycle: 'quarterly', applyPromo: false },
      { id: 797, discountPercentage: 15, billingCycle: 'half-yearly', applyPromo: false },
      { id: 798, discountPercentage: 25, billingCycle: 'yearly', applyPromo: false },
    ],
  },
  {
    type: PLAN_TYPE.byContact,
    id: 10223,
    name: '1500-SUBSCRIBERS',
    subscriberLimit: 1500,
    fee: 20,
    billingCycleDetails: [
      { id: 895, discountPercentage: 0, billingCycle: 'monthly', applyPromo: true },
      { id: 896, discountPercentage: 5, billingCycle: 'quarterly', applyPromo: false },
      { id: 897, discountPercentage: 15, billingCycle: 'half-yearly', applyPromo: false },
      { id: 898, discountPercentage: 25, billingCycle: 'yearly', applyPromo: false },
    ],
  },
];

const amountDetails = {
  success: true,
  value: {
    discountPrepayment: { discountPercentage: 0, amount: 0 },
    discountPaymentAlreadyPaid: 0,
    discountPromocode: { discountPercentage: 0, amount: 0, extraCredits: 0 },
    total: 10,
    currentMonthTotal: 10,
    nextMonthTotal: 10,
  },
};

const contactsLabelPattern = /Cu[aá]ntos Contactos tienes\?/i;
const textContentIncludes = (text) => (_content, node) => node?.textContent?.includes(text);

const createForcedServices = () => ({
  appSessionRef: {
    current: {
      userData: {
        user: {
          locationCountry: 'us',
          chat: { active: false },
          plan: {
            idPlan: 1,
            planType: PLAN_TYPE.free,
            isFreeAccount: true,
            planSubscription: 1,
          },
        },
      },
    },
  },
  dopplerAccountPlansApiClient: {
    getPlanBillingDetailsData: jest.fn(async () => amountDetails),
    validatePromocode: jest.fn(async () => ({
      success: true,
      value: {
        canApply: true,
        promotionApplied: { discountPercentage: 10, duration: 1 },
      },
    })),
  },
  planService: {
    getPlansByType: jest.fn(async () => contactPlans),
  },
});

const renderNewPlanSelection = async (initialEntries = ['/new-plan-selection']) => {
  const forcedServices = createForcedServices();

  render(
    <AppServicesProvider forcedServices={forcedServices}>
      <DopplerIntlProvider locale="es">
        <Router initialEntries={initialEntries}>
          <Routes>
            <Route path="/new-plan-selection" element={<NewPlanSelection />} />
          </Routes>
        </Router>
      </DopplerIntlProvider>
    </AppServicesProvider>,
  );

  await waitForElementToBeRemoved(screen.getByTestId('wrapper-loading'));

  return forcedServices;
};

describe('NewPlanSelection component', () => {
  it('should render section 1 controls without plan type tabs', async () => {
    await renderNewPlanSelection();

    expect(
      screen.getByRole('heading', {
        name: /Elige el Plan ideal para hacer crecer tu negocio/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Plan Contactos')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: contactsLabelPattern })).toHaveValue('0');
    expect(screen.getByRole('option', { name: 'Más de 100.000' })).toBeInTheDocument();
    expect(screen.getByText('Suscripción')).toBeInTheDocument();
    expect(screen.getAllByText('Código de descuento').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Elegir Plan' })).toBeInTheDocument();
    expect(screen.queryByText('Tipo de plan')).not.toBeInTheDocument();
  });

  it('should update selected plan in checkout URL when contacts dropdown changes', async () => {
    await renderNewPlanSelection();

    fireEvent.change(screen.getByRole('combobox', { name: contactsLabelPattern }), {
      target: { value: '1' },
    });

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Elegir Plan' }).getAttribute('href')).toContain(
        'selected-plan=10223',
      ),
    );
  });

  it('should show monthly discounted price and selected discount in checkout URL', async () => {
    await renderNewPlanSelection();

    fireEvent.click(screen.getByRole('button', { name: /Anual/i }));

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Elegir Plan' }).getAttribute('href')).toBe(
        '/checkout/premium/subscribers?selected-plan=10222&discountId=798',
      ),
    );

    expect(screen.getAllByText(textContentIncludes('US$7,50/mes*')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(textContentIncludes('US$10/mes')).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(textContentIncludes('Ahorras 25% realizando 1 pago anual de US$90'))
        .length,
    ).toBeGreaterThan(0);
  });

  it('should show tailored price and advisor CTA for more than 100k option', async () => {
    await renderNewPlanSelection();

    fireEvent.change(screen.getByRole('combobox', { name: contactsLabelPattern }), {
      target: { value: 'more-than-100000' },
    });

    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: contactsLabelPattern })).toHaveValue(
        'more-than-100000',
      ),
    );

    const infoBanner = screen.getByTestId('dp-more-than-100k-message');
    expect(infoBanner).toBeInTheDocument();
    expect(within(infoBanner).getByText(/base supera los 100k de Contactos/i)).toBeInTheDocument();
    expect(
      within(infoBanner).getByRole('link', { name: /cont[aá]ctanos|contact us/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByText(textContentIncludes('A medida*')).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Contactar a Asesor' }).getAttribute('href')).toContain(
      '/upgrade-suggestion-form',
    );
    expect(screen.queryByRole('link', { name: 'Elegir Plan' })).not.toBeInTheDocument();
  });
});
