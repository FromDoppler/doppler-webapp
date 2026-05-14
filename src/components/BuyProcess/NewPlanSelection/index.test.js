import '@testing-library/jest-dom/extend-expect';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const creditPlans = [
  {
    type: PLAN_TYPE.byCredit,
    id: 20222,
    name: '10000-CREDITS',
    credits: 10000,
    price: 80,
  },
  {
    type: PLAN_TYPE.byCredit,
    id: 20223,
    name: '20000-CREDITS',
    credits: 20000,
    price: 140,
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

const amountDetailsWithPromocode = {
  success: true,
  value: {
    discountPrepayment: { discountPercentage: 0, amount: 0 },
    discountPaymentAlreadyPaid: 0,
    discountPromocode: { discountPercentage: 10, amount: 1, duration: 3, extraCredits: 0 },
    total: 9,
    currentMonthTotal: 9,
    nextMonthTotal: 9,
  },
};

const amountDetailsWithPromocodeNoDuration = {
  success: true,
  value: {
    discountPrepayment: { discountPercentage: 0, amount: 0 },
    discountPaymentAlreadyPaid: 0,
    discountPromocode: { discountPercentage: 10, amount: 1, duration: 0, extraCredits: 0 },
    total: 9,
    currentMonthTotal: 9,
    nextMonthTotal: 9,
  },
};

const creditsAmountDetails = {
  success: true,
  value: {
    discountPrepayment: { discountPercentage: 0, amount: 0 },
    discountPaymentAlreadyPaid: 0,
    discountPromocode: { discountPercentage: 0, amount: 0, extraCredits: 0 },
    total: 80,
    currentMonthTotal: 80,
    nextMonthTotal: 80,
  },
};

const creditsAmountDetailsWithDiscount = {
  success: true,
  value: {
    discountPrepayment: { discountPercentage: 0, amount: 0 },
    discountPaymentAlreadyPaid: 0,
    discountPromocode: { discountPercentage: 10, amount: 8, extraCredits: 0 },
    total: 72,
    currentMonthTotal: 72,
    nextMonthTotal: 72,
  },
};

const creditsAmountDetailsWithExtraCredits = {
  success: true,
  value: {
    discountPrepayment: { discountPercentage: 0, amount: 0 },
    discountPaymentAlreadyPaid: 0,
    discountPromocode: { discountPercentage: 0, amount: 0, extraCredits: 5000 },
    total: 80,
    currentMonthTotal: 80,
    nextMonthTotal: 80,
  },
};

const creditsAmountDetailsWithDiscountAndExtraCredits = {
  success: true,
  value: {
    discountPrepayment: { discountPercentage: 0, amount: 0 },
    discountPaymentAlreadyPaid: 0,
    discountPromocode: { discountPercentage: 10, amount: 8, extraCredits: 5000 },
    total: 72,
    currentMonthTotal: 72,
    nextMonthTotal: 72,
  },
};

const contactsLabelPattern = /cu[aá]ntos contactos tienes\?/i;
const creditsLabelPattern = /cu[aá]ntos cr[eé]ditos necesitas\?/i;
const textContentIncludes = (text) => (_content, node) => node?.textContent?.includes(text);
const settleAsyncState = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};
const ACT_WARNING_PATTERN = /not wrapped in act/i;

let consoleErrorSpy;

const getContactsPlanSection = () => screen.getByTestId('dp-contacts-plan');
const getCreditsPlanSection = () => screen.getByTestId('dp-credits-plan');

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
    getPlanBillingDetailsData: jest.fn(async (planId, _planGroup, _discountId, promocode) => {
      const isCreditPlan = planId === creditPlans[0].id || planId === creditPlans[1].id;
      if (isCreditPlan) {
        return promocode ? creditsAmountDetailsWithDiscount : creditsAmountDetails;
      }

      return promocode ? amountDetailsWithPromocode : amountDetails;
    }),
    validatePromocode: jest.fn(async (planId) => ({
      success: true,
      value:
        planId === creditPlans[0].id || planId === creditPlans[1].id
          ? { canApply: true, promotionApplied: { discountPercentage: 10, extraCredits: 0 } }
          : { canApply: true, promotionApplied: { discountPercentage: 10, duration: 3 } },
    })),
  },
  planService: {
    getPlansByType: jest.fn(async (planType) => {
      if (planType === PLAN_TYPE.byContact) {
        return contactPlans;
      }

      if (planType === PLAN_TYPE.byCredit) {
        return creditPlans;
      }

      return [];
    }),
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
  await settleAsyncState();

  return forcedServices;
};

