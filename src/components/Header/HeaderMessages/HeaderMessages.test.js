import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';

import HeaderMessages from './HeaderMessages';

const user = {
  plan: {
    isSubscribers: true,
  },
};

describe('Header Messages component', () => {
  afterEach(cleanup);

  it('renders header messages with free account alert', () => {
    let alert = {
      type: 'message',
      button: {
        url: 'https://appint.fromdoppler.net/ControlPanel/AccountPreferences/PreUpgrade',
        text: 'Comprar Ahora',
      },
      message: 'Posees una cuenta gratis de 500 Suscriptores.',
    };

    const { getByText, getByTestId } = render(<HeaderMessages alert={alert} user={user} />);
    const linkButton = getByTestId('linkButton');

    expect(linkButton).toBeDefined();
    expect(getByText('Comprar Ahora')).toBeInTheDocument();
    expect(getByText('Posees una cuenta gratis de 500 Suscriptores.')).toBeInTheDocument();
  });

  it('renders header messages with suscribers account limit alert', () => {
    let alert = {
      type: 'warning',
      button: {
        text: 'Actualizar plan',
      },
      message: 'Has alcanzado el límite de tu cuenta',
    };
    const { getByText, getByTestId } = render(<HeaderMessages alert={alert} user={user} />);

    const actionButton = getByTestId('actionButton');

    expect(actionButton).toBeDefined();
    expect(getByText('Actualizar plan')).toBeInTheDocument();
    expect(getByText('Has alcanzado el límite de tu cuenta')).toBeInTheDocument();
  });

  it('renders header messages with canceled account', () => {
    let alert = {
      type: 'error',
      message: 'Has solicitado la cancelación de tu cuenta.',
    };
    const { getByText, getByTestId } = render(<HeaderMessages alert={alert} user={user} />);

    expect(getByText('Has solicitado la cancelación de tu cuenta.')).toBeInTheDocument();
  });
});
