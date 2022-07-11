import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import ValidateSubscribers from '.';
import { AppServicesProvider } from '../../services/pure-di';

describe('ValidateSubscribersComponent', () => {
  it('should render Loading when there is no data', async () => {
    // Arrange
    const forcedServices = {
      dopplerLegacyClient: {
        getMaxSubscribersData: jest.fn(async () => {}),
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <ValidateSubscribers />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);
  });

  it('should render UnexpectedError when has an error', async () => {
    // Arrange
    const forcedServices = {
      dopplerLegacyClient: {
        getMaxSubscribersData: jest.fn(async () => {
          throw new Error('Empty Doppler response');
        }),
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <ValidateSubscribers />
        </IntlProvider>
      </AppServicesProvider>,
    );
    // Assert
    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    const unexpectedError = screen.getByTestId('unexpected-error');
    expect(unexpectedError).toBeInTheDocument();
  });
});
