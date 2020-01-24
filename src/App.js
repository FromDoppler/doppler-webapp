import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import DopplerIntlProvider from './i18n/DopplerIntlProvider';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRouteWithLegacyFallback from './components/PublicRouteWithLegacyFallback';
import Reports from './components/Reports/Reports';
import { InjectAppServices } from './services/pure-di';
import queryString from 'query-string';
import { OriginCatcher } from './services/origin-management';
import SafeRedirect from './components/SafeRedirect';
import RedirectWithQuery from './components/RedirectWithQuery';
import { Helmet } from 'react-helmet';
import { availableLanguageOrNull } from './i18n/utils';
import Shopify from './components/Integrations/Shopify/Shopify';
import SignupConfirmation from './components/Signup/SignupConfirmation';
import MasterSubscriber from './components/Reports/MasterSubscriber/MasterSubscriber';
import CampaignsHistory from './components/Reports/CampaignsHistory/CampaignsHistory';

/**
 * @param { Object } props - props
 * @param { string } props.locale - locale
 * @param { import('./services/pure-di').AppServices } props.dependencies - dependencies
 */
const App = ({ locale, location, dependencies: { appSessionRef, sessionManager } }) => {
  const [state, setState] = useState({
    dopplerSession: appSessionRef.current,
    i18nLocale: locale,
  });

  const langFromUrl = useRef(null);

  const getI18nLocale = (dopplerSession, prevI18nLocale) => {
    return (
      (!langFromUrl.current &&
        dopplerSession.userData &&
        dopplerSession.userData.user &&
        dopplerSession.userData.user.lang) ||
      prevI18nLocale
    );
  };

  useEffect(() => {
    const updateSession = (dopplerSession) => {
      setState((prevState) => ({
        i18nLocale: getI18nLocale(dopplerSession, prevState.i18nLocale),
        dopplerSession: dopplerSession,
      }));
    };
    sessionManager.initialize(updateSession);
    return () => {
      sessionManager.finalize();
    };
  }, [sessionManager]);

  useEffect(() => {
    const { lang: langFromUrlParameter } =
      location && location.search && queryString.parse(location.search);

    const expectedLang = availableLanguageOrNull(langFromUrlParameter);

    if (!expectedLang) {
      langFromUrl.current = null;
    } else if (!langFromUrl.current || langFromUrl.current !== expectedLang) {
      setState((prevState) => ({
        i18nLocale: expectedLang,
        dopplerSession: prevState.dopplerSession,
      }));
      langFromUrl.current = expectedLang;
    }
  }, [location]);

  return (
    <DopplerIntlProvider locale={state.i18nLocale}>
      <>
        <Helmet>
          <html lang={state.i18nLocale} />
        </Helmet>
        <OriginCatcher />
        <Switch>
          <Route
            exact
            path="/"
            render={({ location }) =>
              location.hash.length && process.env.REACT_APP_ROUTER !== 'hash' ? (
                <Redirect to={location.hash.replace('#', '')} />
              ) : (
                <SafeRedirect to="/Campaigns/Draft" />
              )
            }
          />
          <PrivateRoute path="/reports/" exact requireSiteTracking component={Reports} />
          <PrivateRoute path="/integrations/shopify" exact component={Shopify} />
          <PrivateRoute path="/reports/master-subscriber" exact component={MasterSubscriber} />
          <PrivateRoute path="/reports/campaigns-history" exact component={CampaignsHistory} />
          <PublicRouteWithLegacyFallback exact path="/login" />
          <PublicRouteWithLegacyFallback exact path="/signup" />
          <PublicRouteWithLegacyFallback exact path="/login/reset-password" />
          <Route path="/signup/confirmation" exact component={SignupConfirmation} />
          <RedirectWithQuery exact from="/ingresa" to="/login?lang=es" />
          <RedirectWithQuery exact from="/registrate" to="/signup?lang=es" />
          <RedirectWithQuery exact from="/ingresa/cambiar-clave" to="/forgot-password?lang=es" />
          <RedirectWithQuery exact from="/forgot-password" to="/login/reset-password" />
          {/* TODO: Implement NotFound page in place of redirect all to reports */}
          {/* <Route component={NotFound} /> */}
          <Route component={() => <Redirect to={{ pathname: '/reports' }} />} />
        </Switch>
      </>
    </DopplerIntlProvider>
  );
};

export default withRouter(InjectAppServices(App));
