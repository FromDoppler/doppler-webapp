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
import { AddOnType, PLAN_TYPE } from '../../../doppler-types';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider';
import DopplerIntlProviderDoubleWithIdsAsValues from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
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

const emailPlans = [
  {
    type: PLAN_TYPE.byEmail,
    id: 30222,
    name: '300000-EMAILS',
    emailsByMonth: 300000,
    fee: 367,
    extraEmailPrice: 0.0015,
  },
  {
    type: PLAN_TYPE.byEmail,
    id: 30223,
    name: '1500000-EMAILS',
    emailsByMonth: 1500000,
    fee: 920,
    extraEmailPrice: 0.0012,
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

const addOnPlansByType = {
  [AddOnType.OnSite]: [
    { planId: 301, quantity: 5000, fee: 25 },
    { planId: 302, quantity: 1000, fee: 15 },
  ],
  [AddOnType.Conversations]: [
    { planId: 401, quantity: 1000, fee: 30 },
    { planId: 402, quantity: 500, fee: 20 },
  ],
  [AddOnType.EcoAI]: [{ planId: 501, quantity: 1, fee: 49 }],
  [AddOnType.PushNotifications]: [
    { planId: 601, quantity: 1000, fee: 18 },
    { planId: 602, quantity: 500, fee: 15 },
  ],
};

const landingPacks = [
  { planId: 701, description: 'PACK 25', landingsQty: 25, price: 8 },
  { planId: 702, description: 'PACK 5', landingsQty: 5, price: 5 },
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

const textContentIncludes = (text) => (_content, node) => node?.textContent?.includes(text);
const settleAsyncState = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};
const ACT_WARNING_PATTERN = /not wrapped in act/i;

let consoleErrorSpy;
let previousCanBuyPushNotificationPlan;

const getContactsPlanSection = () => screen.getByTestId('dp-contacts-plan');
const getEmailsPlanSection = () => screen.getByTestId('dp-emails-plan');
const getCreditsPlanSection = () => screen.getByTestId('dp-credits-plan');
const getAddOnsSection = () => screen.getByTestId('dp-addons-section');
const getFaqSection = () => screen.getByTestId('dp-faq-section');
const getContactsSelect = () => within(getContactsPlanSection()).getByRole('combobox');
const getEmailsSelect = () => within(getEmailsPlanSection()).getByRole('combobox');
const getCreditsSelect = () => within(getCreditsPlanSection()).getByRole('combobox');
const hasPriceInBold = (priceRegex) => (_content, node) =>
  node?.tagName === 'B' && priceRegex.test(node?.textContent || '');

const createForcedServices = ({
  features = {},
  dopplerAccountPlansApiClient = {},
  appSessionUser = {},
  planService = {},
} = {}) => ({
  appSessionRef: {
    current: {
      userData: {
        features,
        user: {
          locationCountry: 'us',
          chat: { active: false },
          plan: {
            idPlan: 1,
            planType: PLAN_TYPE.free,
            isFreeAccount: true,
            planSubscription: 1,
          },
          ...appSessionUser,
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
    getAddOnPlans: jest.fn(async (addOnType) => ({
      success: true,
      value: addOnPlansByType[addOnType] || [],
    })),
    getLandingPacks: jest.fn(async () => ({
      success: true,
      value: landingPacks,
    })),
    ...dopplerAccountPlansApiClient,
  },
  planService: {
    getPlansByType: jest.fn(async (planType) => {
      if (planType === PLAN_TYPE.byContact) {
        return contactPlans;
      }

      if (planType === PLAN_TYPE.byCredit) {
        return creditPlans;
      }

      if (planType === PLAN_TYPE.byEmail) {
        return emailPlans;
      }

      return [];
    }),
    ...planService,
  },
});

const renderNewPlanSelection = async (
  initialEntries = ['/new-plan-selection'],
  serviceOptions = {},
  { useI18nKeysAsValues = true } = {},
) => {
  const forcedServices = createForcedServices(serviceOptions);
  const IntlProviderComponent = useI18nKeysAsValues
    ? DopplerIntlProviderDoubleWithIdsAsValues
    : DopplerIntlProvider;

  render(
    <AppServicesProvider forcedServices={forcedServices}>
      <IntlProviderComponent locale="es">
        <Router initialEntries={initialEntries}>
          <Routes>
            <Route path="/new-plan-selection" element={<NewPlanSelection />} />
          </Routes>
        </Router>
      </IntlProviderComponent>
    </AppServicesProvider>,
  );

  await waitForElementToBeRemoved(screen.getByTestId('wrapper-loading'));
  await settleAsyncState();

  return forcedServices;
};

describe('NewPlanSelection component', () => {
  beforeEach(() => {
    previousCanBuyPushNotificationPlan =
      process.env.REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN;
    process.env.REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN = 'false';
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
    process.env.REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN =
      previousCanBuyPushNotificationPlan;
  });

  it('should render section controls without plan type tabs', async () => {
    await renderNewPlanSelection();

    expect(
      screen.getByRole('heading', {
        name: 'buy_process.new_plan_selection.title',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('buy_process.new_plan_selection.contacts_plan_title').length,
    ).toBeGreaterThan(0);
    expect(getContactsSelect()).toHaveValue('0');
    expect(
      screen.getByRole('option', {
        name: 'buy_process.new_plan_selection.contacts_option_more_than_100k',
      }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByText('buy_process.new_plan_selection.subscription_label'),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getAllByText('checkoutProcessForm.purchase_summary.promocode_header').length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/tipo de plan/i)).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('dp-sticky-plan-summary')).toBeInTheDocument());
    expect(
      screen.getByRole('link', { name: 'buy_process.new_plan_selection.sticky_default_cta' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('buy_process.new_plan_selection.sticky_default_cta'),
    ).toBeInTheDocument();

    expect(
      within(getCreditsPlanSection()).getByRole('heading', {
        name: 'buy_process.new_plan_selection.credits_plan_title',
      }),
    ).toBeInTheDocument();
    expect(getCreditsSelect()).toHaveValue('0');
    expect(
      screen.getByRole('heading', {
        name: 'buy_process.new_plan_selection.credits_plan_title',
      }),
    ).toBeInTheDocument();
  });

  it('should render informational add-ons cards with real minimum prices and no card actions', async () => {
    await renderNewPlanSelection(['/new-plan-selection'], {}, { useI18nKeysAsValues: true });

    expect(
      screen.getByText('buy_process.new_plan_selection.addons_section.title'),
    ).toBeInTheDocument();
    expect(within(getAddOnsSection()).getByText('my_plan.addons.onsite.title')).toBeInTheDocument();
    expect(
      within(screen.getByTestId('dp-addon-card-conversations')).getByRole('heading', {
        name: 'my_plan.addons.conversations.title',
      }),
    ).toBeInTheDocument();

    const nextButton = within(getAddOnsSection()).getByRole('button', {
      name: 'buy_process.new_plan_selection.addons_section.next',
    });

    fireEvent.click(nextButton);
    await settleAsyncState();
    fireEvent.click(nextButton);
    await settleAsyncState();

    await waitFor(() =>
      expect(
        within(getAddOnsSection()).getByText('my_plan.addons.landing_pages.title'),
      ).toBeInTheDocument(),
    );

    screen.getAllByTestId(/dp-addon-card-/).forEach((card) => {
      expect(within(card).queryByRole('link')).not.toBeInTheDocument();
      expect(within(card).queryByRole('button')).not.toBeInTheDocument();
    });
  });

  it('should render Eco IA only when ecoIAEnabled is true', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        features: { ecoIAEnabled: true },
      },
      { useI18nKeysAsValues: true },
    );

    await waitFor(() => expect(screen.getByTestId('dp-addon-card-eco-ai')).toBeInTheDocument());
    expect(within(getAddOnsSection()).getByText('my_plan.addons.eco_ai.title')).toBeInTheDocument();
    expect(
      within(screen.getByTestId('dp-addon-card-eco-ai')).getByText(
        hasPriceInBold(/US\$\s*49[.,]00/),
      ),
    ).toBeInTheDocument();
  });

  it('should hide Eco IA when ecoIAEnabled is not true', async () => {
    await renderNewPlanSelection(['/new-plan-selection'], {}, { useI18nKeysAsValues: true });

    expect(
      within(getAddOnsSection()).queryByText('my_plan.addons.eco_ai.title'),
    ).not.toBeInTheDocument();
  });

  it('should render Push Notification only when can buy env var is true', async () => {
    process.env.REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN = 'true';
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        features: { ecoIAEnabled: true },
      },
      { useI18nKeysAsValues: true },
    );

    await waitFor(() =>
      expect(screen.getByTestId('dp-addon-card-push-notification')).toBeInTheDocument(),
    );
    expect(
      within(screen.getByTestId('dp-addon-card-push-notification')).getByRole('heading', {
        name: 'my_plan.addons.push_notification.title',
      }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('dp-addon-card-push-notification')).getByText(
        hasPriceInBold(/US\$\s*15[.,]00/),
      ),
    ).toBeInTheDocument();
  });

  it('should hide Push Notification when can buy env var is not true', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        features: { ecoIAEnabled: true },
      },
      { useI18nKeysAsValues: true },
    );

    expect(
      within(getAddOnsSection()).queryByText('my_plan.addons.push_notification.title'),
    ).not.toBeInTheDocument();
  });

  it('should keep add-ons section visible with fallback price when one add-on source fails', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        dopplerAccountPlansApiClient: {
          getAddOnPlans: jest.fn(async (addOnType) => {
            if (addOnType === AddOnType.OnSite) {
              return { success: false, error: 'Unexpected error' };
            }

            return { success: true, value: addOnPlansByType[addOnType] || [] };
          }),
        },
      },
      { useI18nKeysAsValues: true },
    );

    await waitFor(() =>
      expect(
        within(screen.getByTestId('dp-addon-card-onsite')).getByText(
          'buy_process.new_plan_selection.addons_section.price_unavailable',
        ),
      ).toBeInTheDocument(),
    );
    expect(
      within(screen.getByTestId('dp-addon-card-conversations')).getByRole('heading', {
        name: 'my_plan.addons.conversations.title',
      }),
    ).toBeInTheDocument();

    const nextButton = within(getAddOnsSection()).getByRole('button', {
      name: 'buy_process.new_plan_selection.addons_section.next',
    });

    fireEvent.click(nextButton);
    await settleAsyncState();
    fireEvent.click(nextButton);
    await settleAsyncState();

    await waitFor(() =>
      expect(
        within(getAddOnsSection()).getByText('my_plan.addons.landing_pages.title'),
      ).toBeInTheDocument(),
    );
    expect(
      within(screen.getByTestId('dp-addon-card-landing-pages')).getByText(
        hasPriceInBold(/US\$\s*5[.,]00/),
      ),
    ).toBeInTheDocument();
  });

  it('should keep fixed-price add-ons visible when all API-backed sources fail', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        dopplerAccountPlansApiClient: {
          getAddOnPlans: jest.fn(async () => ({ success: false, error: 'Unexpected error' })),
          getLandingPacks: jest.fn(async () => ({ success: false, error: 'Unexpected error' })),
        },
      },
      { useI18nKeysAsValues: true },
    );

    await waitFor(() =>
      expect(
        within(screen.getByTestId('dp-addon-card-conversations')).getByText(
          'buy_process.new_plan_selection.addons_section.price_unavailable',
        ),
      ).toBeInTheDocument(),
    );
    expect(
      within(screen.getByTestId('dp-addon-card-onsite')).getByText(
        'buy_process.new_plan_selection.addons_section.price_unavailable',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('dp-addon-card-sms')).toBeInTheDocument();
    expect(
      within(screen.getByTestId('dp-addon-card-sms')).getByText(hasPriceInBold(/US\$\s*50[.,]00/)),
    ).toBeInTheDocument();
    expect(
      within(getAddOnsSection()).queryByText(
        'buy_process.new_plan_selection.addons_section.empty_message',
      ),
    ).not.toBeInTheDocument();
  });

  it('should render faq section below add-ons with 9 faq items', async () => {
    await renderNewPlanSelection(['/new-plan-selection'], {}, { useI18nKeysAsValues: true });

    const addOnsSection = getAddOnsSection();
    const faqSection = getFaqSection();
    expect(faqSection).toBeInTheDocument();
    expect(within(faqSection).getByRole('heading', { name: 'faq.title' })).toBeInTheDocument();

    const faqQuestions = within(faqSection).getAllByText(/faq\.question_/);
    expect(faqQuestions).toHaveLength(9);
    expect(
      addOnsSection.compareDocumentPosition(faqSection) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('should open and close included features modal', async () => {
    const user = userEvent.setup();
    await renderNewPlanSelection(['/new-plan-selection'], {}, { useI18nKeysAsValues: true });

    await user.click(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.see_more',
      }),
    );

    expect(
      screen.getByText('buy_process.new_plan_selection.included_features.modal_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.title',
      }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText(
        'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.name_1',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.description_1',
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.title',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.modal_sections.email_marketing_ai.title',
      }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.title',
      }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText(
        'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.name_1',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.description_1',
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.title',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.modal_sections.automation_marketing.title',
      }),
    ).toHaveAttribute('aria-expanded', 'false');

    await user.click(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.title',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.title',
      }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText(
        'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.name_1',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'buy_process.new_plan_selection.included_features.modal_sections.segmentation_advanced.description_1',
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.title',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.title',
      }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText(
        'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.name_1',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'buy_process.new_plan_selection.included_features.modal_sections.reports_analytics.description_1',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('modal-close'));

    await waitFor(() =>
      expect(
        screen.queryByText('buy_process.new_plan_selection.included_features.modal_title'),
      ).not.toBeInTheDocument(),
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

  it('should load REACT_APP_PROMOCODE_CONTACTS automatically in contacts plan for paid users with credit plans when URL has no promocode', async () => {
    const previousContactsPromocode = process.env.REACT_APP_PROMOCODE_CONTACTS;
    process.env.REACT_APP_PROMOCODE_CONTACTS = 'DOPPLER50X6';
    try {
      await renderNewPlanSelection(
        ['/new-plan-selection'],
        {
          appSessionUser: {
            plan: {
              idPlan: 20222,
              planType: PLAN_TYPE.byCredit,
              isFreeAccount: false,
              planSubscription: 1,
            },
          },
        },
        { useI18nKeysAsValues: true },
      );

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
      const choosePlanHref = screen
        .getByRole('link', { name: 'buy_process.new_plan_selection.sticky_default_cta' })
        .getAttribute('href');
      expect(choosePlanHref).not.toContain('promo-code=');
      expect(choosePlanHref).not.toContain('Promo-code=');
      expect(choosePlanHref).not.toContain('PromoCode=');
    });

    fireEvent.change(getContactsSelect(), {
      target: { value: '1' },
    });
    await settleAsyncState();

    await waitFor(() => {
      const choosePlanHref = screen
        .getByRole('link', { name: 'buy_process.new_plan_selection.sticky_default_cta' })
        .getAttribute('href');
      expect(choosePlanHref).not.toContain('promo-code=');
      expect(choosePlanHref).not.toContain('Promo-code=');
      expect(choosePlanHref).not.toContain('PromoCode=');
    });
  });

  it('should not prepopulate contacts promocode for paid users with non-monthly subscription', async () => {
    await renderNewPlanSelection(['/new-plan-selection'], {
      appSessionUser: {
        plan: {
          idPlan: 10222,
          planType: PLAN_TYPE.byContact,
          isFreeAccount: false,
          planSubscription: 12,
          subscribersCount: 900,
          promotion: {
            idUserTypePlan: 10222,
            code: 'PROMOCODE_ANNUAL',
            discount: 20,
            duration: 12,
          },
        },
      },
    });

    const promocodeInput = within(getContactsPlanSection()).getByRole('textbox');
    expect(promocodeInput).toHaveValue('');
    const choosePlanHref = screen
      .getByRole('link', { name: 'buy_process.new_plan_selection.choose_plan' })
      .getAttribute('href');
    expect(choosePlanHref).not.toContain('PromoCode=');
    expect(choosePlanHref).not.toContain('promo-code=');
  });

  it('should update selected contacts plan in checkout URL when contacts dropdown changes', async () => {
    await renderNewPlanSelection();

    fireEvent.change(getContactsSelect(), {
      target: { value: '1' },
    });
    await settleAsyncState();

    await waitFor(() =>
      expect(
        screen
          .getByRole('link', { name: 'buy_process.new_plan_selection.sticky_default_cta' })
          .getAttribute('href'),
      ).toContain('selected-plan=10223'),
    );
    expect(
      screen.getByText('buy_process.new_plan_selection.sticky_contacts_subtitle'),
    ).toBeInTheDocument();
  });

  it('should render emails plan variant for paid byEmail users', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 30222,
            planType: PLAN_TYPE.byEmail,
            isFreeAccount: false,
            planSubscription: 1,
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    expect(getEmailsPlanSection()).toBeInTheDocument();
    expect(getEmailsSelect()).toBeInTheDocument();
    expect(screen.queryByTestId('dp-contacts-plan')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dp-credits-plan')).not.toBeInTheDocument();
  });

  it('should preselect the next byEmail plan based on current emails quantity', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 30222,
            planType: PLAN_TYPE.byEmail,
            isFreeAccount: false,
            planSubscription: 1,
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    expect(getEmailsSelect()).toHaveValue('1');
    expect(
      screen.getByText('buy_process.new_plan_selection.sticky_emails_subtitle'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'buy_process.new_plan_selection.choose_plan',
      }),
    ).toHaveAttribute('href', '/checkout/premium/monthly-deliveries?selected-plan=30223&buyType=1');
  });

  it('should show current plan warning and hide promocode when selected byEmail plan equals current one', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 30223,
            planType: PLAN_TYPE.byEmail,
            isFreeAccount: false,
            planSubscription: 1,
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    expect(getEmailsSelect()).toHaveValue('1');
    expect(screen.getByTestId('dp-emails-current-plan-message')).toBeInTheDocument();
    expect(
      screen.getByText('buy_process.new_plan_selection.contacts_current_plan_warning_message'),
    ).toBeInTheDocument();
    expect(within(getEmailsPlanSection()).queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should preselect the next contact plan when subscribers count is lower than current plan capacity and a higher plan exists', async () => {
    const contactPlansWithExtraLevel = [
      {
        type: PLAN_TYPE.byContact,
        id: 10222,
        name: '500-SUBSCRIBERS',
        subscriberLimit: 500,
        fee: 10,
        billingCycleDetails: contactPlans[0].billingCycleDetails,
      },
      {
        type: PLAN_TYPE.byContact,
        id: 10223,
        name: '1500-SUBSCRIBERS',
        subscriberLimit: 1500,
        fee: 20,
        billingCycleDetails: contactPlans[1].billingCycleDetails,
      },
      {
        type: PLAN_TYPE.byContact,
        id: 10224,
        name: '3000-SUBSCRIBERS',
        subscriberLimit: 3000,
        fee: 30,
        billingCycleDetails: contactPlans[1].billingCycleDetails,
      },
    ];

    await renderNewPlanSelection(['/new-plan-selection'], {
      appSessionUser: {
        plan: {
          idPlan: 10223,
          planType: PLAN_TYPE.byContact,
          isFreeAccount: false,
          planSubscription: 1,
          subscribersCount: 1300,
        },
      },
      planService: {
        getPlansByType: jest.fn(async (planType) => {
          if (planType === PLAN_TYPE.byContact) {
            return contactPlansWithExtraLevel;
          }

          if (planType === PLAN_TYPE.byCredit) {
            return creditPlans;
          }

          if (planType === PLAN_TYPE.byEmail) {
            return emailPlans;
          }

          return [];
        }),
      },
    });

    expect(getContactsSelect()).toHaveValue('2');
    expect(
      screen
        .getByRole('link', { name: 'buy_process.new_plan_selection.choose_plan' })
        .getAttribute('href'),
    ).toContain('selected-plan=10224');
  });

  it('should not preselect a smaller contact plan when subscribers count is lower than current plan capacity and there is no higher plan', async () => {
    await renderNewPlanSelection(['/new-plan-selection'], {
      appSessionUser: {
        plan: {
          idPlan: 10223,
          planType: PLAN_TYPE.byContact,
          isFreeAccount: false,
          planSubscription: 1,
          subscribersCount: 1300,
        },
      },
    });

    expect(getContactsSelect()).toHaveValue('1');
    expect(
      within(screen.getByTestId('dp-sticky-plan-summary')).queryByRole('link', {
        name: 'buy_process.new_plan_selection.sticky_default_cta',
      }),
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByTestId('dp-sticky-plan-summary')).getByRole('button', {
        name: 'buy_process.new_plan_selection.sticky_default_cta',
      }),
    ).toBeDisabled();
    expect(
      within(getContactsPlanSection()).queryByRole('link', {
        name: 'buy_process.new_plan_selection.choose_plan',
      }),
    ).not.toBeInTheDocument();
    expect(
      within(getContactsPlanSection()).getByRole('button', {
        name: 'buy_process.new_plan_selection.choose_plan',
      }),
    ).toBeDisabled();
  });

  it('should show current plan warning and hide subscription and promocode when selected plan equals current one', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 10223,
            planType: PLAN_TYPE.byContact,
            isFreeAccount: false,
            planSubscription: 1,
            subscribersCount: 1300,
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    expect(getContactsSelect()).toHaveValue('1');
    expect(screen.getByTestId('dp-contacts-current-plan-message')).toBeInTheDocument();
    expect(
      screen.getByText('buy_process.new_plan_selection.contacts_current_plan_warning_message'),
    ).toBeInTheDocument();
    expect(
      within(getContactsPlanSection()).queryByRole('button', {
        name: /buy_process\.discount_monthly/i,
      }),
    ).not.toBeInTheDocument();
    expect(within(getContactsPlanSection()).queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should preselect a higher contact plan when subscribers count is greater than current plan capacity', async () => {
    await renderNewPlanSelection(['/new-plan-selection'], {
      appSessionUser: {
        plan: {
          idPlan: 10222,
          planType: PLAN_TYPE.byContact,
          isFreeAccount: false,
          planSubscription: 1,
          subscribersCount: 700,
        },
      },
    });

    expect(getContactsSelect()).toHaveValue('1');
    expect(
      screen
        .getByRole('link', { name: 'buy_process.new_plan_selection.choose_plan' })
        .getAttribute('href'),
    ).toContain('selected-plan=10223');
  });

  it('should render less-than-100k as the first option in emails dropdown', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 30222,
            planType: PLAN_TYPE.byEmail,
            isFreeAccount: false,
            planSubscription: 1,
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    const emailOptions = within(getEmailsSelect()).getAllByRole('option');
    expect(emailOptions[0]).toHaveTextContent(
      'buy_process.new_plan_selection.emails_option_less_than_100k',
    );
  });

  it('should show downgrade message and use advisor CTA when selecting less than 100k emails', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 30223,
            planType: PLAN_TYPE.byEmail,
            isFreeAccount: false,
            planSubscription: 1,
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    fireEvent.change(getEmailsSelect(), {
      target: { value: 'less-than-100000' },
    });
    await settleAsyncState();

    await waitFor(() =>
      expect(screen.getByTestId('dp-emails-downgrade-message')).toBeInTheDocument(),
    );
    expect(
      screen.getByText('buy_process.new_plan_selection.emails_downgrade_warning_message'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'buy_process.new_plan_selection.contact_advisor_cta',
      }),
    ).toHaveAttribute('href', '/upgrade-suggestion-form');
    expect(
      screen.getByText('buy_process.new_plan_selection.custom_price_value'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('buy_process.new_plan_selection.emails_extra_email_price'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'buy_process.new_plan_selection.sticky_custom_cta',
      }),
    ).toHaveAttribute('href', '/upgrade-suggestion-form');
  });

  it('should prioritize more than 10m message and hide downgrade warning in emails plan', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 30223,
            planType: PLAN_TYPE.byEmail,
            isFreeAccount: false,
            planSubscription: 1,
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    fireEvent.change(getEmailsSelect(), {
      target: { value: 'less-than-100000' },
    });
    await settleAsyncState();
    await waitFor(() =>
      expect(screen.getByTestId('dp-emails-downgrade-message')).toBeInTheDocument(),
    );

    fireEvent.change(getEmailsSelect(), {
      target: { value: 'more-than-10000000' },
    });
    await settleAsyncState();

    await waitFor(() =>
      expect(screen.getByTestId('dp-emails-more-than-10m-message')).toBeInTheDocument(),
    );
    expect(screen.queryByTestId('dp-emails-downgrade-message')).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'buy_process.new_plan_selection.contact_advisor_cta',
      }),
    ).toHaveAttribute('href', '/upgrade-suggestion-form');
    expect(
      screen.getByText('buy_process.new_plan_selection.custom_price_value'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('buy_process.new_plan_selection.emails_extra_email_price'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'buy_process.new_plan_selection.sticky_custom_cta',
      }),
    ).toHaveAttribute('href', '/upgrade-suggestion-form');
  });

  it('should build checkout URL for selected byEmail plan when no commercial scenario is active', async () => {
    await renderNewPlanSelection(['/new-plan-selection'], {
      appSessionUser: {
        plan: {
          idPlan: 30222,
          planType: PLAN_TYPE.byEmail,
          isFreeAccount: false,
          planSubscription: 1,
        },
      },
    });

    fireEvent.change(getEmailsSelect(), {
      target: { value: '1' },
    });
    await settleAsyncState();

    await waitFor(() =>
      expect(
        screen
          .getByRole('link', { name: 'buy_process.new_plan_selection.choose_plan' })
          .getAttribute('href'),
      ).toBe('/checkout/premium/monthly-deliveries?selected-plan=30223&buyType=1'),
    );
  });

  it('should show downgrade warning when paid user selects a smaller contacts plan and hide it when returns to current size', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 10223,
            planType: PLAN_TYPE.byContact,
            isFreeAccount: false,
            planSubscription: 1,
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    expect(screen.queryByTestId('dp-contacts-downgrade-message')).not.toBeInTheDocument();

    fireEvent.change(getContactsSelect(), {
      target: { value: '0' },
    });
    await settleAsyncState();

    await waitFor(() =>
      expect(screen.getByTestId('dp-contacts-downgrade-message')).toBeInTheDocument(),
    );
    expect(
      within(getContactsPlanSection()).queryByRole('button', {
        name: /buy_process\.discount_monthly/i,
      }),
    ).not.toBeInTheDocument();
    expect(within(getContactsPlanSection()).queryByRole('textbox')).not.toBeInTheDocument();
    expect(
      screen.getByText('buy_process.new_plan_selection.contacts_downgrade_warning_message'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('dp-contacts-downgrade-message')).getByRole('link', {
        name: 'buy_process.new_plan_selection.more_than_100k_contact_link',
      }),
    ).toHaveAttribute('href', '/upgrade-suggestion-form');
    expect(
      screen.getByRole('link', {
        name: 'buy_process.new_plan_selection.contact_advisor_cta',
      }),
    ).toHaveAttribute('href', '/upgrade-suggestion-form');
    expect(
      screen.getByRole('link', {
        name: 'buy_process.new_plan_selection.sticky_custom_cta',
      }),
    ).toHaveAttribute('href', '/upgrade-suggestion-form');

    fireEvent.change(getContactsSelect(), {
      target: { value: '1' },
    });
    await settleAsyncState();

    await waitFor(() =>
      expect(screen.queryByTestId('dp-contacts-downgrade-message')).not.toBeInTheDocument(),
    );
  });

  it('should show lose promotion warning when selected contacts plan is different from promotion plan', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 10222,
            planType: PLAN_TYPE.byContact,
            isFreeAccount: false,
            planSubscription: 1,
            promotion: {
              idUserTypePlan: 10222,
              code: 'PROMOCODE',
            },
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    expect(
      screen.queryByText('buy_process.plan_selection.lose_promotion_message'),
    ).not.toBeInTheDocument();

    fireEvent.change(getContactsSelect(), {
      target: { value: '1' },
    });
    await settleAsyncState();

    await waitFor(() =>
      expect(
        screen.getByText('buy_process.plan_selection.lose_promotion_message'),
      ).toBeInTheDocument(),
    );
  });

  it('should not show lose promotion warning when applied promocode is different from saved one and it is invalid', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 10222,
            planType: PLAN_TYPE.byContact,
            isFreeAccount: false,
            planSubscription: 1,
            promotion: {
              idUserTypePlan: 10222,
              code: 'PROMOCODE_SAVED',
            },
          },
        },
        dopplerAccountPlansApiClient: {
          validatePromocode: jest.fn(async () => ({
            success: true,
            value: {
              canApply: false,
              promocode: 'PROMOCODE_OTHER',
              planPromotions: [{ planType: 2, quantity: '100000,500000' }],
            },
          })),
        },
      },
      { useI18nKeysAsValues: true },
    );

    fireEvent.change(getContactsSelect(), {
      target: { value: '1' },
    });
    await settleAsyncState();

    fireEvent.change(within(getContactsPlanSection()).getByRole('textbox'), {
      target: { value: 'PROMOCODE_OTHER' },
    });
    fireEvent.click(
      within(getContactsPlanSection()).getByRole('button', {
        name: 'buy_process.promocode.apply_btn',
      }),
    );
    await settleAsyncState();

    await waitFor(() =>
      expect(
        screen.getByText(
          'checkoutProcessForm.purchase_summary.promocode_can_not_apply_error_message',
        ),
      ).toBeInTheDocument(),
    );
    expect(
      screen.queryByText('buy_process.plan_selection.lose_promotion_message'),
    ).not.toBeInTheDocument();
  });

  it('should update selected credits plan in checkout URL when credits dropdown changes', async () => {
    await renderNewPlanSelection();

    fireEvent.change(getCreditsSelect(), {
      target: { value: '1' },
    });
    await settleAsyncState();

    await waitFor(() =>
      expect(
        within(getCreditsPlanSection())
          .getByRole('link', {
            name: 'buy_process.new_plan_selection.buy_credits',
          })
          .getAttribute('href'),
      ).toBe(`/checkout/premium/${PLAN_TYPE.byCredit}?selected-plan=20223&buyType=1`),
    );
  });

  it('should keep user subscription frequency selected and keep payment frequency enabled for free users', async () => {
    await renderNewPlanSelection();

    const annualFrequencyButton = within(getContactsPlanSection()).getByRole('button', {
      name: /buy_process\.discount_yearly/i,
    });
    expect(annualFrequencyButton).not.toBeDisabled();

    await waitFor(() =>
      expect(
        screen
          .getByRole('link', { name: 'buy_process.new_plan_selection.choose_plan' })
          .getAttribute('href'),
      ).toBe(
        '/checkout/premium/subscribers?selected-plan=10222&discountId=795&monthPlan=1&buyType=1',
      ),
    );
    expect(
      screen.getByText('US$10/buy_process.new_plan_selection.month_period'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('buy_process.new_plan_selection.sticky_frequency_discount_text'),
    ).not.toBeInTheDocument();
  });

  it('should keep contacts payment frequency disabled for users with current contact plan', async () => {
    await renderNewPlanSelection(['/new-plan-selection'], {
      appSessionUser: {
        plan: {
          idPlan: 10222,
          planType: PLAN_TYPE.byContact,
          isFreeAccount: false,
          planSubscription: 1,
        },
      },
    });

    expect(screen.getByTestId('dp-contacts-current-plan-message')).toBeInTheDocument();
    expect(
      within(getContactsPlanSection()).queryByRole('button', {
        name: /buy_process\.discount_yearly/i,
      }),
    ).not.toBeInTheDocument();
    expect(within(getContactsPlanSection()).queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should render credits plan before contacts plan for users with current credit plan', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 20222,
            planType: PLAN_TYPE.byCredit,
            isFreeAccount: false,
            planSubscription: 1,
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    const creditsPlan = getCreditsPlanSection();
    const contactsPlan = getContactsPlanSection();

    expect(
      creditsPlan.compareDocumentPosition(contactsPlan) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('should keep contacts payment frequency enabled for users with current credit plan', async () => {
    await renderNewPlanSelection(['/new-plan-selection'], {
      appSessionUser: {
        plan: {
          idPlan: 20222,
          planType: PLAN_TYPE.byCredit,
          isFreeAccount: false,
          planSubscription: 1,
        },
      },
    });

    const annualFrequencyButton = within(getContactsPlanSection()).getByRole('button', {
      name: /buy_process\.discount_yearly/i,
    });
    expect(annualFrequencyButton).not.toBeDisabled();
  });

  it('should show tailored price and advisor CTA for more than 100k option', async () => {
    await renderNewPlanSelection();

    fireEvent.change(getContactsSelect(), {
      target: { value: 'more-than-100000' },
    });
    await settleAsyncState();

    await waitFor(() => expect(getContactsSelect()).toHaveValue('more-than-100000'));

    const infoBanner = screen.getByTestId('dp-more-than-100k-message');
    expect(infoBanner).toBeInTheDocument();
    expect(
      within(getContactsPlanSection()).queryByRole('button', {
        name: /buy_process\.discount_monthly/i,
      }),
    ).not.toBeInTheDocument();
    expect(within(getContactsPlanSection()).queryByRole('textbox')).not.toBeInTheDocument();
    expect(
      within(infoBanner).getByText('buy_process.new_plan_selection.more_than_100k_info_message'),
    ).toBeInTheDocument();
    expect(
      within(infoBanner).getByRole('link', {
        name: 'buy_process.new_plan_selection.more_than_100k_contact_link',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(
        textContentIncludes('buy_process.new_plan_selection.tailored_plan_disclaimer'),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen
        .getByRole('link', { name: 'buy_process.new_plan_selection.contact_advisor_cta' })
        .getAttribute('href'),
    ).toContain('/upgrade-suggestion-form');
    expect(
      screen.getByText('buy_process.new_plan_selection.sticky_custom_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'buy_process.new_plan_selection.sticky_custom_cta' }),
    ).toHaveAttribute('href', '/upgrade-suggestion-form');
    expect(
      screen.queryByRole('link', { name: 'buy_process.new_plan_selection.choose_plan' }),
    ).not.toBeInTheDocument();
  });

  it('should show only the tailored blue message and hide lose promotion warning for more than 100k option', async () => {
    await renderNewPlanSelection(
      ['/new-plan-selection'],
      {
        appSessionUser: {
          plan: {
            idPlan: 10222,
            planType: PLAN_TYPE.byContact,
            isFreeAccount: false,
            planSubscription: 1,
            promotion: {
              idUserTypePlan: 10222,
              code: 'PROMOCODE',
            },
          },
        },
      },
      { useI18nKeysAsValues: true },
    );

    fireEvent.change(getContactsSelect(), {
      target: { value: 'more-than-100000' },
    });
    await settleAsyncState();

    expect(screen.getByTestId('dp-more-than-100k-message')).toBeInTheDocument();
    expect(
      screen.queryByText('buy_process.plan_selection.lose_promotion_message'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'checkoutProcessForm.purchase_summary.promocode_can_not_apply_error_message',
      ),
    ).not.toBeInTheDocument();
  });

  it('should keep sticky CTA URL synchronized with contacts plan CTA URL', async () => {
    await renderNewPlanSelection();

    await waitFor(() => {
      const choosePlanHref = screen
        .getByRole('link', { name: 'buy_process.new_plan_selection.choose_plan' })
        .getAttribute('href');
      const stickyCtaHref = screen
        .getByRole('link', { name: 'buy_process.new_plan_selection.sticky_default_cta' })
        .getAttribute('href');
      expect(stickyCtaHref).toBe(choosePlanHref);
    });
  });

  it('should apply valid promocode discount in contacts price section with duration', async () => {
    const forcedServices = await renderNewPlanSelection();

    fireEvent.change(within(getContactsPlanSection()).getByRole('textbox'), {
      target: { value: 'PROMO50%' },
    });
    fireEvent.click(
      within(getContactsPlanSection()).getByRole('button', {
        name: 'buy_process.promocode.apply_btn',
      }),
    );
    await settleAsyncState();

    await waitFor(() =>
      expect(forcedServices.dopplerAccountPlansApiClient.validatePromocode).toHaveBeenCalled(),
    );

    await waitFor(() =>
      expect(
        screen.getAllByText(
          textContentIncludes('buy_process.new_plan_selection.promocode_savings_text'),
        ).length,
      ).toBeGreaterThan(0),
    );
    expect(
      screen.getAllByText(textContentIncludes('US$9/buy_process.new_plan_selection.month_period'))
        .length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(textContentIncludes('US$9/buy_process.new_plan_selection.month_period*'))
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(textContentIncludes('US$10/buy_process.new_plan_selection.month_period'))
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen
        .getByTestId('dp-sticky-plan-summary')
        .querySelector('.dp-new-plan-selection-sticky-summary-old-price'),
    ).toHaveTextContent(
      /buy_process\.new_plan_selection\.sticky_previous_price_label US\$10\/buy_process.new_plan_selection.month_period/,
    );
    expect(
      within(screen.getByTestId('dp-sticky-plan-summary')).getAllByText(
        textContentIncludes('buy_process.new_plan_selection.sticky_promocode_discount_text'),
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
    fireEvent.click(
      within(getContactsPlanSection()).getByRole('button', {
        name: 'buy_process.promocode.apply_btn',
      }),
    );
    await settleAsyncState();

    await waitFor(() =>
      expect(
        within(screen.getByTestId('dp-sticky-plan-summary')).getByText(
          'buy_process.new_plan_selection.sticky_promocode_discount_text',
        ),
      ).toBeInTheDocument(),
    );

    expect(
      within(getContactsPlanSection()).queryByText(
        'buy_process.new_plan_selection.promocode_savings_text_without_months',
      ),
    ).not.toBeInTheDocument();
    expect(
      within(getContactsPlanSection()).getByText(
        'buy_process.new_plan_selection.promocode_savings_text',
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('dp-sticky-plan-summary')).queryByText(
        'buy_process.new_plan_selection.sticky_promocode_discount_text_without_months',
      ),
    ).not.toBeInTheDocument();
  });

  it('should apply valid promocode discount in credits price section', async () => {
    const forcedServices = await renderNewPlanSelection();

    fireEvent.change(within(getCreditsPlanSection()).getByRole('textbox'), {
      target: { value: 'CREDITS10' },
    });
    fireEvent.click(
      within(getCreditsPlanSection()).getByRole('button', {
        name: 'buy_process.promocode.apply_btn',
      }),
    );
    await settleAsyncState();

    await waitFor(() =>
      expect(forcedServices.dopplerAccountPlansApiClient.validatePromocode).toHaveBeenCalledWith(
        20222,
        'CREDITS10',
      ),
    );

    await waitFor(() =>
      expect(
        within(getCreditsPlanSection()).getAllByText(
          textContentIncludes('US$72/buy_process.new_plan_selection.single_payment_period*'),
        ).length,
      ).toBeGreaterThan(0),
    );
    expect(
      within(getCreditsPlanSection()).getByText(
        'buy_process.new_plan_selection.credits_promocode_savings_text',
      ),
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
    fireEvent.click(
      within(getCreditsPlanSection()).getByRole('button', {
        name: 'buy_process.promocode.apply_btn',
      }),
    );
    await settleAsyncState();

    await waitFor(() =>
      expect(
        within(getCreditsPlanSection()).getByText(
          'buy_process.new_plan_selection.credits_extra_credits_text',
        ),
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
    fireEvent.click(
      within(getCreditsPlanSection()).getByRole('button', {
        name: 'buy_process.promocode.apply_btn',
      }),
    );
    await settleAsyncState();

    await waitFor(() =>
      expect(
        within(getCreditsPlanSection()).getByText(
          'buy_process.new_plan_selection.credits_promocode_savings_text',
        ),
      ).toBeInTheDocument(),
    );
    expect(
      within(getCreditsPlanSection()).getByText(
        'buy_process.new_plan_selection.credits_extra_credits_text',
      ),
    ).toBeInTheDocument();
  });

  it('should keep prepayment breakdown in a new line for quarterly, semiannual and annual frequencies', async () => {
    await renderNewPlanSelection();

    const contactsSection = getContactsPlanSection();
    const scenarios = [
      {
        buttonName: /buy_process\.discount_quarterly/i,
        expectedText: 'buy_process.new_plan_selection.savings_text',
      },
      {
        buttonName: /buy_process\.discount_half_yearly/i,
        expectedText: 'buy_process.new_plan_selection.savings_text',
      },
      {
        buttonName: /buy_process\.discount_yearly/i,
        expectedText: 'buy_process.new_plan_selection.savings_text',
      },
    ];

    for (const scenario of scenarios) {
      fireEvent.click(within(contactsSection).getByRole('button', { name: scenario.buttonName }));
      await settleAsyncState();

      await waitFor(() => {
        const savingsElement = contactsSection.querySelector(
          '.dp-new-plan-selection-price-detail .dp-new-plan-selection-savings',
        );
        expect(savingsElement).toBeInTheDocument();
        expect(savingsElement.textContent.toLowerCase()).toContain(
          scenario.expectedText.toLowerCase(),
        );
      });
    }
  });

  it('should show previous price in sticky summary when contacts payment frequency has discount', async () => {
    await renderNewPlanSelection();

    fireEvent.click(
      within(getContactsPlanSection()).getByRole('button', {
        name: /buy_process\.discount_yearly/i,
      }),
    );
    await settleAsyncState();

    expect(
      screen
        .getByTestId('dp-sticky-plan-summary')
        .querySelector('.dp-new-plan-selection-sticky-summary-old-price'),
    ).toHaveTextContent(
      /buy_process\.new_plan_selection\.sticky_previous_price_label US\$10\/buy_process.new_plan_selection.month_period/,
    );
    expect(
      within(screen.getByTestId('dp-sticky-plan-summary')).getAllByText(
        textContentIncludes('buy_process.new_plan_selection.sticky_frequency_discount_text'),
      ).length,
    ).toBeGreaterThan(0);
  });
});
