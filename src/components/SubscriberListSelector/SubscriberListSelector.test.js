import {
  render,
  screen,
  waitForElementToBeRemoved,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { scrollableContainerId, SubscriberListSelector } from './SubscriberListSelector';
import { AppServicesProvider } from '../../services/pure-di';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { subscriberListCollection } from '../../services/doppler-api-client.double';

describe('SubscriberListSelector component', () => {
  const listsCount = 10;
  const perPage = 5;

  const dopplerApiClientDouble = (withLists, hasError) => {
    const allItems = withLists ? subscriberListCollection(listsCount) : [];

    return {
      getSubscribersLists: async (page) => {
        let listPaged = allItems;

        if (listPaged.length > 0 && page > 0) {
          const indexStart = perPage * (page - 1);
          const indexEnd = indexStart + perPage;
          listPaged = listPaged.slice(indexStart, indexEnd);
        }

        return {
          success: !hasError,
          value: {
            items: listPaged,
            currentPage: page,
            itemsCount: allItems.length,
            pagesCount: Math.ceil(allItems.length / perPage),
          },
        };
      },
    };
  };

  const mockedCancel = jest.fn();
  const mockedConfirm = jest.fn();
  const mockedNoList = jest.fn();
  const mockedError = jest.fn();

  const SubscriberListSelectorComponent = ({
    withLists = true,
    preselected = [],
    maxToSelect = 10,
    messageKeys = {},
    hasError = false,
  }) => (
    <AppServicesProvider
      forcedServices={{ dopplerApiClient: dopplerApiClientDouble(withLists, hasError) }}
    >
      <DopplerIntlProvider>
        <SubscriberListSelector
          maxToSelect={maxToSelect}
          preselected={preselected}
          messageKeys={messageKeys}
          onCancel={mockedCancel}
          onConfirm={mockedConfirm}
          onNoList={mockedNoList}
          onError={mockedError}
        />
      </DopplerIntlProvider>
    </AppServicesProvider>
  );

  it('should show loading box while getting data', async () => {
    // Act
    render(<SubscriberListSelectorComponent />);

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
    expect(rows).toHaveLength(perPage + 1);
    expect(cells).toHaveLength(perPage * 3);
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

    // Should show ConfirmationBox component
    const confirmationBox = screen.getByTestId('confirmation-box');
    expect(confirmationBox).toBeInTheDocument();
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
    await act(() => user.click(checkboxes[0]));

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

  it('should call onCancel function if cancel button is pressed', async () => {
    // Act
    render(<SubscriberListSelectorComponent preselected={subscriberListCollection(2)} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Should call onCancel function
    const cancelButton = screen.getByRole('button', {
      name: 'common.cancel',
    });
    await act(() => user.click(cancelButton));
    expect(mockedCancel).toBeCalledTimes(1);
  });

  it('should call onConfirm function if confirm button is pressed', async () => {
    // Act
    render(<SubscriberListSelectorComponent preselected={subscriberListCollection(2)} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Confirm button should be disabled
    const confirmButton = screen.getByRole('button', {
      name: 'subscriber_list_selector.confirm_selection',
    });
    expect(confirmButton).toBeDisabled();

    const table = screen.getByRole('table');
    const checkboxes = screen.getAllByRole('checkbox');

    // Lists should be selected
    expect(table).toBeInTheDocument();
    expect(checkboxes[0]).toBeChecked();
    await act(() => user.click(checkboxes[0]));
    expect(checkboxes[0]).not.toBeChecked();

    // Confirm button should be enabled
    expect(confirmButton).toBeEnabled();

    // Should call onConfirm function
    await act(() => user.click(confirmButton));
    expect(mockedConfirm).toBeCalledTimes(1);
  });

  it('should call onNoList function if list is empty', async () => {
    // Act
    render(<SubscriberListSelectorComponent withLists={false} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Should call onNoList function
    await waitFor(() => {
      expect(mockedNoList).toBeCalledTimes(1);
    });
  });

  it('should call onError function if an error occurred', async () => {
    // Act
    render(<SubscriberListSelectorComponent hasError={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Should call onNoList function
    await waitFor(() => {
      expect(mockedError).toBeCalledTimes(1);
    });
  });

  it('should render the selected lists on each page', async () => {
    // Assert
    // Pre-select lists with odd ids [ 1, 3, 5, 7, 9 ]
    const preselected = subscriberListCollection(listsCount).filter((list) => list.id % 2);

    // Act
    // 5 lists per page
    // 2 selected lists in first page and
    // 3 selected list in second page
    render(<SubscriberListSelectorComponent preselected={preselected} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // There should be 2 lists selected on the first page
    let inputs = screen.getAllByRole('checkbox', { checked: true });
    expect(inputs).toHaveLength(2);

    // Scroll to fetch next page
    const scrollableContainer = screen.getByTestId(scrollableContainerId);
    act(() => {
      fireEvent.scroll(scrollableContainer, { target: { scrollY: 300 } });
    });

    // Wait for last pre selected list to be rendered
    const last = preselected[preselected.length - 1];
    await screen.findByText(last.name);

    // There should be 3 lists selected on the second page
    // 5 selected lists in total
    inputs = screen.getAllByRole('checkbox', { checked: true });
    expect(inputs).toHaveLength(5);
  });
});
