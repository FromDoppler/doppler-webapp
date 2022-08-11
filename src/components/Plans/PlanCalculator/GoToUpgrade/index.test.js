import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { GoToUpgrade } from '.';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../../doppler-types';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { allPlans } from '../../../../services/doppler-legacy-client.doubles';
import { AppServicesProvider } from '../../../../services/pure-di';

const getDependencies = (planData, planTypes) => {
  return {
    appSessionRef: {
      current: {
        userData: {
          user: {
            plan: planData,
          },
        },
      },
    },
    planService: {
      getPlanTypes: async () => planTypes,
      getPlansByType: async () => allPlans,
    },
  };
};

describe('GoToUpgrade Component', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
  });

  it('should go to plan calculator when is a trial account', async () => {
    //Arrange
    const dependencies = getDependencies(
      {
        idPlan: 3,
        isFreeAccount: true,
        planType: PLAN_TYPE.free,
      },
      [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit],
    );

    //Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router
            initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`]}
          >
            <Routes>
              <Route path="/plan-selection/premium/:planType" element={<GoToUpgrade />} />
            </Routes>
          </Router>
        </IntlProvider>
        ,
      </AppServicesProvider>,
    );

    //Assert
    const planCalculatorTitle = await screen.findByText('plan_calculator.plan_premium_title');
    expect(planCalculatorTitle).toBeInTheDocument();
  });

  it('should go to plan calculator when is a credits account', async () => {
    //Arrange
    const dependencies = getDependencies(
      {
        isFreeAccount: false,
        planType: PLAN_TYPE.byCredit,
      },
      [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit],
    );

    //Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/plan-selection/premium/${
                URL_PLAN_TYPE[PLAN_TYPE.byCredit]
              }?PromoCode=S4NV4L3NT1N&origin_inbound=fake`,
            ]}
          >
            <Routes>
              <Route path="/plan-selection/premium/:planType" element={<GoToUpgrade />} />
            </Routes>
          </Router>
        </IntlProvider>
        ,
      </AppServicesProvider>,
    );

    //Assert
    const planCalculatorTitle = screen.queryByText('plan_calculator.plan_premium_title');
    expect(planCalculatorTitle).not.toBeInTheDocument();
  });

  it('should go to plan calculator when is a emails account', async () => {
    //Arrange
    const dependencies = getDependencies(
      {
        isFreeAccount: false,
        planType: PLAN_TYPE.byContact,
      },
      [PLAN_TYPE.byContact],
    );

    //Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router
            initialEntries={[
              `/plan-selection/premium/${
                URL_PLAN_TYPE[PLAN_TYPE.byContact]
              }?PromoCode=S4NV4L3NT1N&origin_inbound=fake`,
            ]}
          >
            <Routes>
              <Route path="/plan-selection/premium/:planType" element={<GoToUpgrade />} />
            </Routes>
          </Router>
        </IntlProvider>
        ,
      </AppServicesProvider>,
    );

    //Assert
    const planCalculatorTitle = await screen.findByText('plan_calculator.plan_premium_title');
    expect(planCalculatorTitle).toBeInTheDocument();
  });

  it('should go to plan calculator when is a semestral contacts account', async () => {
    //Arrange
    const dependencies = getDependencies(
      {
        idPlan: 3,
        isFreeAccount: false,
        planType: PLAN_TYPE.byContact,
        planSubscription: 6,
      },
      [PLAN_TYPE.byContact],
    );

    //Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <Router
            initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`]}
          >
            <Routes>
              <Route path="/plan-selection/premium/:planType" element={<GoToUpgrade />} />
            </Routes>
          </Router>
        </IntlProvider>
        ,
      </AppServicesProvider>,
    );

    //Assert
    const planCalculatorTitle = await screen.findByText('plan_calculator.plan_premium_title');
    expect(planCalculatorTitle).toBeInTheDocument();
  });
});
