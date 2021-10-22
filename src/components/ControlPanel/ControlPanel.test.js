import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ControlPanel } from './ControlPanel';
import { getControlPanelSections } from './controlPanelSections';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../services/pure-di';

describe('Control Panel component', () => {
  const dependencies = {
    appSessionRef: {
      current: {
        userData: {
          user: {
            hasClientManager: false,
          },
          features: {
            siteTrackingEnabled: true,
          },
        },
      },
    },
  };

  it('should render all sections and boxes when user does not belong to CM and features enabled', async () => {
    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <ControlPanel />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    getControlPanelSections(
      dependencies.appSessionRef.current.userData.user.hasClientManager,
      dependencies.appSessionRef.current.userData.features.siteTrackingEnabled,
    ).forEach((section) => {
      expect(screen.getByRole('heading', { name: section.title }));
      section.items.forEach((box) => {
        if (box !== null) {
          expect(screen.getByText(box.iconName)).toBeInTheDocument();
        }
      });
    });
  });

  it('should disable SMS settings box when user belongs to CM and show GetBillingInformation on billing information box', async () => {
    //Arrenge
    dependencies.appSessionRef.current.userData.user.hasClientManager = true;

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <ControlPanel />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.getByText('control_panel.account_preferences.sms_settings_title').parentElement,
    ).toHaveAttribute('disabled');
    expect(
      screen.getByText('control_panel.account_preferences.billing_information_title').parentElement,
    ).toHaveAttribute('href', expect.stringContaining('GetBillingInformation'));
  });

  it('should not render site tracking box when site tracking is not enabled', async () => {
    //Arrenge
    dependencies.appSessionRef.current.userData.features.siteTrackingEnabled = false;

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <ControlPanel />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(
      screen.queryByText('control_panel.campaign_preferences.site_tracking_title'),
    ).not.toBeInTheDocument();
  });
});
