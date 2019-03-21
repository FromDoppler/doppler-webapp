import React, { Component } from 'react';
import './App.css';
import DopplerIntlProvider from './DopplerIntlProvider';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Reports from './components/Reports/Reports';
import { InjectAppServices } from './services/pure-di';
import Loading from './components/Loading';

class App extends Component {
  constructor({ locale, dependencies: { sessionManager } }) {
    super();

    this.updateSession = this.updateSession.bind(this);

    /** @type { import('./services/session-manager').SessionManager } */
    this.sessionManager = sessionManager;

    this.state = {
      dopplerSession: this.sessionManager.session,
      i18nLocale: locale,
    };
  }

  componentDidMount() {
    this.sessionManager.initialize(this.updateSession);
  }

  componentWillUnmount() {
    this.sessionManager.finalize();
  }

  updateSession(dopplerSession) {
    const stateChanges = { dopplerSession: dopplerSession };
    if (
      dopplerSession.userData &&
      dopplerSession.userData.user &&
      dopplerSession.userData.user.lang
    ) {
      stateChanges.i18nLocale = dopplerSession.userData.user.lang;
    }
    this.setState(stateChanges);
  }

  render() {
    const {
      dopplerSession: { status: sessionStatus, userData },
      i18nLocale,
    } = this.state;
    const redirectToReports = () => <Redirect to={{ pathname: '/reports' }} />;

    return (
      <DopplerIntlProvider locale={i18nLocale}>
        {sessionStatus === 'authenticated' ? (
          <Router>
            <div>
              <Header userData={userData} />
              <Route path="/" exact component={redirectToReports} />
              <Route path="/reports/" exact component={Reports} />
              <Footer />
            </div>
          </Router>
        ) : (
          <Loading />
        )}
      </DopplerIntlProvider>
    );
  }
}

export default InjectAppServices(App);
