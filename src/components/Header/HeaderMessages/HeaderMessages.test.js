import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import HeaderMessages from './HeaderMessages';

const user = {
  plan: {
    isSubscribers: true,
  },
};

const closeAlert = () => {};

describe('Header Messages component', () => {
  afterEach(cleanup);

  it('renders header messages with free account alert', () => {
    const alert = {
      type: 'message',
      button: {
        url: 'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/PreUpgrade',
        text: 'Comprar Ahora',
      },
      message: 'Posees una cuenta gratis de 500 Suscriptores.',
    };

    const { getByText, getByTestId } = render(
      <HeaderMessages alert={alert} user={user} closeAlert={closeAlert} />,
    );
    const linkButton = getByTestId('linkButton');

    expect(linkButton).toBeDefined();
    expect(getByText('Comprar Ahora')).toBeInTheDocument();
    expect(getByText('Posees una cuenta gratis de 500 Suscriptores.')).toBeInTheDocument();
  });

  it('renders header messages with suscribers account limit alert', () => {
    const alert = {
      type: 'warning',
      button: {
        text: 'Actualizar plan',
      },
      message: 'Has alcanzado el límite de tu cuenta',
    };
    const { getByText, getByTestId } = render(
      <HeaderMessages alert={alert} user={user} closeAlert={closeAlert} />,
    );

    const actionButton = getByTestId('actionButton');

    expect(actionButton).toBeDefined();
    expect(getByText('Actualizar plan')).toBeInTheDocument();
    expect(getByText('Has alcanzado el límite de tu cuenta')).toBeInTheDocument();
  });

  it('renders header messages with canceled account', () => {
    const alert = {
      type: 'error',
      message: 'Has solicitado la cancelación de tu cuenta.',
    };
    const { getByText } = render(
      <HeaderMessages alert={alert} user={user} closeAlert={closeAlert} />,
    );

    expect(getByText('Has solicitado la cancelación de tu cuenta.')).toBeInTheDocument();
  });

  it('renders header message with validate origin', () => {
    // Arrange
    const alert = {
      type: 'blocker',
      button: {
        text: 'Verificar ahora',
      },
      message: 'header message',
    };

    // Act
    const { getByText, getByTestId } = render(
      <HeaderMessages alert={alert} user={user} closeAlert={closeAlert} />,
    );

    const actionButton = getByTestId('actionButton');

    expect(actionButton).toBeDefined();
    expect(getByText('Verificar ahora')).toBeInTheDocument();
    expect(getByText('header message')).toBeInTheDocument();
  });

  it('button executes sendAcceptButtonAction when button action is closemodal', async () => {
    // Arrange
    const forcedServices = {
      dopplerLegacyClient: {
        sendAcceptButtonAction: jest.fn(async () => ({})),
      },
    };

    const alert = {
      type: 'info',
      button: {
        text: 'Ok',
        action: 'closeModal',
      },
      message: '',
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <IntlProvider>
          <HeaderMessages alert={alert} closeAlert={closeAlert} />
        </IntlProvider>
      </AppServicesProvider>,
    );

    const okButton = await screen.getByRole('button', { name: 'Ok' });
    userEvent.click(okButton);

    // Assert
    expect(forcedServices.dopplerLegacyClient.sendAcceptButtonAction).toBeCalledTimes(1);
  });
});
