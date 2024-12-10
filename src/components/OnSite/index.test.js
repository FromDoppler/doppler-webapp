import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { OnSite } from '.';
import { AppServicesProvider } from '../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('OnSite component', () => {
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
              onSite: {
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
            <OnSite />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('onsite_promotional.title')).toBeInTheDocument();
    expect(screen.getByText('onsite_promotional.description')).toBeInTheDocument();
    expect(screen.getByText('onsite_promotional.paragraph_free_MD')).toBeInTheDocument();
  });

  it('should redirect to widgets if the user already has onsite plan', async () => {
    // Assert
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              onSite: {
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
            <OnSite />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(window.location.href).toContain('/popup-hub/widgets');
  });

  it('should redirect to dashboard if the user is CM', async () => {
    // Assert
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              onSite: {
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
            <OnSite />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(window.location.pathname).toContain('/dashboard');
  });
});
