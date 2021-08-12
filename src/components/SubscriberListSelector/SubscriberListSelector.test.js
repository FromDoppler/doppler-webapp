import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { SubscriberListSelector } from './SubscriberListSelector';
import { AppServicesProvider } from '../../services/pure-di';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { subscriberListCollection } from '../../services/doppler-api-client.double';

describe('SubscriberListSelector component', () => {
  const listsCount = 3;
  const dopplerApiClientDouble = (withLists) => {
    return {
      getSubscribersLists: async () => ({
        success: true,
        value: {
          items: withLists ? subscriberListCollection(listsCount) : [],
          currentPage: 1,
          itemsCount: 2,
          pagesCount: 1,
        },
      }),
    };
  };
  const SubscriberListSelectorComponent = ({
    withLists = true,
    preselected = [],
    maxToSelect = 10,
    messageKeys = {},
  }) => (
    <AppServicesProvider forcedServices={{ dopplerApiClient: dopplerApiClientDouble(withLists) }}>
      <DopplerIntlProvider>
        <SubscriberListSelector
          maxToSelect={maxToSelect}
          preselected={preselected}
          messageKeys={messageKeys}
        />
      </DopplerIntlProvider>
    </AppServicesProvider>
  );

  it('should show loading box while getting data', async () => {
    // Act
    render(<SubscriberListSelectorComponent />);
    //
    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('should load data from api correctly', async () => {
    // Act
    render(<SubscriberListSelectorComponent />);
    //
    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const table = screen.getByRole('table');
    const rows = screen.getAllByRole('row');
    const cells = screen.getAllByRole('cell');

    // Data should load correctly
    expect(table).toBeInTheDocument();
    expect(rows).toHaveLength(listsCount + 1);
    expect(cells).toHaveLength(listsCount * 3);
  });

  it("shouldn't show table if user doesn't have lists", async () => {
    // Act
    render(<SubscriberListSelectorComponent withLists={false} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Table shouldn't be in the document
    const table = screen.queryByRole('table');
    expect(table).not.toBeInTheDocument();

    // 'Feature isn't available' message should be displayed
    const noAvailableMessage = screen.getByText('common.feature_no_available');
    expect(noAvailableMessage).toBeInTheDocument();
  });

  it('should load preselected lists', async () => {
    // Act
    render(<SubscriberListSelectorComponent preselected={subscriberListCollection(2)} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const table = screen.getByRole('table');
    const checkboxes = screen.getAllByRole('checkbox');

    // Lists should be selected
    expect(table).toBeInTheDocument();
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('should show message if max limit is reached', async () => {
    // Act
    render(<SubscriberListSelectorComponent maxToSelect={1} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Table shouldn't be in the document
    const table = screen.queryByRole('table');
    expect(table).toBeInTheDocument();

    // Select a list (one list is the max limit)
    const checkboxes = screen.getAllByRole('checkbox');
    user.click(checkboxes[0]);

    // Max limit exceeded message should be displayed
    const maxLimitExceededMessage = screen.getByText('subscriber_list_selector.max_limit_exceeded');
    expect(maxLimitExceededMessage).toBeInTheDocument();
  });

  it('should show title and description', async () => {
    // Arrange
    const msgKeys = { title: 'common.message', description: 'common.optional_message' };

    // Act
    render(<SubscriberListSelectorComponent messageKeys={msgKeys} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Custom title should be displayed
    const title = screen.getByText(msgKeys.title);
    expect(title).toBeInTheDocument();

    // Custom description should be displayed
    const description = screen.getByText(msgKeys.description);
    expect(description).toBeInTheDocument();
  });
});
