import { BrowserRouter } from 'react-router-dom';
import { OnSitePlan } from '.';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('OnSitePlan component', () => {
  it('should render component', async () => {
    // Assert
    var onSitePlan = {
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
              <OnSitePlan addOnPromotions={[]} onSitePlan={onSitePlan} />
            </IntlProvider>
          </BrowserRouter>
        </AppServicesProvider>
        ,
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('should show the expired message when the plan is trial expired', async () => {
    // Assert
    var onSitePlan = {
      active: true,
      additional: 0,
      trialExpired: true,
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
              <OnSitePlan addOnPromotions={[]} onSitePlan={onSitePlan} />
            </IntlProvider>
          </BrowserRouter>
        </AppServicesProvider>
        ,
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(
      screen.getByText('my_plan.subscription_details.addon_plan_expired_message'),
    ).toBeInTheDocument();
  });
});
