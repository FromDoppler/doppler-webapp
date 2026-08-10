import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter as Router, useLocation } from 'react-router-dom';
import App from './App';
import { COLLABORATOR_SECTION } from './doppler-types';
import { AppServicesProvider } from './services/pure-di';

const collaboratorPermissionsFlagName = 'REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED';
const originalCollaboratorPermissionsFlag = process.env[collaboratorPermissionsFlagName];

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
    restart: () => {},
    redirectCollaboratorToAllowedSection: jest.fn(),
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
  beforeEach(() => {
    process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED = 'true';
  });

  afterEach(cleanup);

  afterAll(() => {
    if (originalCollaboratorPermissionsFlag === undefined) {
      delete process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED;
    } else {
      process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED = originalCollaboratorPermissionsFlag;
    }
  });

  it('delegates collaborator section access resolution when the flag is enabled', async () => {
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
      expect(dependencies.sessionManager.redirectCollaboratorToAllowedSection).toHaveBeenCalledWith(
        COLLABORATOR_SECTION.Reports,
      );
      expect(currentRouteState.location.pathname).toEqual('/reports');
    });
  });

  it('allows collaborators to stay in the route when the permissions flag is disabled', async () => {
    process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED = 'false';
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
      expect(currentRouteState.location.pathname).toEqual('/reports');
      expect(screen.getByTestId('reports-page')).toBeInTheDocument();
    });
  });

  it('delegates collaborator section access even when the session includes that section', async () => {
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
      expect(dependencies.sessionManager.redirectCollaboratorToAllowedSection).toHaveBeenCalledWith(
        COLLABORATOR_SECTION.Reports,
      );
      expect(currentRouteState.location.pathname).toEqual('/reports');
      expect(screen.getByTestId('reports-page')).toBeInTheDocument();
    });
  });
});
