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
import { HttpDopplerMvcClient } from './services/doppler-mvc-client';
import { OnlineSessionManager } from './services/session-manager';
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

    this.updateSession = this.updateSession.bind(this);

    // TODO: Consider continue determining here default instance or moving all upside,
    // forcing inject dependencies always
    this.sessionManager =
      (props.dependencies && props.dependencies.sessionManager) ||
      new OnlineSessionManager(
        (props.dependencies && props.dependencies.dopplerMvcClient) ||
          new HttpDopplerMvcClient(axios, process.env.REACT_APP_API_URL),
        60000,
      );

    this.state = {
      dopplerSession: this.sessionManager.session,
      i18n: {
        locale: props.locale,
        messages: flattenMessages(messages[props.locale]),
      },
    };
  }

  updateSession(dopplerSession) {
    const locale =
      (dopplerSession.userData &&
        dopplerSession.userData.user &&
        dopplerSession.userData.user.lang) ||
      this.props.locale;
    this.setState({
      dopplerSession: dopplerSession,
      i18n: {
        locale: locale,
        messages: flattenMessages(messages[locale]),
      },
    });
  }

  componentDidMount() {
    this.sessionManager.initialize(this.updateSession);
  }

  componentWillUnmount() {
    this.sessionManager.finalize();
  }

  render() {
    const isLoggedIn = this.state.dopplerSession.status === 'authenticated';
    const i18n = this.state.i18n;
    const userData = this.state.dopplerSession.userData;
    return (
      <IntlProvider locale={i18n.locale} messages={i18n.messages}>
        {isLoggedIn ? (
          <>
            <Header userData={userData} />
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
