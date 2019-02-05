import React from 'react';
import axios from 'axios';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';

import App from './App';

import { IntlProvider } from 'react-intl';
import messages_es from './i18n/es.json';
import messages_en from './i18n/en.json';
import jwt_decode from 'jwt-decode';

//Add mock to decode jwt token and not fail
jest.mock('jwt-decode');

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

const responseToken = {
  data: {
    jwtToken: 'token',
  },
};

//Local storage mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

describe('App component', () => {
  afterEach(cleanup);

  beforeEach(() => {
    axios.get = jest.fn((url) => {
      if (url === process.env.REACT_APP_API_URL + '/Reports/Reports/GetUserData') {
        return Promise.resolve(response);
      } else {
        return Promise.resolve(responseToken);
      }
    });
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
    const tokenDecodeData = {
      email: 'fcoronel@makingsense',
      name: 'fede',
      lang: 'es',
    };

    jwt_decode.mockResolvedValue(tokenDecodeData);

    const { getByText } = render(
      <IntlProvider locale="en" messages={messages['en']}>
        <App />
      </IntlProvider>,
    );

    await wait(() => getByText(response.data.user.Email));

    const userEmail = getByText(response.data.user.Email);

    expect(userEmail).toBeDefined();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      process.env.REACT_APP_API_URL + '/Reports/Reports/GetUserData',
      {
        withCredentials: 'include',
      },
    );
  });
});
