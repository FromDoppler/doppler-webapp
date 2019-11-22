import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import SubscriberHistory from './SubscriberHistory';

describe('SubscriberHistory component', () => {
  afterEach(cleanup);

  it('renders correctly', () => {
    // Arrange
    // Act
    const { getByText } = render(
      <IntlProvider>
        <SubscriberHistory />
      </IntlProvider>,
    );
    // Assert
    expect(getByText('subscriber_history.header_title')).toBeInTheDocument();
  });
});
