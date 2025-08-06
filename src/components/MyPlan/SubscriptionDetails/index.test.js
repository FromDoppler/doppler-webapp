import { BrowserRouter } from 'react-router-dom';
import { SubscriptionDetails } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('SubscriptionDetails component', () => {
  it('should render component - Email Marketing Plan without AddOns Plan', () => {
    // Assert
    const dependencies = {
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
                plan: {
                  active: false,
                  conversationsQty: 200,
                  fee: 0,
                },
              },
              landings: {
                landingPacks: [],
              },
              onSite: {
                plan: {
                  acvtive: false,
                  quantity: 200,
                  fee: 0,
                },
              },
              pushNotification: {
                plan: {
                  active: false,
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
            <SubscriptionDetails />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(screen.queryByText('my_plan.subscription_details.sms.title')).not.toBeInTheDocument();
    expect(
      screen.queryByText('my_plan.subscription_details.addon.landings_plan.title'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('my_plan.subscription_details.addon.onsite_plan.title'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('my_plan.subscription_details.addon.push_notification_plan.title'),
    ).not.toBeInTheDocument();
  });

  it('should render component - Email Marketing Plan with Chat Plan', async () => {
    // Assert
    const dopplerUserApiClientDouble = {
      getCollaborationInvites: async () => {
        return { success: true, value: [] };
      },
    };

    const dependencies = {
      dopplerUserApiClient: dopplerUserApiClientDouble,
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
                plan: {
                  active: true,
                  conversationsQty: 200,
                  fee: 0,
                },
              },
              landings: {
                landingPacks: [],
              },
              onSite: {
                plan: {
                  active: false,
                  quantity: 200,
                  fee: 0,
                },
              },
              pushNotification: {
                plan: {
                  active: false,
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
            <SubscriptionDetails />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getAllByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.addon.conversation_plan.title'),
    ).toBeInTheDocument();
  });

  it('should render component - Email Marketing Plan with Landing Plan', () => {
    // Assert
    const dependencies = {
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
                plan: {
                  active: false,
                  conversationsQty: 200,
                  fee: 0,
                },
              },
              landings: {
                landingPacks: [{ landingsQty: 5, packageQty: 1 }],
              },
              onSite: {
                plan: {
                  active: false,
                  quantity: 200,
                  fee: 0,
                },
              },
              pushNotification: {
                plan: {
                  active: false,
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
            <SubscriptionDetails />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.addon.landings_plan.title'),
    ).toBeInTheDocument();
  });

  it('should render component - Email Marketing Plan with OnSite Plan', async () => {
    // Assert
    const dopplerUserApiClientDouble = {
      getCollaborationInvites: async () => {
        return { success: true, value: [] };
      },
    };

    const dependencies = {
      dopplerUserApiClient: dopplerUserApiClientDouble,
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
                plan: {
                  active: false,
                  conversationsQty: 200,
                  fee: 0,
                },
              },
              landings: {
                landingPacks: [],
              },
              onSite: {
                plan: {
                  active: true,
                  quantity: 200,
                  fee: 0,
                },
              },
              pushNotification: {
                plan: {
                  active: false,
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
            <SubscriptionDetails />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getAllByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.addon.onsite_plan.title'),
    ).toBeInTheDocument();
  });

  it('should render component - Email Marketing Plan with Push Notification Plan', async () => {
    // Assert
    const dependencies = {
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
                plan: {
                  active: false,
                  conversationsQty: 200,
                  fee: 0,
                },
              },
              landings: {
                landingPacks: [],
              },
              onSite: {
                plan: {
                  active: false,
                  quantity: 200,
                  fee: 0,
                },
              },
              pushNotification: {
                plan: {
                  active: true,
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
            <SubscriptionDetails />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.subscription_details.addon.push_notification_plan.title'),
    ).toBeInTheDocument();
  });

  it('should render component - Email Marketing Plan with SMS', async () => {
    // Assert
    const dependencies = {
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
                smsEnabled: true,
                remainingCredits: 10,
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
            <SubscriptionDetails />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.subscription_details.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.subscription_details.sms.title')).toBeInTheDocument();
  });
});
