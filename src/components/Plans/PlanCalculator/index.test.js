import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { PlanCalculator } from '.';
import { PLAN_TYPE } from '../../../doppler-types';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';

describe('PlanCalculator component', () => {
  it('should render PlanCalculator when receive tabs', async () => {
    // Arrange
    const planTypes = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit];
    const forcedServices = {
      planService: {
        getPlanTypes: async () => planTypes,
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <Router>
            <PlanCalculator />
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

  it('should render Unexpected error when has error', async () => {
    // Arrange
    const planTypes = [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit];
    const forcedServices = {
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
          <Router>
            <PlanCalculator />
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
