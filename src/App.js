import React, { Component } from 'react';
import './App.css';
import DopplerIntlProvider from './i18n/DopplerIntlProvider';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRouteWithLegacyFallback from './components/PublicRouteWithLegacyFallback';
import Reports from './components/Reports/Reports';
import { InjectAppServices } from './services/pure-di';
import queryString from 'query-string';
import { OriginCatcher } from './services/origin-management';
import RedirectToLegacyUrl from './components/RedirectToLegacyUrl';
import RedirectWithQuery from './components/RedirectWithQuery';

class App extends Component {
  /**
   * @param { Object } props - props
   * @param { string } props.locale - locale
   * @param { import('./services/pure-di').AppServices } props.dependencies - dependencies
   */
  constructor({ locale, dependencies: { appSessionRef, sessionManager } }) {
    super();

    this.updateSession = this.updateSession.bind(this);

    this.sessionManager = sessionManager;

    this.state = {
      // TODO: consider removing dopplerSession from the state
      dopplerSession: appSessionRef.current,
      i18nLocale: locale,
    };
  }

  componentDidMount() {
    this.sessionManager.initialize(this.updateSession);
  }

  componentWillUnmount() {
    this.sessionManager.finalize();
  }

  static getDerivedStateFromProps(props, state) {
    const { lang: langFromUrl } =
      props.location && props.location.search && queryString.parse(props.location.search);

    const expectedLang = ['es', 'en'].includes(langFromUrl) ? langFromUrl : null;

    if (state.langFromUrl !== expectedLang) {
      return expectedLang
        ? {
            langFromUrl: expectedLang,
            i18nLocale: expectedLang,
          }
        : { langFromUrl: null };
    }

    // No state update necessary
    return null;
  }

  updateSession(dopplerSession) {
    const stateChanges = { dopplerSession: dopplerSession };

    if (
      !this.state.langFromUrl &&
      dopplerSession.userData &&
      dopplerSession.userData.user &&
      dopplerSession.userData.user.lang
    ) {
      stateChanges.i18nLocale = dopplerSession.userData.user.lang;
    }

    this.setState(stateChanges);
  }

  render() {
    const { i18nLocale } = this.state;

    return (
      <DopplerIntlProvider locale={i18nLocale}>
        <>
          <OriginCatcher />
          <Switch>
            <Route path="/" exact>
              <RedirectToLegacyUrl to="/Campaigns/Draft" />
            </Route>
            <PrivateRoute path="/reports/" exact requireDatahub component={Reports} />
            <PublicRouteWithLegacyFallback exact path="/login" />
            <PublicRouteWithLegacyFallback exact path="/signup" />
            <PublicRouteWithLegacyFallback exact path="/forgot-password" />
            <RedirectWithQuery exact from="/ingresa" to="/login?lang=es" />
            <RedirectWithQuery exact from="/registrate" to="/signup?lang=es" />
            {/* TODO: Implement NotFound page in place of redirect all to reports */}
            {/* <Route component={NotFound} /> */}
            <Route component={() => <Redirect to={{ pathname: '/reports' }} />} />
          </Switch>
        </>
      </DopplerIntlProvider>
    );
  }
}

export default withRouter(InjectAppServices(App));
