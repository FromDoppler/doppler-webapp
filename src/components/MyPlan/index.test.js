import { BrowserRouter } from 'react-router-dom';
import { MyPlan } from '.';
import { AppServicesProvider } from '../../services/pure-di';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('OnSite component', () => {
  it('should render component', async () => {
    // Assert
    const dependencies = {
      dopplerLegacyClient: {
        dopplerBillingUserApiClient: () => ({ success: true }),
      },
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                isFreeAccount: false,
                planType: 'subscribers',
                maxSubscribers: 500,
                itemDescription: 'subscribers',
                remainingCredits: 500,
                planSubscription: 1,
              },
              chat: {
                active: false,
                plan: {
                  conversationsQty: 200,
                  fee: 0,
                },
              },
              landings: {
                landingPacks: [],
              },
              onSite: {
                active: false,
                plan: {
                  quantity: 200,
                  fee: 0,
                },
              },
              pushNotification: {
                active: false,
                plan: {
                  quantity: 200,
                  fee: 0,
                },
              },
              sms: {
                smsEnabled: false,
              },
            },
          },
        },
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <BrowserRouter>
          <IntlProvider>
            <MyPlan />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByText('my_plan.title')).toBeInTheDocument();
  });
});
