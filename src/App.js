import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import messages_es from './i18n/es.json';
import messages_en from './i18n/en.json';
import { flattenMessages } from './utils';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import axios from 'axios';
import { HttpDopplerLegacyClient } from './services/doppler-legacy-client';
import { OnlineSessionManager } from './services/session-manager';

const messages = {
  es: messages_es,
  en: messages_en,
};

addLocaleData([...en, ...es]);

class App extends Component {
  constructor(props) {
    super(props);

    this.updateSession = this.updateSession.bind(this);

    this.sessionManager =
      (props.dependencies && props.dependencies.sessionManager) ||
      new OnlineSessionManager(
        (props.dependencies && props.dependencies.dopplerLegacyClient) ||
          new HttpDopplerLegacyClient(axios, process.env.REACT_APP_API_URL),
        process.env.REACT_APP_DOPPLER_LEGACY_KEEP_ALIVE_MS,
      );

    this.state = {
      dopplerSession: this.sessionManager.session,
      i18n: {
        locale: props.locale,
        messages: flattenMessages(messages[props.locale]),
      },
    };
  }

  componentDidMount() {
    this.sessionManager.initialize(this.updateSession);
  }

  componentWillUnmount() {
    this.sessionManager.finalize();
  }

  updateSession(dopplerSession) {
    this.setState({ dopplerSession: dopplerSession });
  }

  render() {
    const {
      dopplerSession: { status: sessionStatus },
      i18n,
    } = this.state;
    return (
      <IntlProvider locale={i18n.locale} messages={i18n.messages}>
        {sessionStatus === 'authenticated' ? (
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
