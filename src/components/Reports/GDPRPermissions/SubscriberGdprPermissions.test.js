import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import SubscriberGdprPermissions from './SubscriberGdprPermissions';

describe('SubscriberGdprPermissions report component', () => {
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
    getUserFields: async () => {
      return { success: true, value: subscriber.fields };
    },
  };

  const dopplerApiClientDoubleWithPermissions = {
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
          <SubscriberGdprPermissions subscriber={subscriber} />
        </IntlProvider>
      </AppServicesProvider>,
    );
    await waitFor(() => {});
    // Assert
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
          <SubscriberGdprPermissions subscriber={subscriber} />
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
          <SubscriberGdprPermissions subscriber={subscriber} />
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
          <SubscriberGdprPermissions subscriber={subscriber} />
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
