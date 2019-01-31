import React from 'react';
import axios from 'axios';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';

import App from './App';

import { IntlProvider } from 'react-intl';
import messages_es from './i18n/es.json';
import messages_en from './i18n/en.json';

const messages = {
  es: messages_es,
  en: messages_en,
};

const response = {
  data: {
    user: {
      Email: 'fcoronel@makingsense.com',
    },
  },
};

describe('App component', () => {
  afterEach(cleanup);

  beforeEach(() => {
    axios.get = jest.fn(() => Promise.resolve(response));
  });

  it('renders welcome message', () => {
    const { getByText } = render(
      <IntlProvider locale="en" messages={messages['en']}>
        <App />
      </IntlProvider>,
    );
    expect(getByText('Learn React')).toBeInTheDocument();
  });

  it('fetches user and display user data', async () => {
    const { getByText } = render(
      <IntlProvider locale="en" messages={messages['en']}>
        <App />
      </IntlProvider>,
    );

    await wait(() => getByText(response.data.user.Email));

    const userEmail = getByText(response.data.user.Email);

    expect(userEmail).toBeDefined();
  });
});
