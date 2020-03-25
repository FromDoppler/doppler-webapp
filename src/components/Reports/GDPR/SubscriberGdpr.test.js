import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import SubscriberGdpr from './SubscriberGdpr';
import { AppServicesProvider } from '../../../services/pure-di';

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

  const fields = [
    {
      name: 'FIRSTNAME',
      value: 'Manuel',
      predefined: true,
      private: true,
      readonly: true,
      type: 'boolean',
    },
    {
      name: 'Accept_promotions',
      value: '<p>Acepta promociones </p>',
      predefined: true,
      private: true,
      readonly: true,
      type: 'permission',
    },
  ];

  const dopplerApiClientDouble = {
    getSubscriber: async () => {
      return { success: true, value: subscriber };
    },
    getUserFields: async () => {
      return { success: true, value: subscriber.fields };
    },
  };

  const dopplerApiClientDoubleWithPermissions = {
    getSubscriber: async () => {
      return { success: true, value: subscriberPermission };
    },
    getUserFields: async () => {
      return { success: true, value: fields };
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
    await waitFor(() => {});
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
    // Assert
    await waitFor(() => expect(getByText('subscriber_gdpr.header_title')).toBeInTheDocument());
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

    //Assert
    await waitFor(() => expect(document.title).toEqual('subscriber_gdpr.page_title'));
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

    // Assert
    await waitFor(() => expect(getByText(subscriber.email)).toBeInTheDocument());
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

    // Assert
    await waitFor(() => expect(getByText(subscriberPermission.fields[0].name)).toBeInTheDocument());
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

    // Assert
    await waitFor(() => expect(getByText('subscriber_gdpr.empty_data')).toBeInTheDocument());
  });

  it('should show a permission field with no response if the user has at least one permission', async () => {
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

    // Assert
    // expect to have at least one row in the grid
    await waitFor(() => {
      const tableNode = getByText('subscriber_gdpr.permission_name').closest('table');
      expect(document.querySelectorAll('tbody tr').length).toBe(subscriber.fields.length);
    });
  });
});
