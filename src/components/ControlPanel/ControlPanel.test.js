import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ControlPanel } from './ControlPanel';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../services/pure-di';

describe('Control Panel component', () => {
  const controlPanelSectionDouble = (link) => ({
    getControlPanelSections: () => [
      {
        title: 'control_panel.account_preferences.title',
        boxes: [
          {
            linkUrl: link,
            imgSrc: 'Imagen',
            imgAlt: 'control_panel.account_preferences.account_information_title',
            iconName: 'control_panel.account_preferences.account_information_title',
          },
        ],
      },
    ],
  });

  const dependencies = (link) => ({
    controlPanelService: controlPanelSectionDouble(link),
  });

  const ControlPanelComponent = ({ link }) => {
    return (
      <AppServicesProvider forcedServices={dependencies(link)}>
        <DopplerIntlProvider>
          <ControlPanel />
        </DopplerIntlProvider>
      </AppServicesProvider>
    );
  };

  it('should render sections and boxes', async () => {
    // Act
    render(<ControlPanelComponent link="link" />);

    // Assert
    expect(screen.getByRole('heading', { name: 'control_panel.account_preferences.title' }));
    expect(
      screen.getByText('control_panel.account_preferences.account_information_title'),
    ).toBeInTheDocument();
  });

  it('should not render box when empty link', async () => {
    // Act
    render(<ControlPanelComponent link="" />);

    // Assert
    expect(
      screen.queryByText('control_panel.account_preferences.account_information_title'),
    ).not.toBeInTheDocument();
  });
});
