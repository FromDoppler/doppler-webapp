import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PlanCalculator } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { allPlans } from '../../../services/doppler-legacy-client.doubles';
import { PLAN_TYPE } from '../../../doppler-types';

describe('PlanCalculator component', () => {
  it('should render PlanCalculator', async () => {
    // Arrange
    const forcedServices = {
      planService: {
        getPlanList: async () => allPlans,
        getPlanTypes: () => [PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit],
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <PlanCalculator />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });
});
