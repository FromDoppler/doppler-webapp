import React from 'react';
import { render, cleanup, waitForDomChange } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import SubscriberGdpr from './SubscriberGdpr';
import { AppServicesProvider } from '../../../services/pure-di';
import { act } from 'react-dom/test-utils';

describe('SubscriberGdpr report component', () => {
  const subscriber = {
    email: 'test@test.com',
    fields: [
      {
        name: 'FIRSTNAME',
        value: 'Manuel',
        predefined: true,
        private: true,
        readonly: true,
        type: 'boolean',
      },
    ],
    unsubscribedDate: '2019-11-27T18:05:40.847Z',
    unsubscriptionType: 'hardBounce',
    manualUnsubscriptionReason: 'administrative',
    unsubscriptionComment: 'test',
    status: 'active',
    score: 0,
  };

  const subscriberPermission = {
    email: 'test@test.com',
    fields: [
      {
        name: 'Accept_promotions',
        value: '<p>Acepta promociones </p>',
        predefined: true,
        private: true,
        readonly: true,
        type: 'permission',
      },
    ],
    unsubscribedDate: '2019-11-27T18:05:40.847Z',
    unsubscriptionType: 'hardBounce',
    manualUnsubscriptionReason: 'administrative',
    unsubscriptionComment: 'test',
    status: 'active',
    score: 0,
  };

  const dopplerApiClientDouble = {
    getSubscriber: async () => {
      return { success: true, value: subscriber };
    },
  };

  const dopplerApiClientDoubleWithPermissions = {
    getSubscriber: async () => {
      return { success: true, value: subscriberPermission };
    },
  };

  afterEach(cleanup);

  it('renders subscriber gdpr report without error', async () => {
    // Arrange
    // Act
    render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );
    await waitForDomChange();
    // Assert
  });

  it('renders subscriber gdpr intenationalized title', async () => {
    // Arrange
    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );
    await waitForDomChange();
    // Assert
    expect(getByText('subscriber_gdpr.header_title')).toBeInTheDocument();
  });

  it('component should have a page title defined', async () => {
    // Arrange
    // Act
    render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );
    await waitForDomChange();

    //Assert
    expect(document.title).toEqual('subscriber_gdpr.page_title');
  });

  it('should show subscriber email', async () => {
    // Arrange

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );

    await waitForDomChange();
    // Assert
    expect(getByText(subscriber.email)).toBeInTheDocument();
  });

  it('should show field name when there is at least one permission field', async () => {
    // Arrange

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDoubleWithPermissions,
        }}
      >
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );

    await waitForDomChange();
    // Assert
    expect(getByText(subscriberPermission.fields[0].name)).toBeInTheDocument();
  });

  it('should empty message when there are no fields type permission', async () => {
    // Arrange

    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );

    await waitForDomChange();
    // Assert
    expect(getByText('subscriber_gdpr.empty_data')).toBeInTheDocument();
  });
});
