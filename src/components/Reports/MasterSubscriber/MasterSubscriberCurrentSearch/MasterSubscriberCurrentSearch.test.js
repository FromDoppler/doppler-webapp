import React from 'react';
import { render, cleanup, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import MasterSubscriberCurrentSearch from './MasterSubscriberCurrentSearch';
import { AppServicesProvider } from '../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';

const subscriber = {
  email: 'test@test.com',
  fields: [
    {
      name: 'test',
      value: 'test',
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

const subscribers = {
  items: [
    {
      email: 'test@fromdoppler.com',
      fields: [
        {
          name: 'FIRSTNAME',
          value: 'Manuel',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
        {
          name: 'LASTNAME',
          value: 'di Rago',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
      ],
      unsubscribedDate: '2019-11-27T18:05:40.847Z',
      unsubscriptionType: 'hardBounce',
      manualUnsubscriptionReason: 'administrative',
      unsubscriptionComment: 'test',
      status: 'active',
      score: 0,
    },
    {
      email: 'pepe@fromdoppler.com',
      fields: [
        {
          name: 'FIRSTNAME',
          value: 'Pepe',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
        {
          name: 'LASTNAME',
          value: 'Gonzales',
          predefined: true,
          private: false,
          readonly: true,
          type: 'string',
        },
      ],
      unsubscribedDate: '',
      unsubscriptionType: '',
      manualUnsubscriptionReason: '',
      unsubscriptionComment: '',
      status: 'active',
      score: 1,
    },
  ],
  currentPage: 0,
  itemsCount: 2,
  pagesCount: 1,
};

describe('MasterSubscriberCurrentSearch component', () => {
  afterEach(cleanup);

  it('should show subscriber data', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: true, value: subscriber };
      },
      getSubscribers: async () => {
        return { success: true, value: subscribers };
      },
    };
    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <BrowserRouter>
            <MasterSubscriberCurrentSearch />
          </BrowserRouter>
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await wait(() => expect(getByText('test@fromdoppler.com')).toBeInTheDocument());
  });

  it('should show error message', async () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
        return { success: false };
      },
      getSubscribers: async () => {
        return { success: false };
      },
    };
    // Act
    const { getByText } = render(
      <AppServicesProvider
        forcedServices={{
          dopplerApiClient: dopplerApiClientDouble,
        }}
      >
        <IntlProvider>
          <MasterSubscriberCurrentSearch />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    await wait(() => expect(getByText('common.unexpected_error')).toBeInTheDocument());
  });
});
