import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { AppServicesProvider } from '../../../services/pure-di';
import { PLAN_TYPE } from '../../../doppler-types';
import { BuyConversation } from '.';
import { createMemoryHistory } from 'history';
import { Outlet, Route, MemoryRouter as Router, Routes, useLocation } from 'react-router-dom';
import { DELAY_BEFORE_REDIRECT_TO_SUMMARY } from '../Checkout/PurchaseSummary/PlanPurchase';
import { IntlProvider } from 'react-intl';
import { Dashboard } from '../../Dashboard/Dashboard';

const RouterInspector = ({ target }) => {
  const location = useLocation();

  target.location = location;
  return null;
};

describe('BuyConversation component', () => {
  it('should redirect dasbhord when the user has not chat plan active', async () => {
    // Arrange
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.byContact,
                planDiscount: 0,
              },
              chat: {
                active: false,
              },
            },
          },
        },
      },
    };

    const expectedUrl = '/dashboard';
    const currentRouteState = {};

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <Router initialEntries={[`/buy-conversation?buyType=2`]} history={history}>
          <RouterInspector target={currentRouteState} />
          <Routes>
            <Route path="/dashboard" element={<Outlet />} />
            <Route path="/buy-conversation" element={<BuyConversation />} />
          </Routes>
        </Router>
      </AppServicesProvider>,
    );

    // Assert
    expect(currentRouteState.location.pathname).toBe(expectedUrl);
  });
});

describe('BuyConversation component', () => {
  it('should redirect buy plan chat when the user has chat plan active', async () => {
    // Arrange
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                idPlan: 3,
                planType: PLAN_TYPE.byContact,
                planDiscount: 0,
              },
              chat: {
                active: true,
              },
            },
          },
        },
      },
    };

    const expectedUrl = '/plan-chat/premium/subscribers';
    const currentRouteState = {};

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <Router initialEntries={[`/buy-conversation?buyType=2`]} history={history}>
          <RouterInspector target={currentRouteState} />
          <Routes>
            <Route path="plan-chat/premium/subscribers" element={<Outlet />} />
            <Route path="/buy-conversation" element={<BuyConversation />} />
          </Routes>
        </Router>
      </AppServicesProvider>,
    );

    // Assert
    expect(currentRouteState.location.pathname).toBe(expectedUrl);
  });
});
