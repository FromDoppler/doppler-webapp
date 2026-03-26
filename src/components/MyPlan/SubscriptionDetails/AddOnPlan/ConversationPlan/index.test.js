import { BrowserRouter } from 'react-router-dom';
import { ConversationPlan } from '.';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';

describe('ConversationPlan component', () => {
  it('should render component', async () => {
    // Assert
    var conversationPlan = {
      active: true,
      additionalConversation: 0,
    };

    const dependencies = {
      dopplerBeplicApiClient: {
        getConversations: () => ({ success: true }),
      },
      dopplerConversationsApiClient: {
        getConversations: () => ({ success: true }),
      },
      appSessionRef: {
        current: {
          userData: {
            user: {
              conversationsEnvSource: 'DOPPLER',
              addOnPromotions: [],
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
              <ConversationPlan addOnPromotions={[]} conversationPlan={conversationPlan} />
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

  it('should show the information about conversation plan', async () => {
    // Assert
    var conversationPlan = {
      active: true,
      additionalConversation: 0,
    };

    const dependencies = {
      dopplerBeplicApiClient: {
        getConversations: () => ({ success: true }),
      },
      dopplerConversationsApiClient: {
        getConversations: () => ({ success: true }),
      },
      appSessionRef: {
        current: {
          userData: {
            user: {
              conversationsEnvSource: 'DOPPLER',
              addOnPromotions: [],
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
                  trialExpired: false,
                },
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
              <ConversationPlan addOnPromotions={[]} conversationPlan={conversationPlan} />
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
      screen.getByText('my_plan.subscription_details.addon.conversation_plan.title'),
    ).toBeInTheDocument();
    expect(screen.getByText('my_plan.subscription_details.change_plan_button')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.addon.conversation_plan.plan_message'),
    ).toBeInTheDocument();
  });
});
