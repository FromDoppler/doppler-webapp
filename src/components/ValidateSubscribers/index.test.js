import '@testing-library/jest-dom/extend-expect';
import { render, screen, act, waitForElementToBeRemoved } from '@testing-library/react';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import ValidateSubscribers from './';
import { maxSubscribersData } from '../../services/doppler-legacy-client.doubles';
import { AppServicesProvider } from '../../services/pure-di';
import userEvent from '@testing-library/user-event';

describe('ValidateSubscribersComponent', () => {
  it('should render Loading when there is no data', async () => {
    // Arrange
    const forcedServices = {
      dopplerLegacyClient: {
        getMaxSubscribersData: jest.fn(async () => ({})),
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

  it('should render ValidatemaxSubscribersForm when there is form data', async () => {
    // Arrange
    const getMaxSubscribersDataMock = async () => maxSubscribersData;
    const forcedServices = {
      dopplerLegacyClient: {
        getMaxSubscribersData: getMaxSubscribersDataMock,
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

    expect(screen.getByText('validate_max_subscribers_form.subtitle')).toBeInTheDocument();
  });

  it('should render ValidateMaxSubscribersConfirm when submit is successful', async () => {
    // Arrange
    const formData = {
      questionsList: [
        {
          answer: {
            answerType: 'TEXTFIELD',
            answerOptions: [],
            value: '',
            optionsSelected: [],
          },
          question: 'Nombre',
        },
      ],
      isSentSuccessEmail: false,
      urlReferrer: '',
      urlHelp:
        'http://help.fromdoppler.com/por-que-debo-completar-un-formulario-al-cargar-mis-listas/',
    };

    const forcedServices = {
      dopplerLegacyClient: {
        getMaxSubscribersData: jest.fn(async () => formData),
        sendMaxSubscribersData: jest.fn(async (data) => true),
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <ValidateSubscribers setNextAlert={() => null} />
        </IntlProvider>
      </AppServicesProvider>,
    );

    const loader = screen.getByTestId('loading-box');
    await waitForElementToBeRemoved(loader);

    const input = await screen.getByRole('textbox', { name: 'Nombre' });
    await act(() => userEvent.type(input, 'value'));
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    await act(() => userEvent.click(submitButton));

    // Assert
    await screen.findByTestId('validate-subscribers-confirm');
  });
});
