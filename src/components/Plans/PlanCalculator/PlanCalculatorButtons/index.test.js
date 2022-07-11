import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { PlanCalculatorButtons } from '.';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../../doppler-types';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';

describe('PlanCalculator component', () => {
  const forcedServices = {
    appSessionRef: {
      current: {
        userData: {
          user: {
            plan: {
              idPlan: 3,
              planType: PLAN_TYPE.free,
              planSubscription: 1,
            },
          },
        },
      },
    },
    experimentalFeatures: {
      getFeature: () => false,
    },
    ipinfoClient: {
      getCountryCode: () => 'AR',
    },
  };

  it('should render PlanCalculatorButtons when the user is free', async () => {
    // Arrange
    const selectedPlanId = 2;
    const selectedDiscount = {
      id: 1,
      numberMonths: 1,
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/plan-selection/premium/${
                URL_PLAN_TYPE[PLAN_TYPE.byContact]
              }?promo-code=fake-promo-code&origin_inbound=fake`,
            ]}
          >
            <Route path="/plan-selection/premium/:planType?">
              <PlanCalculatorButtons
                selectedPlanId={selectedPlanId}
                selectedDiscount={selectedDiscount}
              />
            </Route>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const purchaseLink = screen.getByText('plan_calculator.button_purchase');
    expect(purchaseLink).not.toHaveClass('disabled');
    expect(purchaseLink).toHaveAttribute(
      'href',
      `/checkout/premium/${PLAN_TYPE.byContact}?selected-plan=${selectedPlanId}` +
        `&discountId=${selectedDiscount.id}` +
        `&PromoCode=fake-promo-code&origin_inbound=fake`,
    );
  });

  it('should render PlanCalculatorButtons when the user is not free', async () => {
    // Arrange
    const selectedPlanId = 2;
    const selectedDiscount = {
      id: 1,
      numberMonths: 1,
    };

    const fakeForcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.byContact,
                planSubscription: 1,
              },
            },
          },
        },
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={fakeForcedServices}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/plan-selection/premium/${
                URL_PLAN_TYPE[PLAN_TYPE.byContact]
              }?promo-code=fake-promo-code&origin_inbound=fake`,
            ]}
          >
            <Route path="/plan-selection/premium/:planType?">
              <PlanCalculatorButtons
                selectedPlanId={selectedPlanId}
                selectedDiscount={selectedDiscount}
              />
            </Route>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const purchaseLink = screen.getByText('plan_calculator.button_purchase');
    expect(purchaseLink).not.toHaveClass('disabled');
    expect(purchaseLink).toHaveAttribute(
      'href',
      'common.control_panel_section_url' +
        `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${selectedPlanId}&fromStep1=True` +
        `&IdDiscountPlan=${selectedDiscount.id}` +
        `&PromoCode=fake-promo-code&origin_inbound=fake`,
    );
  });

  it('should render PlanCalculatorButtons when selected plan is equal to user current plan', async () => {
    // Arrange
    const selectedPlanId = 3;
    const selectedDiscount = {
      id: 1,
      numberMonths: 1,
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/plan-selection/premium/${
                URL_PLAN_TYPE[PLAN_TYPE.byContact]
              }?promo-code=fake-promo-code`,
            ]}
          >
            <Route path="/plan-selection/premium/:planType?">
              <PlanCalculatorButtons
                selectedPlanId={selectedPlanId}
                selectedDiscount={selectedDiscount}
              />
            </Route>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const purchaseLink = screen.getByText('plan_calculator.button_purchase');
    expect(purchaseLink).toHaveClass('disabled');
  });

  it('The buy button shoud be disabled when user has plan y discount equal to selected', async () => {
    // Arrange
    const selectedPlanId = 2;
    const selectedDiscount = {
      id: 1,
      numberMonths: 3,
    };

    const fakeForcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 2,
                planType: PLAN_TYPE.byContact,
                planSubscription: 3,
              },
            },
          },
        },
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={fakeForcedServices}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/plan-selection/premium/${
                URL_PLAN_TYPE[PLAN_TYPE.byContact]
              }?promo-code=fake-promo-code&origin_inbound=fake`,
            ]}
          >
            <Route path="/plan-selection/premium/:planType?">
              <PlanCalculatorButtons
                selectedPlanId={selectedPlanId}
                selectedDiscount={selectedDiscount}
              />
            </Route>
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const purchaseLink = screen.getByText('plan_calculator.button_purchase');
    expect(purchaseLink).toHaveClass('disabled');
  });
});
