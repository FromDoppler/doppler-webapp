import { BrowserRouter } from 'react-router-dom';
import { MyPlan } from '.';
import { AppServicesProvider } from '../../services/pure-di';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('OnSite component', () => {
  it('should render component', () => {
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
          <DopplerIntlProvider>
            <MyPlan />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Mi plan')).toBeInTheDocument();
  });
});
