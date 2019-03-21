import React, { Component } from 'react';
import './App.css';
import DopplerIntlProvider from './DopplerIntlProvider';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Reports from './components/Reports/Reports';
import { InjectAppServices } from './services/pure-di';
import Loading from './components/Loading/Loading';

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

    const Login = ({ location }) => (
      <div>
        {/* TODO: implement login */}
        LOGIN. After login, redirect to{' '}
        {location.state && location.state.from
          ? `${location.state.from.pathname}${location.state.from.search}${
              location.state.from.hash
            }`
          : '/'}
        <code>
          <pre>{JSON.stringify(location, null, 2)}</pre>
        </code>
      </div>
    );

    const PrivateRoute = ({ component: Component, ...rest }) => {
      return (
        <Route
          {...rest}
          render={(props) =>
            sessionStatus === 'authenticated' ? (
              <>
                <Header userData={userData} />
                <Component {...props} />
                <Footer />
              </>
            ) : (
              <this.RedirectToLogin from={props.location} />
            )
          }
        />
      );
    };

    return (
      <DopplerIntlProvider locale={i18nLocale}>
        {sessionStatus === 'unknown' ? (
          <Loading />
        ) : (
          <Router>
            <Switch>
              <Route path="/" exact component={() => <Redirect to={{ pathname: '/reports' }} />} />
              <PrivateRoute path="/reports/" exact component={Reports} />
              <Route path="/login/" exact component={Login} />
              {/* TODO: Implement NotFound page in place of redirect all to reports */}
              {/* <Route component={NotFound} /> */}
              <Route component={() => <Redirect to={{ pathname: '/reports' }} />} />
            </Switch>
          </Router>
        )}
      </DopplerIntlProvider>
    );
  }
}

export default InjectAppServices(App);
