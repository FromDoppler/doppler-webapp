import { BrowserRouter } from 'react-router-dom';
import { SubscriptionDetails } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider';
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
          <DopplerIntlProvider>
            <SubscriptionDetails />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.queryByText('Plan de conversaciones')).not.toBeInTheDocument();
    expect(screen.queryByText('Pack de Landing pages')).not.toBeInTheDocument();
    expect(screen.queryByText('Plan de onsite')).not.toBeInTheDocument();
    expect(screen.queryByText('Plan de notificaciones push')).not.toBeInTheDocument();
  });

  it('should render component - Email Marketing Plan with Chat Plan', async () => {
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
          <DopplerIntlProvider>
            <SubscriptionDetails />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Plan de conversaciones')).toBeInTheDocument();
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
          <DopplerIntlProvider>
            <SubscriptionDetails />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Pack de Landing pages')).toBeInTheDocument();
  });

  it('should render component - Email Marketing Plan with OnSite Plan', async () => {
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
          <DopplerIntlProvider>
            <SubscriptionDetails />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Plan de onsite')).toBeInTheDocument();
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
          <DopplerIntlProvider>
            <SubscriptionDetails />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Plan de notificaciones push')).toBeInTheDocument();
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
            <SubscriptionDetails />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Plan de email marketing')).toBeInTheDocument();
    expect(screen.getByText('Envío y automatización de SMS')).toBeInTheDocument();
  });
});
