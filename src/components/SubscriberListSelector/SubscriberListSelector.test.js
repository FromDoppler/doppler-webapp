import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
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
  const SubscriberListSelectorComponent = ({ withLists = true, preSelected = [] }) => (
    <AppServicesProvider forcedServices={{ dopplerApiClient: dopplerApiClientDouble(withLists) }}>
      <DopplerIntlProvider>
        <SubscriberListSelector preselected={preSelected} />
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
    render(<SubscriberListSelectorComponent preSelected={subscriberListCollection(2)} />);
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
});
