import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import messages_es from './i18n/es.json';
import messages_en from './i18n/en.json';
import { flattenMessages } from './utils';
import axios from 'axios';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

const messages = {
  es: messages_es,
  en: messages_en,
};

addLocaleData([...en, ...es]);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      i18n: {
        locale: props.locale,
        messages: flattenMessages(messages[props.locale]),
      },
    };
  }

  componentWillMount() {
    this.getUserData();
    this.interval = setInterval(() => {
      this.getUserData();
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getUserData() {
    axios
      .get(process.env.REACT_APP_API_URL + '/Reports/Reports/GetUserData', {
        withCredentials: 'include',
      })
      .then((response) => {
        this.setState({ user: response.data.user });
        this.manageJwtToken();
      })
      .catch((error) => {
        this.logOut();
      });
  }

  logOut() {
    const currentUrlEncoded = encodeURI(window.location.href);
    // TODO: only use redirect on login, not in logout
    const loginUrl = `${process.env.REACT_APP_API_URL}/SignIn/index?redirect=${currentUrlEncoded}`;
    window.location.href = loginUrl;
  }

  render() {
    const isLoggedIn = !!this.state.user;
    const i18n = this.state.i18n;
    return (
      <IntlProvider locale={i18n.locale} messages={i18n.messages}>
        {isLoggedIn ? (
          <>
            <Header />
            <img src={logo} alt="logo" />
            <Footer />
          </>
        ) : (
          <div>
            <FormattedMessage id="loading" />
          </div>
        )}
      </IntlProvider>
    );
  }
}

export default App;
