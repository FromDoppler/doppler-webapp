import React from 'react';
import axios from 'axios';
import { render, cleanup, wait } from 'react-testing-library';
import 'jest-dom/extend-expect';
import App from './App';

describe('App component', () => {
  afterEach(cleanup);

  it('renders loading text in English', () => {
    const { getByText } = render(<App locale="en" />);
    getByText('Loading...');
  });

  it('renders loading text in Spanish', () => {
    const { getByText } = render(<App locale="es" />);
    getByText('Cargando...');
  });

  describe('in normal backend behavior', () => {
    const email = 'fcoronel@makingsense.com';

    beforeEach(() => {
      // prepare backend double
      const responseOfGetUserData = {
        data: {
          user: {
            Email: email,
          },
        },
      };

      axios.get = jest.fn((url) => {
        if (url === process.env.REACT_APP_API_URL + '/Reports/Reports/GetUserData') {
          return Promise.resolve(responseOfGetUserData);
        } else {
          return Promise.reject('Unexpected call to backend');
        }
      });
    });

    it('displays user data and fetches user data and token', async () => {
      const { getByText } = render(<App locale="en" />);

      await wait(() => getByText(email));

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        process.env.REACT_APP_API_URL + '/Reports/Reports/GetUserData',
        {
          withCredentials: 'include',
        },
      );
    });
  });
});
