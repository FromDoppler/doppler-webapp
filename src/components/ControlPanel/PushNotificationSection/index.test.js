import {
  render,
  waitForElementToBeRemoved,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PushNotificationSection } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter } from 'react-router-dom';

const forcedServices = {
  dopplerLegacyClient: {
    getPushNotificationSettings: async () => ({
      consumedSends: 100,
      trialPeriodRemainingDays: 30,
      isPushServiceEnabled: true,
    }),
    updatePushNotificationSettings: async (settings) => {
      await new Promise((r) => setTimeout(r, 50));
      return true;
    },
  },

  appSessionRef: {
    current: {
      userData: {
        userAccount: {
          email: 'dummy@fromdoppler.com',
          firstname: 'test',
          lastname: 'test',
          userProfileType: 'USER',
        },
        user: {
          plan: {
            isFreeAccount: false,
          },
          pushNotification: {
            plan: {
              description: 'plan free',
              quantity: 2500,
              buttonUrl: '#',
              updatePlanUrl: '#',
            },
          },
        },
      },
    },
  },
};

describe('test for Push Notification Section component ', () => {
  it('Validate if loading box is hide from initial form', async () => {
    //Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <BrowserRouter>
          <IntlProvider>
            <PushNotificationSection />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Assert Breadcrumb is rendered

    expect(
      screen.getByText((content) => content.includes('common.control_panel')),
    ).toBeInTheDocument();
    expect(screen.getByText('push_notification_section.title')).toBeInTheDocument();
  });

  it('should change button label and add loading class when submitting', async () => {
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <BrowserRouter>
          <IntlProvider>
            <PushNotificationSection />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const saveButton = screen.getByRole('button', { name: 'common.save' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).not.toHaveClass('button--loading');

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'common.saving' })).toHaveClass('button--loading');
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'common.save' })).not.toHaveClass(
        'button--loading',
      );
    });
  });
});
