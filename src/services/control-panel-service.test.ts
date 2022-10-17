import { RefObject } from 'react';
import { AppSession } from './app-session';
import { DopplerLegacyUserData } from './doppler-legacy-client';
import { ControlPanelService } from './control-panel-service';

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
});
