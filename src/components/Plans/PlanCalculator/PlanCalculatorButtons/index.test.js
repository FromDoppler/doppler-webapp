import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
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
            },
          },
        },
      },
    },
  };

  it('should render PlanCalculatorButtons when selected plan is different to user current plan', async () => {
    // Arrange
    const selectedPlanId = 2;
    const selectedDiscountId = 1;

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
            {/* <Route path="/plan-selection/premium/:planType?"> */}
            <PlanCalculatorButtons
              selectedPlanId={selectedPlanId}
              selectedDiscountId={selectedDiscountId}
            />
            {/* </Route> */}
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const purchaseLink = screen.getByText('plan_calculator.button_purchase');
    expect(purchaseLink).not.toHaveClass('disabled');
  });

  it('should render PlanCalculatorButtons when selected plan is equal to user current plan', async () => {
    // Arrange
    const selectedPlanId = 3;
    const selectedDiscountId = 1;

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
            {/* <Route path="/plan-selection/premium/:planType?"> */}
            <PlanCalculatorButtons
              selectedPlanId={selectedPlanId}
              selectedDiscountId={selectedDiscountId}
            />
            {/* </Route> */}
          </Router>
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const purchaseLink = screen.getByText('plan_calculator.button_purchase');
    expect(purchaseLink).toHaveClass('disabled');
  });
});
