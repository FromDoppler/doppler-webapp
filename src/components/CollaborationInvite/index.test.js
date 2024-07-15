import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, screen, act } from '@testing-library/react';
import { AppServicesProvider } from '../../services/pure-di';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider';
import { MemoryRouter as Router } from 'react-router-dom';
import { CollaboratorsInvite } from '.';

describe('CollaborationInvite', () => {
  afterEach(cleanup);

  it('should show expired error when api response success is false and message is "Expired link"', async () => {
    // Arrange

    const dependencies = {
      dopplerSitesClient: {
        getBannerData: async () => {
          return { success: false, error: new Error('Dummy error') };
        },
      },
      dopplerLegacyClient: {
        confirmCollaborationinvite: () => ({ success: false, message: 'Expired link' }),
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="es">
          <Router>
            <CollaboratorsInvite />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    act(() => expect(screen.getByTestId('unexpected-error')).toBeInTheDocument());
    act(() =>
      expect(
        screen.findAllByText('validation_messages.error_expired_invitation_link'),
      ).not.toBeNull(),
    );
  });

  it('should not show error when api response success is true', async () => {
    // Arrange

    const dependencies = {
      dopplerSitesClient: {
        getBannerData: async () => {
          return { success: false, error: new Error('Dummy error') };
        },
      },
      dopplerLegacyClient: {
        confirmCollaborationinvite: () => ({ success: true, message: 'Missing Account' }),
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <DopplerIntlProvider locale="es">
          <Router>
            <CollaboratorsInvite />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    act(() =>
      expect(screen.getByTestId('unexpected-error')).not.toContainHTML(
        '<p>validation_messages.error_expired_invitation_link</p>',
      ),
    );
  });
});
