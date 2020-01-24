import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import MasterSubscriber from './MasterSubscriber';
import { AppServicesProvider } from '../../../services/pure-di';

describe('MasterSubscriber component', () => {
  afterEach(cleanup);

  it('renders correctly', () => {
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
          <MasterSubscriber />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    expect(getByText('master_subscriber.header_title')).toBeInTheDocument();
  });
});
