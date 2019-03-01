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

    this.sessionManager = new OnlineSessionManager();

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
    const isLoggedIn = this.state.dopplerSession.status === 'authenticated';
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
