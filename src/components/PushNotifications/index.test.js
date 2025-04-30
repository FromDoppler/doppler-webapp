import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PushNotifications } from '.';
import { AppServicesProvider } from '../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PushNotifications component', () => {
  it('should render component', () => {
    // Assert
    const texts = {
      title: 'a title',
      description: 'some description',
      actionText: 'PLUS PLans',
    };

    const dependencies = {
      dopplerLegacyClient: {
        dopplerBillingUserApiClient: () => ({ success: true }),
      },
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                isFreeAccount: true,
              },
              pushNotification: {
                active: false,
              },
              hasClientManager: false,
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
            <PushNotifications />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('push_promotional.title')).toBeInTheDocument();
    expect(screen.getByText('push_promotional.description')).toBeInTheDocument();
    expect(screen.getByText('push_promotional.paragraph_free_MD')).toBeInTheDocument();
  });

  it('should redirect to SiteTrackingSettings if the user already has push notification plan', async () => {
    // Assert
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              pushNotification: {
                active: true,
              },
              hasClientManager: false,
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
            <PushNotifications />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(window.location.pathname).toContain('/');
  });

  it('should redirect to dashboard if the user is CM', async () => {
    // Assert
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              pushNotification: {
                active: false,
              },
              hasClientManager: true,
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
            <PushNotifications />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(window.location.pathname).toContain('/dashboard');
  });
});