describe('NewPlanSelection component', () => {
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

  it('should render section controls without plan type tabs', async () => {
    await renderNewPlanSelection();

    expect(
      screen.getByRole('heading', {
        name: /elige el plan ideal para hacer crecer tu negocio/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Plan Contactos/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('combobox', { name: contactsLabelPattern })).toHaveValue('0');
    expect(screen.getByRole('option', { name: /m[aá]s de 100.000/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Suscripci[oó]n/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/C[oó]digo de descuento/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Elegir Plan/i })).toBeInTheDocument();
    expect(screen.queryByText(/tipo de plan/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('dp-sticky-plan-summary')).toBeInTheDocument();
    expect(screen.getByText(/Comprar Ahora/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ver m[aá]s funcionalidades/i })).toBeInTheDocument();

    expect(
      within(getCreditsPlanSection()).getByRole('heading', {
        name: /Compra Cr[eé]ditos y usalos cuando quieras/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: creditsLabelPattern })).toHaveValue('0');
    expect(screen.getByRole('link', { name: /Comprar Cr[eé]ditos/i })).toBeInTheDocument();
  });

  it('should open and close included features modal', async () => {
    const user = userEvent.setup();
    await renderNewPlanSelection();

    await user.click(screen.getByRole('button', { name: /Ver m[aá]s funcionalidades/i }));

    expect(screen.getByText(/Funcionalidades y Soluciones/i)).toBeInTheDocument();
    expect(screen.getByText(/Carrito Abandonado/i)).toBeInTheDocument();

    await user.click(screen.getByTestId('modal-close'));

    await waitFor(() =>
      expect(screen.queryByText(/Funcionalidades y Soluciones/i)).not.toBeInTheDocument(),
    );
  });

  it('should prepopulate contacts promocode input when Promo-code query param is present', async () => {
    await renderNewPlanSelection(['/new-plan-selection?Promo-code=DOPPLER50X6']);

    await waitFor(() =>
      expect(within(getContactsPlanSection()).getByRole('textbox')).toHaveValue('DOPPLER50X6'),
    );
  });

  it('should load REACT_APP_PROMOCODE_CONTACTS automatically for free accounts when URL has no promocode', async () => {
    const previousContactsPromocode = process.env.REACT_APP_PROMOCODE_CONTACTS;
    process.env.REACT_APP_PROMOCODE_CONTACTS = 'DOPPLER50X6';
    try {
      await renderNewPlanSelection(['/new-plan-selection']);

      await waitFor(() =>
        expect(within(getContactsPlanSection()).getByRole('textbox')).toHaveValue('DOPPLER50X6'),
      );
    } finally {
      process.env.REACT_APP_PROMOCODE_CONTACTS = previousContactsPromocode;
    }
  });

  it('should not reapply default promocode after removing it from contacts input', async () => {
    const user = userEvent.setup();
    await renderNewPlanSelection(['/new-plan-selection?Promo-code=DOPPLER50X6']);

    await waitFor(() =>
      expect(within(getContactsPlanSection()).getByRole('textbox')).toHaveValue('DOPPLER50X6'),
    );

    await user.click(within(getContactsPlanSection()).getByRole('button', { name: /borrar/i }));
    await settleAsyncState();

    await waitFor(() => {
      const choosePlanHref = screen.getByRole('link', { name: 'Elegir Plan' }).getAttribute('href');
      expect(choosePlanHref).not.toContain('promo-code=');
      expect(choosePlanHref).not.toContain('Promo-code=');
      expect(choosePlanHref).not.toContain('PromoCode=');
    });

    fireEvent.change(screen.getByRole('combobox', { name: contactsLabelPattern }), {
      target: { value: '1' },
    });
    await settleAsyncState();

    await waitFor(() => {
      const choosePlanHref = screen.getByRole('link', { name: 'Elegir Plan' }).getAttribute('href');
      expect(choosePlanHref).not.toContain('promo-code=');
      expect(choosePlanHref).not.toContain('Promo-code=');
      expect(choosePlanHref).not.toContain('PromoCode=');
    });
  });

  it('should update selected contacts plan in checkout URL when contacts dropdown changes', async () => {
    await renderNewPlanSelection();

    fireEvent.change(screen.getByRole('combobox', { name: contactsLabelPattern }), {
      target: { value: '1' },
    });
    await settleAsyncState();

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Elegir Plan' }).getAttribute('href')).toContain(
        'selected-plan=10223',
      ),
    );
    expect(screen.getByText(/Hasta 1\.500 Contactos \+ Envios ilimitados/i)).toBeInTheDocument();
  });

  it('should update selected credits plan in checkout URL when credits dropdown changes', async () => {
    await renderNewPlanSelection();

    fireEvent.change(screen.getByRole('combobox', { name: creditsLabelPattern }), {
      target: { value: '1' },
    });
    await settleAsyncState();

    await waitFor(() =>
      expect(
        within(getCreditsPlanSection())
          .getByRole('link', { name: /Comprar Cr[eé]ditos/i })
          .getAttribute('href'),
      ).toBe(`/checkout/premium/${PLAN_TYPE.byCredit}?selected-plan=20223`),
    );
  });

  it('should show monthly discounted price and selected discount in contacts checkout URL', async () => {
    await renderNewPlanSelection();

    fireEvent.click(within(getContactsPlanSection()).getByRole('button', { name: /Anual/i }));
    await settleAsyncState();

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Elegir Plan' }).getAttribute('href')).toBe(
        '/checkout/premium/subscribers?selected-plan=10222&discountId=798&monthPlan=12',
      ),
    );
    expect(screen.getByText(/US\$7,50\/mes/i)).toBeInTheDocument();

    expect(screen.getAllByText(textContentIncludes('US$7,50/mes*')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(textContentIncludes('US$10/mes')).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(textContentIncludes('Ahorras 25% realizando 1 pago anual de US$90'))
        .length,
    ).toBeGreaterThan(0);
    expect(
      within(screen.getByTestId('dp-sticky-plan-summary')).getAllByText(
        textContentIncludes('Facturación Anual 25%OFF | 1 Pago anual de US$90'),
      ).length,
    ).toBeGreaterThan(0);
  });

  it('should show tailored price and advisor CTA for more than 100k option', async () => {
    await renderNewPlanSelection();

    fireEvent.change(screen.getByRole('combobox', { name: contactsLabelPattern }), {
      target: { value: 'more-than-100000' },
    });
    await settleAsyncState();

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
    expect(screen.getByText(/Plan Envios Personalizado/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Consultar con Doppler Team' })).toHaveAttribute(
      'href',
      '/upgrade-suggestion-form',
    );
    expect(screen.queryByRole('link', { name: 'Elegir Plan' })).not.toBeInTheDocument();
  });

  it('should keep sticky CTA URL synchronized with contacts plan CTA URL', async () => {
    await renderNewPlanSelection();

    fireEvent.click(within(getContactsPlanSection()).getByRole('button', { name: /Anual/i }));
    await settleAsyncState();

    await waitFor(() => {
      const choosePlanHref = screen.getByRole('link', { name: 'Elegir Plan' }).getAttribute('href');
      const stickyCtaHref = screen
        .getByRole('link', { name: 'Comprar Ahora' })
        .getAttribute('href');
      expect(stickyCtaHref).toBe(choosePlanHref);
    });
  });

  it('should apply valid promocode discount in contacts price section with duration', async () => {
    const forcedServices = await renderNewPlanSelection();

    fireEvent.change(within(getContactsPlanSection()).getByRole('textbox'), {
      target: { value: 'PROMO50%' },
    });
    fireEvent.click(within(getContactsPlanSection()).getByRole('button', { name: 'Aplicar' }));
    await settleAsyncState();

    await waitFor(() =>
      expect(forcedServices.dopplerAccountPlansApiClient.validatePromocode).toHaveBeenCalled(),
    );

    await waitFor(() =>
      expect(
        screen.getAllByText(textContentIncludes('Ahorras 10% durante 3 meses')).length,
      ).toBeGreaterThan(0),
    );
    expect(screen.getAllByText(textContentIncludes('US$9/mes')).length).toBeGreaterThan(0);

    expect(screen.getAllByText(textContentIncludes('US$9/mes*')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(textContentIncludes('US$10/mes')).length).toBeGreaterThan(0);
    expect(
      within(screen.getByTestId('dp-sticky-plan-summary')).getAllByText(
        textContentIncludes('Descuento 10% OFF por 3 meses'),
      ).length,
    ).toBeGreaterThan(0);
  });

  it('should hide promocode months in sticky when duration is 0', async () => {
    const forcedServices = await renderNewPlanSelection();

    forcedServices.dopplerAccountPlansApiClient.validatePromocode.mockResolvedValueOnce({
      success: true,
      value: {
        canApply: true,
        promotionApplied: { discountPercentage: 10, duration: 0 },
      },
    });

    forcedServices.dopplerAccountPlansApiClient.getPlanBillingDetailsData.mockImplementation(
      async (planId, _planGroup, _discountId, promocode) => {
        const isCreditPlan = planId === creditPlans[0].id || planId === creditPlans[1].id;
        if (isCreditPlan) {
          return promocode ? creditsAmountDetailsWithDiscount : creditsAmountDetails;
        }

        return promocode ? amountDetailsWithPromocodeNoDuration : amountDetails;
      },
    );

    fireEvent.change(within(getContactsPlanSection()).getByRole('textbox'), {
      target: { value: 'PROMO50%' },
    });
    fireEvent.click(within(getContactsPlanSection()).getByRole('button', { name: 'Aplicar' }));
    await settleAsyncState();

    await waitFor(() =>
      expect(
        within(screen.getByTestId('dp-sticky-plan-summary')).getByText(/Descuento 10% OFF/i),
      ).toBeInTheDocument(),
    );

    expect(
      within(screen.getByTestId('dp-sticky-plan-summary')).queryByText(/por.*mes/i),
    ).not.toBeInTheDocument();
  });

  it('should apply valid promocode discount in credits price section', async () => {
    const forcedServices = await renderNewPlanSelection();

    fireEvent.change(within(getCreditsPlanSection()).getByRole('textbox'), {
      target: { value: 'CREDITS10' },
    });
    fireEvent.click(within(getCreditsPlanSection()).getByRole('button', { name: 'Aplicar' }));
    await settleAsyncState();

    await waitFor(() =>
      expect(forcedServices.dopplerAccountPlansApiClient.validatePromocode).toHaveBeenCalledWith(
        20222,
        'CREDITS10',
      ),
    );

    await waitFor(() =>
      expect(
        within(getCreditsPlanSection()).getAllByText(textContentIncludes('US$72/pago unico*'))
          .length,
      ).toBeGreaterThan(0),
    );
    expect(
      within(getCreditsPlanSection()).getByText(/Ahorras 10% en esta compra/i),
    ).toBeInTheDocument();
  });

  it('should show extra credits message when promocode has only extra credits', async () => {
    const forcedServices = await renderNewPlanSelection();

    forcedServices.dopplerAccountPlansApiClient.validatePromocode.mockResolvedValueOnce({
      success: true,
      value: {
        canApply: true,
        promotionApplied: { discountPercentage: 0, extraCredits: 5000 },
      },
    });

    forcedServices.dopplerAccountPlansApiClient.getPlanBillingDetailsData.mockImplementation(
      async (planId, _planGroup, _discountId, promocode) => {
        const isCreditPlan = planId === creditPlans[0].id || planId === creditPlans[1].id;
        if (isCreditPlan) {
          return promocode ? creditsAmountDetailsWithExtraCredits : creditsAmountDetails;
        }

        return promocode ? amountDetailsWithPromocode : amountDetails;
      },
    );

    fireEvent.change(within(getCreditsPlanSection()).getByRole('textbox'), {
      target: { value: 'PLUS5000' },
    });
    fireEvent.click(within(getCreditsPlanSection()).getByRole('button', { name: 'Aplicar' }));
    await settleAsyncState();

    await waitFor(() =>
      expect(
        within(getCreditsPlanSection()).getByText(/Incluye 5.000 Creditos extra/i),
      ).toBeInTheDocument(),
    );
  });

  it('should show discount and extra credits when promocode has both benefits', async () => {
    const forcedServices = await renderNewPlanSelection();

    forcedServices.dopplerAccountPlansApiClient.validatePromocode.mockResolvedValueOnce({
      success: true,
      value: {
        canApply: true,
        promotionApplied: { discountPercentage: 10, extraCredits: 5000 },
      },
    });

    forcedServices.dopplerAccountPlansApiClient.getPlanBillingDetailsData.mockImplementation(
      async (planId, _planGroup, _discountId, promocode) => {
        const isCreditPlan = planId === creditPlans[0].id || planId === creditPlans[1].id;
        if (isCreditPlan) {
          return promocode ? creditsAmountDetailsWithDiscountAndExtraCredits : creditsAmountDetails;
        }

        return promocode ? amountDetailsWithPromocode : amountDetails;
      },
    );

    fireEvent.change(within(getCreditsPlanSection()).getByRole('textbox'), {
      target: { value: 'CREDITSBONUS' },
    });
    fireEvent.click(within(getCreditsPlanSection()).getByRole('button', { name: 'Aplicar' }));
    await settleAsyncState();

    await waitFor(() =>
      expect(
        within(getCreditsPlanSection()).getByText(/Ahorras 10% en esta compra/i),
      ).toBeInTheDocument(),
    );
    expect(
      within(getCreditsPlanSection()).getByText(/Incluye 5.000 Creditos extra/i),
    ).toBeInTheDocument();
  });
});
