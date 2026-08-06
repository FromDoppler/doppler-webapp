import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter as Router, useLocation } from 'react-router-dom';
import App from './App';
import { COLLABORATOR_SECTION } from './doppler-types';
import { AppServicesProvider } from './services/pure-di';

jest.mock('./components/Dashboard/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard-page" />,
}));

jest.mock('./components/Reports/Reports', () => ({
  __esModule: true,
  default: () => <div data-testid="reports-page" />,
}));

jest.mock('./components/MenuDemo/MenuDemo', () => ({
  __esModule: true,
  default: () => <div data-testid="menu-demo" />,
}));

jest.mock('./components/Footer/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));

function createDoubleSessionManager(appSessionRef) {
  const double = {
    initialize: (handler) => {
      double.updateAppSession = (session) => {
        if (appSessionRef) {
          appSessionRef.current = session;
        }
        handler(session);
      };
    },
    finalize: () => {},
  };

  return double;
}

const RouterInspector = ({ target }) => {
  const location = useLocation();

  target.location = location;
  return null;
};

const windowDouble = {
  zE: () => null,
};

const dopplerSitesClientDouble = {
  getBannerData: jest.fn(async () => ({ success: false, value: '' })),
};

const createCollaboratorSession = (sectionIds) => ({
  status: 'authenticated',
  userData: {
    user: {
      lang: 'es',
      avatar: {},
      plan: {
        isFreeAccount: false,
      },
      sms: {},
      nav: [],
    },
    userAccount: {
      userProfileType: 'COLLABORATOR',
      collaboratorViewAccessRights: sectionIds.map((idSection) => ({
        accessLevel: 25,
        idSection,
        name: `Section ${idSection}`,
      })),
    },
    nav: [],
    features: {
      siteTrackingEnabled: true,
      siteTrackingActive: true,
      emailParameterEnabled: true,
      emailParameterActive: true,
    },
    datahubCustomerId: '1234',
  },
});

describe('App private routes permissions', () => {
  afterEach(cleanup);

  it('redirects collaborators to an allowed route when they do not have access to the requested section', async () => {
    const appSessionRef = { current: { status: 'unknown' } };
    const dependencies = {
      appSessionRef,
      sessionManager: createDoubleSessionManager(appSessionRef),
      dopplerSitesClient: dopplerSitesClientDouble,
    };
    const currentRouteState = {};

    render(
      <AppServicesProvider forcedServices={dependencies}>
        <Router initialEntries={['/reports']}>
          <RouterInspector target={currentRouteState} />
          <App window={windowDouble} locale="en" />
        </Router>
      </AppServicesProvider>,
    );

    act(() => {
      dependencies.sessionManager.updateAppSession(
        createCollaboratorSession([COLLABORATOR_SECTION.Dashboard]),
      );
    });

    await waitFor(() => {
      expect(currentRouteState.location.pathname).toEqual('/dashboard');
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('allows collaborators to stay in the route when they have access to its section', async () => {
    const appSessionRef = { current: { status: 'unknown' } };
    const dependencies = {
      appSessionRef,
      sessionManager: createDoubleSessionManager(appSessionRef),
      dopplerSitesClient: dopplerSitesClientDouble,
    };
    const currentRouteState = {};

    render(
      <AppServicesProvider forcedServices={dependencies}>
        <Router initialEntries={['/reports']}>
          <RouterInspector target={currentRouteState} />
          <App window={windowDouble} locale="en" />
        </Router>
      </AppServicesProvider>,
    );

    act(() => {
      dependencies.sessionManager.updateAppSession(
        createCollaboratorSession([COLLABORATOR_SECTION.Reports]),
      );
    });

    await waitFor(() => {
      expect(currentRouteState.location.pathname).toEqual('/reports');
      expect(screen.getByTestId('reports-page')).toBeInTheDocument();
    });
  });
});
