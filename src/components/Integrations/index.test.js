import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntegrationsSection } from '.';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../services/pure-di';

describe('Integration Section component', () => {
  const integrationSectionDouble = (showStatus) => ({
    getControlPanelSections: () => [
      {
        title: 'integrations.native_integrations.title',
        showStatus: showStatus,
        boxes: [
          {
            linkUrl: 'integrations.external_integrations.dynamics_link_url',
            imgSrc: 'Imagen1',
            imgAlt: 'integrations.native_integrations.google_Analityc_title',
            iconName: 'integrations.native_integrations.google_Analityc_title',
            status: 'disconnected',
          },
          {
            linkUrl: 'integrations.external_integrations.dynamics_link_url',
            imgSrc: 'image2',
            imgAlt: 'integrations.native_integrations.zoho_title',
            iconName: 'integrations.native_integrations.zoho_title',
            status: 'alert',
          },
          {
            linkUrl: 'integrations.external_integrations.dynamics_link_url',
            imgSrc: 'image3',
            imgAlt: 'integrations.native_integrations.tokko_title',
            iconName: 'integrations.native_integrations.tokko_title',
            status: 'connected',
          },
        ],
      },
    ],
  });

  const dependencies = (showStatus) => ({
    controlPanelService: integrationSectionDouble(showStatus),
  });

  const IntegrationsSectionComponent = ({ showStatus = false }) => {
    return (
      <AppServicesProvider forcedServices={dependencies(showStatus)}>
        <DopplerIntlProvider>
          <IntegrationsSection />
        </DopplerIntlProvider>
      </AppServicesProvider>
    );
  };

  it('should render sections and boxes', async () => {
    // Act
    render(<IntegrationsSectionComponent />);

    // Assert
    expect(screen.getByRole('heading', { name: 'integrations.native_integrations.title' }));
    expect(
      screen.getByText('integrations.native_integrations.google_Analityc_title'),
    ).toBeInTheDocument();
  });

  it('should render status description title', async () => {
    // Act
    render(<IntegrationsSectionComponent showStatus={true} />);

    // Assert
    expect(screen.getByText('integrations.status_alert')).toBeInTheDocument();
    expect(screen.getByText('integrations.status_not_connected')).toBeInTheDocument();
    expect(screen.getByText('integrations.status_connected')).toBeInTheDocument();
  });

  it('should not render status description title', async () => {
    // Act
    render(<IntegrationsSectionComponent />);

    // Assert
    expect(screen.queryByText('integrations.status_alert')).not.toBeInTheDocument();
    expect(screen.queryByText('integrations.status_not_connected')).not.toBeInTheDocument();
    expect(screen.queryByText('integrations.status_connected')).not.toBeInTheDocument();
  });

  it('should render boxes ordered by status', async () => {
    // Act
    render(<IntegrationsSectionComponent />);

    // Assert
    const boxesList = screen.getByLabelText('Boxes Container').childNodes;
    expect(boxesList[0]).toHaveTextContent('integrations.native_integrations.zoho_title');
    expect(boxesList[1]).toHaveTextContent('integrations.native_integrations.tokko_title');
    expect(boxesList[2]).toHaveTextContent(
      'integrations.native_integrations.google_Analityc_title',
    );
  });
});
