import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import SubscriberHistory from './SubscriberHistory';
import { AppServicesProvider } from '../../../services/pure-di';

describe('SubscriberHistory component', () => {
  afterEach(cleanup);

  it('renders correctly', () => {
    // Arrange
    const dopplerApiClientDouble = {
      getSubscriber: async () => {
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
          <SubscriberHistory />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    expect(getByText('subscriber_history.header_title')).toBeInTheDocument();
  });
});
