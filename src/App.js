import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DopplerIntlProvider from './DopplerIntlProvider';
import { FormattedMessage } from 'react-intl';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import axios from 'axios';
import { HttpDopplerLegacyClient } from './services/doppler-legacy-client';
import { OnlineSessionManager } from './services/session-manager';

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
      i18nLocale: props.locale,
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
      dopplerSession: { status: sessionStatus, userData },
      i18nLocale,
    } = this.state;
    return (
      <DopplerIntlProvider locale={i18nLocale}>
        {sessionStatus === 'authenticated' ? (
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
      </DopplerIntlProvider>
    );
  }
}

export default App;
