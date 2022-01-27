import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ControlPanel } from './ControlPanel';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../services/pure-di';

describe('Control Panel component', () => {
  const controlPanelSectionDouble = (showStatus) => ({
    getControlPanelSections: () => [
      {
        title: 'control_panel.account_preferences.title',
        showStatus: showStatus,
        boxes: [
          {
            linkUrl: 'control_panel.external_integrations.dynamics_link_url',
            imgSrc: 'Imagen1',
            imgAlt: 'control_panel.account_preferences.account_information_title',
            iconName: 'control_panel.account_preferences.account_information_title',
            status: 'disconnected',
          },
          {
            linkUrl: 'control_panel.external_integrations.dynamics_link_url',
            imgSrc: 'image2',
            imgAlt: 'control_panel.account_preferences.account_movements_title',
            iconName: 'control_panel.account_preferences.account_movements_title',
            status: 'alert',
          },
          {
            linkUrl: 'control_panel.external_integrations.dynamics_link_url',
            imgSrc: 'image3',
            imgAlt: 'control_panel.account_preferences.contact_information_title',
            iconName: 'control_panel.account_preferences.contact_information_title',
            status: 'connected',
          },
        ],
      },
    ],
  });

  const dependencies = (showStatus) => ({
    controlPanelService: controlPanelSectionDouble(showStatus),
  });

  const ControlPanelComponent = ({ showStatus = false }) => {
    return (
      <AppServicesProvider forcedServices={dependencies(showStatus)}>
        <DopplerIntlProvider>
          <ControlPanel />
        </DopplerIntlProvider>
      </AppServicesProvider>
    );
  };

  it('should render sections and boxes', async () => {
    // Act
    render(<ControlPanelComponent />);

    // Assert
    expect(screen.getByRole('heading', { name: 'control_panel.account_preferences.title' }));
    expect(
      screen.getByText('control_panel.account_preferences.account_information_title'),
    ).toBeInTheDocument();
  });

  it('should render status description title', async () => {
    // Act
    render(<ControlPanelComponent showStatus={true} />);

    // Assert
    expect(screen.getByText('control_panel.status_alert')).toBeInTheDocument();
    expect(screen.getByText('control_panel.status_not_connected')).toBeInTheDocument();
    expect(screen.getByText('control_panel.status_connected')).toBeInTheDocument();
  });

  it('should not render status description title', async () => {
    // Act
    render(<ControlPanelComponent />);

    // Assert
    expect(screen.queryByText('control_panel.status_alert')).not.toBeInTheDocument();
    expect(screen.queryByText('control_panel.status_not_connected')).not.toBeInTheDocument();
    expect(screen.queryByText('control_panel.status_connected')).not.toBeInTheDocument();
  });

  it('should render boxes ordered by status', async () => {
    // Act
    render(<ControlPanelComponent />);

    // Assert
    const boxesList = screen.getByLabelText('Boxes Container').childNodes;
    expect(boxesList[0]).toHaveTextContent(
      'control_panel.account_preferences.account_movements_title',
    );
    expect(boxesList[1]).toHaveTextContent(
      'control_panel.account_preferences.contact_information_title',
    );
    expect(boxesList[2]).toHaveTextContent(
      'control_panel.account_preferences.account_information_title',
    );
  });
});
