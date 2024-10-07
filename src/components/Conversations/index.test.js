import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Conversations } from '.';
import { AppServicesProvider } from '../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('Conversations component', () => {
  it('should render component', () => {
    // Assert
    const texts = {
      title: 'a title',
      description: 'some description',
      actionText: 'PLUS PLans',
    };

    const dependencies = {
      dopplerLegacyClient: {
        activateConversationPlan: () => ({ success: true }),
      },
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                isFreeAccount: true,
              },
              chat: {
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
            <Conversations />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('conversations.title')).toBeInTheDocument();
    expect(screen.getByText('conversations.description')).toBeInTheDocument();
    expect(screen.getByText('conversations.paragraph_free_MD')).toBeInTheDocument();
  });

  it('should redirect to dashboard if the user already has beplic account', async () => {
    // Assert
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              chat: {
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
            <Conversations />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(window.location.pathname).toContain('/dashboard');
  });

  it('should redirect to dashboard if the user is CM', async () => {
    // Assert
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              chat: {
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
            <Conversations />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(window.location.pathname).toContain('/dashboard');
  });
});
