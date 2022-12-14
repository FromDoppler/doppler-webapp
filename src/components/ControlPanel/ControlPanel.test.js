import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ControlPanel } from './ControlPanel';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../services/pure-di';

describe('Control Panel component', () => {
  const controlPanelSectionDouble = () => ({
    getControlPanelSections: () => [
      {
        title: 'control_panel.account_preferences.title',
        boxes: [
          {
            linkUrl: 'control_panel.external_integrations.dynamics_link_url',
            imgSrc: 'Imagen1',
            imgAlt: 'control_panel.account_preferences.account_information_title',
            iconName: 'control_panel.account_preferences.account_information_title',
          },
        ],
      },
    ],
  });

  const dependencies = () => ({
    controlPanelService: controlPanelSectionDouble(),
  });

  const ControlPanelComponent = () => {
    return (
      <AppServicesProvider forcedServices={dependencies()}>
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
});
