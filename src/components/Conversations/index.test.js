import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Conversations } from '.';
import { AppServicesProvider } from '../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';

jest.mock('../RedirectToExternalUrl', () => (props) => (
  <div data-testid="redirect-to-external-url" data-to={props.to} />
));

const renderConversations = (dependencies) =>
  render(
    <AppServicesProvider forcedServices={dependencies}>
      <BrowserRouter>
        <DopplerIntlProvider>
          <Conversations />
        </DopplerIntlProvider>
      </BrowserRouter>
    </AppServicesProvider>,
  );

describe('Conversations component', () => {
  it('should activate the plan automatically and redirect for a free account with active trial (case 3)', async () => {
    // Arrange
    const activateConversationPlan = jest.fn().mockResolvedValue(true);
    const dependencies = {
      dopplerLegacyClient: { activateConversationPlan },
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: { isFreeAccount: true, trialExpired: false },
              chat: { active: false },
              hasClientManager: false,
            },
          },
        },
      },
    };

    // Act
    renderConversations(dependencies);

    // Assert
    expect(activateConversationPlan).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByTestId('redirect-to-external-url')).toBeInTheDocument());
  });

  it('should activate the plan automatically and redirect for a paid account (case 5)', async () => {
    // Arrange
    const activateConversationPlan = jest.fn().mockResolvedValue(true);
    const dependencies = {
      dopplerLegacyClient: { activateConversationPlan },
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: { isFreeAccount: false, trialExpired: false },
              chat: { active: false },
              hasClientManager: false,
            },
          },
        },
      },
    };

    // Act
    renderConversations(dependencies);

    // Assert
    expect(activateConversationPlan).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByTestId('redirect-to-external-url')).toBeInTheDocument());
  });

  it('should show the promotional page with the error message when the automatic activation fails', async () => {
    // Arrange
    const activateConversationPlan = jest.fn().mockResolvedValue(false);
    const dependencies = {
      dopplerLegacyClient: { activateConversationPlan },
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: { isFreeAccount: true, trialExpired: false },
              chat: { active: false },
              hasClientManager: false,
            },
          },
        },
      },
    };

    // Act
    renderConversations(dependencies);

    // Assert
    expect(activateConversationPlan).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByText('conversations.title')).toBeInTheDocument());
    expect(
      screen.getByText('validation_messages.error_unexpected_register_MD'),
    ).toBeInTheDocument();
  });

  it('should activate the plan automatically and redirect for a free account with expired trial (case 4)', async () => {
    // Arrange
    const activateConversationPlan = jest.fn().mockResolvedValue(true);
    const dependencies = {
      dopplerLegacyClient: { activateConversationPlan },
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: { isFreeAccount: true, trialExpired: true },
              chat: { active: false },
              hasClientManager: false,
            },
          },
        },
      },
    };

    // Act
    renderConversations(dependencies);

    // Assert
    expect(activateConversationPlan).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByTestId('redirect-to-external-url')).toBeInTheDocument());
  });

  it('should fall back to the promotional page with the "choose a plan" link when activation fails for an expired free account (case 4)', async () => {
    // Arrange
    const activateConversationPlan = jest.fn().mockResolvedValue(false);
    const dependencies = {
      dopplerLegacyClient: { activateConversationPlan },
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: { isFreeAccount: true, trialExpired: true },
              chat: { active: false },
              hasClientManager: false,
            },
          },
        },
      },
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    renderConversations(dependencies);

    // Assert
    expect(activateConversationPlan).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByText('conversations.title')).toBeInTheDocument());
    expect(screen.getByText('conversations.paragraph_free_expired_MD')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /conversations.actiontext_expired/i })).toHaveAttribute(
      'href',
      'conversations.actionUrl',
    );
    expect(
      screen.queryByText('validation_messages.error_unexpected_register_MD'),
    ).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should redirect to conversations external login if the user already has beplic account (case 1)', async () => {
    // Arrange
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              chat: { active: true },
              hasClientManager: false,
            },
          },
        },
      },
    };

    // Act
    renderConversations(dependencies);

    // Assert
    expect(window.location.pathname).toContain('/');
  });

  it('should redirect to dashboard if the user is CM (case 2)', async () => {
    // Arrange
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              chat: { active: false },
              hasClientManager: true,
            },
          },
        },
      },
    };

    // Act
    renderConversations(dependencies);

    // Assert
    expect(window.location.pathname).toContain('/dashboard');
  });
});
