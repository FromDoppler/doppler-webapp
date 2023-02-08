import '@testing-library/jest-dom/extend-expect';
import {
  getByText,
  queryByText,
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { getDefaultPlanType, PlanCalculator } from '.';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../doppler-types';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { allPlans } from '../../../services/doppler-legacy-client.doubles';
import { AppServicesProvider } from '../../../services/pure-di';

const plansByContacts = allPlans.filter((plan) => plan.type === PLAN_TYPE.byContact);
const plansByEmails = allPlans.filter((plan) => plan.type === PLAN_TYPE.byEmail);
const plansByCredits = allPlans.filter((plan) => plan.type === PLAN_TYPE.byCredit);

describe('PlanCalculator component', () => {
  it('should render PlanCalculator when receive tabs', async () => {
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
        getPlanTypes: async () => planTypes,
        getPlansByType: async () => plansByContacts,
      },
      experimentalFeatures: {
        getFeature: () => false,
      },
      ipinfoClient: {
        getCountryCode: () => 'CL',
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
              <Route path="/plan-selection/premium/:planType" element={<PlanCalculator />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const listTabs = screen.getByRole('list', { name: 'navigator tabs' });
    expect(listTabs.children.length).toBe(planTypes.length);
  });

  // TODO: these tests will be repaired in the task https://makingsense.atlassian.net/browse/DAT-1096
  describe.each([
    [
      'should change slider when the plans are by contacts and show banner',
      PLAN_TYPE.byContact,
      plansByContacts,
    ],
    [
      'should change slider when the plans are by emails and show banner',
      PLAN_TYPE.byEmail,
      plansByEmails,
    ],
    [
      'should change slider when the plans are by credits and show banner',
      PLAN_TYPE.byCredit,
      plansByCredits,
    ],
  ])('BannerUpgrade', (testName, planType, plansByType) => {
    xit(testName, async () => {
      // Arrange
      const planTypes = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit];
      const forcedServices = {
        appSessionRef: {
          current: {
            userData: {
              user: {
                plan: {
                  idPlan: plansByType[plansByType.length - 1].id,
                  planType: PLAN_TYPE.free,
                },
              },
            },
          },
        },
        planService: {
          getPlanTypes: async () => planTypes,
          getPlansByType: async () => plansByType,
        },
        experimentalFeatures: {
          getFeature: () => false,
        },
        ipinfoClient: {
          getCountryCode: () => 'CL',
        },
      };

      // Act
      render(
        <AppServicesProvider forcedServices={forcedServices}>
          <IntlProvider>
            <Router initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[planType]}`]}>
              <Routes>
                <Route path="/plan-selection/premium/:planType" element={<PlanCalculator />} />
              </Routes>
            </Router>
          </IntlProvider>
        </AppServicesProvider>,
      );

      // Assert
      const loader = screen.getByTestId('wrapper-loading');
      await waitForElementToBeRemoved(loader);

      // simulates selection of the highest plan
      const slider = screen.getByRole('slider');
      await userEvent.type(slider, `${plansByType.length - 1}`);
      expect(slider).toHaveValue(`${plansByType.length - 1}`);
      expect(screen.getByTestId('dp-calc-message')).toHaveTextContent(
        `plan_calculator.banner_for_${planType.replace('-', '_')}`,
      );
    });
  });

  it('should hide the slider when the active plan equals the highest plan', async () => {
    // Arrange
    const highestPlanSlider = plansByContacts[plansByContacts.length - 1];
    const planTypes = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit];
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: highestPlanSlider.id,
                planType: PLAN_TYPE.free,
              },
            },
          },
        },
      },
      planService: {
        getPlanTypes: async () => planTypes,
        getPlansByType: async () => [highestPlanSlider],
      },
      experimentalFeatures: {
        getFeature: () => false,
      },
      ipinfoClient: {
        getCountryCode: () => 'CL',
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
              <Route path="/plan-selection/premium/:planType" element={<PlanCalculator />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    await waitFor(() => {
      const slider = screen.queryByRole('slider');
      expect(slider).not.toBeInTheDocument();
    });
  });

  it('should render Unexpected error when has error', async () => {
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
            },
          },
        },
      },
      planService: {
        getPlanTypes: async () => {
          throw 'something wrong';
        },
      },
      experimentalFeatures: {
        getFeature: () => false,
      },
      ipinfoClient: {
        getCountryCode: () => 'CL',
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
              <Route path="/plan-selection/premium/:planType" element={<PlanCalculator />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const unexpectedError = screen.getByTestId('unexpected-error');
    expect(unexpectedError).toBeInTheDocument();
  });

  it('should make redirect when only by emails tab when the current plan is by emails', async () => {
    // Arrange
    const planTypes = [PLAN_TYPE.byEmail];
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.byEmail,
              },
            },
          },
        },
      },
      planService: {
        getPlanTypes: async () => planTypes,
        getPlansByType: async () => plansByEmails,
      },
      experimentalFeatures: {
        getFeature: () => false,
      },
      ipinfoClient: {
        getCountryCode: () => 'CL',
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}`]}>
            <Routes>
              <Route path="/plan-selection/premium/:planType" element={<PlanCalculator />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const listTabs = screen.getByRole('list', { name: 'navigator tabs' });
    expect(listTabs.children.length).toBe(planTypes.length);
    const byEmailsTab = getByText(
      listTabs,
      `plan_calculator.plan_type_${PLAN_TYPE.byEmail.replace('-', '_')}`,
    );
    expect(byEmailsTab).toBeInTheDocument();

    const byContactsTab = queryByText(
      listTabs,
      `plan_calculator.plan_type_${PLAN_TYPE.byContact.replace('-', '_')}`,
    );
    expect(byContactsTab).not.toBeInTheDocument();
    const byCreditsTab = queryByText(
      listTabs,
      `plan_calculator.plan_type_${PLAN_TYPE.byCredit.replace('-', '_')}`,
    );
    expect(byCreditsTab).not.toBeInTheDocument();
  });

  it('should make redirect to by contacts tab when the current plan is by contacts', async () => {
    // Arrange
    const planTypes = [PLAN_TYPE.byContact];
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.byContact,
              },
            },
          },
        },
      },
      planService: {
        getPlanTypes: async () => planTypes,
        getPlansByType: async () => plansByContacts,
      },
      experimentalFeatures: {
        getFeature: () => false,
      },
      ipinfoClient: {
        getCountryCode: () => 'CL',
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
              <Route path="/plan-selection/premium/:planType" element={<PlanCalculator />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const listTabs = screen.getByRole('list', { name: 'navigator tabs' });
    expect(listTabs.children.length).toBe(planTypes.length);
    const byContactsTab = getByText(
      listTabs,
      `plan_calculator.plan_type_${PLAN_TYPE.byContact.replace('-', '_')}`,
    );
    expect(byContactsTab).toBeInTheDocument();

    const byCreditsTab = queryByText(
      listTabs,
      `plan_calculator.plan_type_${PLAN_TYPE.byCredit.replace('-', '_')}`,
    );
    expect(byCreditsTab).not.toBeInTheDocument();
    const byEmailsTab = queryByText(
      listTabs,
      `plan_calculator.plan_type_${PLAN_TYPE.byEmail.replace('-', '_')}`,
    );
    expect(byEmailsTab).not.toBeInTheDocument();
  });

  it('should be visible current description type', async () => {
    // Arrange
    const planTypes = [PLAN_TYPE.byContact];
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.byContact,
                planSubscription: 3,
              },
            },
          },
        },
      },
      planService: {
        getPlanTypes: async () => planTypes,
        getPlansByType: async () => plansByContacts,
      },
      experimentalFeatures: {
        getFeature: () => false,
      },
      ipinfoClient: {
        getCountryCode: () => 'CL',
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
              <Route path="/plan-selection/premium/:planType" element={<PlanCalculator />} />
            </Routes>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    screen.getByText('plan_calculator.current_subscription');
    expect(screen.queryByText('plan_calculator.discount_title')).not.toBeInTheDocument();
  });

  describe('Redirections when the type of plan is by email', () => {
    [
      {
        testName: `should return tag url by email when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byContact]
        }`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byContact],
      },
      {
        testName: `should return tag url by email when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byCredit]
        }`,
        planTypeUrlSegment: PLAN_TYPE.byCredit,
      },
    ].map((useCase) =>
      it(useCase.testName, async () => {
        // Arrange
        const currentPlan = {
          isFreeAccount: false,
          planType: PLAN_TYPE.byEmail,
          planSubscription: 1,
        };
        const window = {
          location: {
            search: '?promo-code=TEST_PROMOCODE',
          },
        };
        const { planTypeUrlSegment } = useCase;
        const expectedUrl = `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}${
          window.location.search
        }`;

        // Act
        const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

        // Assert
        expect(urlToRedirect).toBe(expectedUrl);
      }),
    );

    it(`should return "null" when the path is ${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}`, async () => {
      // Arrange
      const currentPlan = {
        isFreeAccount: false,
        planType: PLAN_TYPE.byEmail,
        planSubscription: 1,
      };
      const window = {
        location: {
          search: '?promo-code=TEST_PROMOCODE',
        },
      };
      const planTypeUrlSegment = URL_PLAN_TYPE[PLAN_TYPE.byEmail];

      // Act
      const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

      // Assert
      // because don't need to make redirect
      expect(urlToRedirect).toBeNull();
    });
  });

  describe('Redirections when the type of plan is by contact', () => {
    [
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byEmail]
        } and subscription is for three months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byEmail],
        planSubscription: 3,
      },
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byEmail]
        } and subscription is for six months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byEmail],
        planSubscription: 6,
      },
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byEmail]
        } and subscription is for twelve months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byEmail],
        planSubscription: 12,
      },
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byCredit]
        } and subscription is for three months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byCredit],
        planSubscription: 3,
      },
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byCredit]
        } and subscription is for six months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byCredit],
        planSubscription: 6,
      },
      {
        testName: `should return tag url by contact when the path is ${
          URL_PLAN_TYPE[PLAN_TYPE.byCredit]
        } and subscription is for twelve months`,
        planTypeUrlSegment: URL_PLAN_TYPE[PLAN_TYPE.byCredit],
        planSubscription: 12,
      },
    ].map((useCase) =>
      it(useCase.testName, async () => {
        // Arrange
        const currentPlan = {
          isFreeAccount: false,
          planType: PLAN_TYPE.byContact,
          planSubscription: useCase.planSubscription,
        };
        const window = {
          location: {
            search: '?promo-code=TEST_PROMOCODE',
          },
        };
        const { planTypeUrlSegment } = useCase;
        const expectedUrl = `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}${
          window.location.search
        }`;

        // Act
        const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

        // Assert
        expect(urlToRedirect).toBe(expectedUrl);
      }),
    );

    it(`should return tag url by contact when the path is ${
      URL_PLAN_TYPE[PLAN_TYPE.byCredit]
    } and subscription for one month`, async () => {
      // Arrange
      const currentPlan = {
        isFreeAccount: false,
        planType: PLAN_TYPE.byContact,
        planSubscription: 1,
      };
      const window = {
        location: {
          search: '?promo-code=TEST_PROMOCODE',
        },
      };
      const planTypeUrlSegment = URL_PLAN_TYPE[PLAN_TYPE.byCredit];
      const expectedUrl = `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}${
        window.location.search
      }`;

      // Act
      const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

      // Assert
      expect(urlToRedirect).toBe(expectedUrl);
    });

    it(`should return "null" when the path is ${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`, async () => {
      // Arrange
      const currentPlan = {
        isFreeAccount: false,
        planType: PLAN_TYPE.byContact,
        planSubscription: 1,
      };
      const window = {
        location: {
          search: '?promo-code=TEST_PROMOCODE',
        },
      };
      const planTypeUrlSegment = URL_PLAN_TYPE[PLAN_TYPE.byContact];

      // Act
      const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

      // Assert
      // because don't need to make redirect
      expect(urlToRedirect).toBeNull();
    });

    it(`should return "null" when the path is ${
      URL_PLAN_TYPE[PLAN_TYPE.byEmail]
    } and subcription for one month`, async () => {
      // Arrange
      const currentPlan = {
        isFreeAccount: false,
        planType: PLAN_TYPE.byContact,
        planSubscription: 1,
      };
      const window = {
        location: {
          search: '?promo-code=TEST_PROMOCODE',
        },
      };
      const planTypeUrlSegment = URL_PLAN_TYPE[PLAN_TYPE.byEmail];
      const expectedUrl = `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}${
        window.location.search
      }`;

      // Act
      const urlToRedirect = getDefaultPlanType({ currentPlan, planTypeUrlSegment, window });

      // Assert
      // because don't need to make redirect
      expect(urlToRedirect).toBe(expectedUrl);
    });
  });
});
