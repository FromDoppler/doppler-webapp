import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { AppServicesProvider } from '../../services/pure-di';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider';
import { MemoryRouter as Router } from 'react-router-dom';
import { CollaboratorsInvite } from '.';

jest.mock('../../services/ipinfo-client', () => ({
  __esModule: true,
  HttpIpinfoClient: class {
    getCountryCode = async () => 'AR';
  },
}));

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
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByTestId('unexpected-error')).toBeInTheDocument();
    expect(screen.getByTestId('unexpected-error')).toHaveTextContent(
      /aviso importante|invitación como colaborador ha expirado/i,
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
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.getByTestId('collaboration-invite-form')).toBeInTheDocument();
    expect(screen.queryByTestId('unexpected-error')).not.toBeInTheDocument();
  });
});
