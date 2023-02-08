import { screen, render, cleanup, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../services/pure-di';
import { SiteTrackingRequired, SiteTrackingNotAvailableReasons } from './SiteTrackingRequired';
import { MemoryRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('site tracking', () => {
  afterEach(cleanup);

  it('should show free account messages', () => {
    // Arrange
    const reason = SiteTrackingNotAvailableReasons.freeAccount;

    // Act
    const { getByText } = render(
      <AppServicesProvider>
        <DopplerIntlProvider>
          <Router initialEntries={[`/`]}>
            <SiteTrackingRequired reason={reason} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(getByText('reports.promotional.title')).toBeInTheDocument();
  });

  it('should show trial not accepted messages', () => {
    // Arrange
    const reason = SiteTrackingNotAvailableReasons.trialNotAccepted;

    // Act
    const { getByText } = render(
      <AppServicesProvider>
        <DopplerIntlProvider>
          <Router initialEntries={[`/`]}>
            <SiteTrackingRequired reason={reason} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(getByText('reports.datahub_not_domains_title')).toBeInTheDocument();
  });

  it('should show not domains messages', () => {
    // Arrange
    const reason = SiteTrackingNotAvailableReasons.thereAreNotDomains;

    // Act
    const { getByText } = render(
      <AppServicesProvider>
        <DopplerIntlProvider>
          <Router initialEntries={[`/`]}>
            <SiteTrackingRequired reason={reason} />
          </Router>
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    expect(getByText('reports.datahub_not_domains_title')).toBeInTheDocument();
  });

  //TODO: research why fails in jenkins /
  // it('should be activate the trial and redirect to control panel site tracking settings', async () => {
  //   // Arrange
  //   const reason = SiteTrackingNotAvailableReasons.trialNotAccepted;
  //   const dependencies = {
  //     dopplerLegacyClient: {
  //       activateSiteTrackingTrial: async () => ({ success: true }),
  //     },
  //     appConfiguration: { dopplerLegacyUrl: 'http://localhost:52191' },
  //     window: { location: {} },
  //   };

  //   // Act
  //   const { container } = render(
  //     <AppServicesProvider forcedServices={dependencies}>
  //       <DopplerIntlProvider>
  //         <SiteTrackingRequired reason={reason} />
  //       </DopplerIntlProvider>
  //     </AppServicesProvider>,
  //   );

  //   container.querySelector('button').click();
  //   await waitForDomChange();

  //   // Assert
  //   expect(dependencies.window.location.href).toEqual(
  //     'http://localhost:52191/ControlPanel/CampaignsPreferences/SiteTrackingSettings',
  //   );
  // });

  it('should be activate the trial and fails and do nothing', async () => {
    // Arrange
    const reason = SiteTrackingNotAvailableReasons.trialNotAccepted;
    const dependencies = {
      dopplerLegacyClient: {
        activateSiteTrackingTrial: async () => ({ success: false }),
      },
      appConfiguration: { dopplerLegacyUrl: 'localhost:3000' },
      window: { location: {} },
    };

    // Act
    await act(() =>
      render(
        <AppServicesProvider forcedServices={dependencies}>
          <DopplerIntlProvider>
            <Router initialEntries={[`/`]}>
              <SiteTrackingRequired reason={reason} />
            </Router>
          </DopplerIntlProvider>
        </AppServicesProvider>,
      ),
    );

    await act(() => userEvent.click(screen.getByRole('button')));

    // Assert
    await waitFor(() => {
      expect(dependencies.window.location.href).not.toBe(
        'localhost:3000/ControlPanel/CampaignsPreferences/SiteTrackingSettings',
      );
    });
  });
});
