import { BrowserRouter } from 'react-router-dom';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { EcoAIPlan } from '.';

describe('EcoAIPlan component', () => {
  it('should render component', async () => {
    // Assert
    var ecoAiPlan = {
      active: true,
      additional: 0,
    };

    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              addOnPromotions: [],
              plan: {
                isFreeAccount: false,
                planType: 'subscribers',
                maxSubscribers: 500,
                itemDescription: 'subscribers',
                remainingCredits: 500,
                planSubscription: 1,
              },
            },
          },
        },
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <AppServicesProvider forcedServices={dependencies}>
          <BrowserRouter>
            <IntlProvider>
              <EcoAIPlan addOnPromotions={[]} ecoAiPlan={ecoAiPlan} />
            </IntlProvider>
          </BrowserRouter>
        </AppServicesProvider>
        ,
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('my_plan.subscription_details.addon.eco_ai_plan.title'),
    ).toBeInTheDocument();
  });
});
