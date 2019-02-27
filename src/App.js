import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import messages_es from './i18n/es.json';
import messages_en from './i18n/en.json';
import { flattenMessages } from './utils';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

const messages = {
  es: messages_es,
  en: messages_en,
};

addLocaleData([...en, ...es]);

class App extends Component {
  constructor() {
    super();
    //TODO: this hardcoded data will depend by the app language
    const locale = navigator.language.toLowerCase().split(/[_-]+/)[0] || 'en';
    this.state = {
      user: null,
      loginSession: {},
      i18n: {
        locale: locale,
        messages: flattenMessages(messages[locale]),
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

  manageJwtToken() {
    var encodedToken = localStorage.getItem('jwtToken');
    if (encodedToken) {
      try {
        this.setState({ loginSession: this.decodeLoginSession(encodedToken) });
        if (this.state.user.Email !== this.state.loginSession.email) {
          this.saveStoredSession(this.state.loginSession);
        }
      } catch (error) {
        this.logOut();
        return;
      }
    } else {
      axios
        .get(process.env.REACT_APP_API_URL + '/Reports/Reports/GetJwtToken', {
          withCredentials: 'include',
        })
        .then((response) => {
          this.saveStoredSession({ token: response.data.jwtToken });
        })
        .catch((error) => {
          this.logOut();
        });
    }
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

  decodeLoginSession(jwtToken) {
    var decodedToken = jwt_decode(jwtToken);
    return {
      token: jwtToken,
      email: decodedToken.email,
      name: decodedToken.name,
      lang: decodedToken.lang,
    };
  }

  saveStoredSession(loginSession) {
    localStorage.setItem('jwtToken', loginSession.token);
  }

  logOut() {
    localStorage.removeItem('jwtToken');
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
          <div>
            <Header />
            <img src={logo} alt="logo" />
            <Footer />
          </div>
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
