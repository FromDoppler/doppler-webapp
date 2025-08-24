import { render, waitForElementToBeRemoved, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PushNotificationSection } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter } from 'react-router-dom';

import { MemoryRouter, Routes, Route } from 'react-router-dom';


const forcedServices = {
  
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

    // Assert Breadcrumb is rendered
    expect(screen.getByText('common.control_panel')).toBeInTheDocument();
    expect(screen.getByText('push_notification_section.title')).toBeInTheDocument();
  });

  
});
