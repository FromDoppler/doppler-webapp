import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { PlanCalculator } from '.';
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
              },
            },
          },
        },
      },
      planService: {
        getPlanTypes: async () => planTypes,
        getPlansByType: async () => plansByContacts,
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router
            initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`]}
          >
            <Route path="/plan-selection/premium/:planType?">
              <PlanCalculator />
            </Route>
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
    it(testName, async () => {
      // Arrange
      const planTypes = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit];
      const forcedServices = {
        appSessionRef: {
          current: {
            userData: {
              user: {
                plan: {
                  idPlan: plansByType[plansByType.length - 1].id,
                },
              },
            },
          },
        },
        planService: {
          getPlanTypes: async () => planTypes,
          getPlansByType: async () => plansByType,
        },
      };

      // Act
      render(
        <AppServicesProvider forcedServices={forcedServices}>
          <IntlProvider>
            <Router initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[planType]}`]}>
              <Route path="/plan-selection/premium/:planType?">
                <PlanCalculator />
              </Route>
            </Router>
          </IntlProvider>
        </AppServicesProvider>,
      );

      // Assert
      const loader = screen.getByTestId('wrapper-loading');
      await waitForElementToBeRemoved(loader);

      // simulates selection of the highest plan
      const slider = screen.getByRole('slider');
      userEvent.type(slider, `${plansByType.length - 1}`);
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
              },
            },
          },
        },
      },
      planService: {
        getPlanTypes: async () => planTypes,
        getPlansByType: async () => [highestPlanSlider],
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router
            initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`]}
          >
            <Route path="/plan-selection/premium/:planType?">
              <PlanCalculator />
            </Route>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const slider = screen.queryByRole('slider');
    expect(slider).not.toBeInTheDocument();
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
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router
            initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`]}
          >
            <Route path="/plan-selection/premium/:planType?">
              <PlanCalculator />
            </Route>
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
});
