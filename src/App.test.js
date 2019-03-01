import React from 'react';
import axios from 'axios';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';
import App from './App';
import jwt_decode from 'jwt-decode';

//Add mock to decode jwt token and not fail
jest.mock('jwt-decode');

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

  it('renders loading text in English', () => {
    const { getByText } = render(<App locale="en" />);
    getByText('Loading...');
  });

  it('renders loading text in Spanish', () => {
    const { getByText } = render(<App locale="es" />);
    getByText('Cargando...');
  });

  it('fetches user and display user data', async () => {
    const tokenDecodeData = {
      email: 'fcoronel@makingsense',
      name: 'fede',
      lang: 'es',
    };

    jwt_decode.mockResolvedValue(tokenDecodeData);

    const { getByText } = render(<App locale="en" />);

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
