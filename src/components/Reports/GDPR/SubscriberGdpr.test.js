import React from 'react';
import { render, cleanup, waitForDomChange } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import SubscriberGdpr from './SubscriberGdpr';
import { AppServicesProvider } from '../../../services/pure-di';

describe('SubscriberGdpr report component', () => {
  afterEach(cleanup);

  it('renders subscriber gdpr report without error', () => {
    // Arrange
    // Act
    render(
      <IntlProvider>
        <SubscriberGdpr />
      </IntlProvider>,
    );
    // Assert
  });

  it('renders subscriber gdpr intenationalized title', () => {
    // Arrange
    // Act
    const { getByText } = render(
      <IntlProvider>
        <SubscriberGdpr />
      </IntlProvider>,
    );
    // Assert
    expect(getByText('subscriber_gdpr.header_title')).toBeInTheDocument();
  });

  it('component should have a page title defined', async () => {
    // Arrange
    // Act
    render(
      <IntlProvider>
        <SubscriberGdpr />
      </IntlProvider>,
    );
    await waitForDomChange();

    //Assert
    expect(document.title).toEqual('subscriber_gdpr.page_title');
  });

  it('should show subscriber email', async () => {
    // Arrange
    const subscriberEmail = 'email@email.com';
    const dependencies = {
      window: {
        location: {
          search: `?email=${subscriberEmail}`,
        },
      },
    };

    // Act
    const { getByText } = render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <SubscriberGdpr />
        </IntlProvider>
      </AppServicesProvider>,
    );

    await waitForDomChange();

    // Assert
    expect(getByText(subscriberEmail)).toBeInTheDocument();
  });
});
