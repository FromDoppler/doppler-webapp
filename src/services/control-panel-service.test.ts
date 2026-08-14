import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';
import { ControlPanelService } from './control-panel-service';

const collaboratorPermissionsFlagName = 'REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED';
const originalCollaboratorPermissionsFlag = process.env[collaboratorPermissionsFlagName];

function createControlPanelService(userData: any) {
  const appSessionRef = {
    current: {
      status: 'authenticated',
      userData: userData as DopplerLegacyUserData,
    },
  } as RefObject<AppSession>;

  const controlPanelService = new ControlPanelService({
    appSessionRef,
  });
  return controlPanelService;
}

describe('Control Panel Service', () => {
  afterEach(() => {
    if (originalCollaboratorPermissionsFlag === undefined) {
      delete process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED;
    } else {
      process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED = originalCollaboratorPermissionsFlag;
    }
  });

  it('should get every box and titles content', async () => {
    // Arrange
    const userData = {
      user: {
        hasClientManager: false,
        plan: {
          isFreeAccount: false,
        },
      },
    };

    const controlPanelService = createControlPanelService(userData);

    // Act
    const result = controlPanelService.getControlPanelSections((x) => x);

    // Assert
    expect(result).not.toBe(undefined);
    expect(
      result.forEach((section) => {
        expect(section.title).not.toBe('');
        section.boxes.forEach((box) => {
          expect(box.linkUrl).not.toBe('');
        });
      }),
    );
  });

  it('should get a disabled box and GetBillingInformation link', async () => {
    // Arrange
    const userData = {
      user: {
        hasClientManager: true,
        plan: {
          isFreeAccount: false,
        },
      },
    };

    const controlPanelService = createControlPanelService(userData);

    // Act
    const result = controlPanelService.getControlPanelSections((x) => x);

    // Assert
    expect(result[0].boxes[3].linkUrl.includes('GetBillingInformation')).toBe(true);
    expect(result[0].boxes[4].disabled === true).toBe(true);
  });

  it('Account history, billing information and SMS settings boxes should be disabled ', async () => {
    // Arrange
    const userData = {
      user: {
        hasClientManager: false,
        plan: {
          isFreeAccount: true,
        },
      },
    };

    const controlPanelService = createControlPanelService(userData);

    // Act
    const result = controlPanelService.getControlPanelSections((x) => x);

    // Assert
    expect(result[0].boxes[1].disabled).toBe(true);
    expect(result[0].boxes[3].disabled).toBe(true);
    expect(result[0].boxes[4].disabled).toBe(true);
  });

  it('should only show collaborator edition box for collaborators', async () => {
    // Arrange
    process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED = 'true';

    const userData = {
      user: {
        hasClientManager: false,
        plan: {
          isFreeAccount: false,
        },
      },
      userAccount: {
        userProfileType: 'COLLABORATOR',
        collaboratorViewAccessRights: [],
      },
    };

    const controlPanelService = createControlPanelService(userData);

    // Act
    const result = controlPanelService.getControlPanelSections((x) => x);
    const visibleBoxes = result[0].boxes.filter((box) => !box.hidden);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].anchorLink).toBe('account-preferences');
    expect(visibleBoxes).toHaveLength(1);
    expect(visibleBoxes[0].linkUrl).toBe('/control-panel/collaborator-edition');
    expect(visibleBoxes[0].hidden).toBe(false);
  });

  it('should show every box for collaborators with Control Panel access', async () => {
    // Arrange
    process.env.REACT_APP_COLLABORATOR_PERMISSIONS_ENABLED = 'true';

    const userData = {
      user: {
        hasClientManager: false,
        plan: {
          isFreeAccount: false,
        },
      },
      userAccount: {
        userProfileType: 'COLLABORATOR',
        collaboratorViewAccessRights: [
          {
            accessLevel: 25,
            idSection: 4,
            name: 'ControlPanel',
          },
        ],
      },
    };

    const controlPanelService = createControlPanelService(userData);

    // Act
    const result = controlPanelService.getControlPanelSections((x) => x);
    const visibleBoxes = result.flatMap((section) => section.boxes.filter((box) => !box.hidden));

    // Assert
    expect(result.length).toBeGreaterThan(1);
    expect(visibleBoxes.some((box) => box.linkUrl.includes('GetAccountInformation'))).toBe(true);
    expect(visibleBoxes.some((box) => box.linkUrl === '/control-panel/collaborator-edition')).toBe(
      true,
    );
  });
});
