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
import Subscribers from './components/Reports/Subscribers/Subscribers';
import ReportsPartialsCampaigns from './components/Reports/ReportsPartialsCampaigns/ReportsPartialsCampaigns';
import NewFeatures from './components/NewFeatures/NewFeatures';
import Offline from './components/Offline/Offline';
import PushNotifications from './components/PushNotifications/PushNotifications';
import SubscribersLegacyUrlRedirect from './components/Reports/Subscribers/SubscribersLegacyUrlRedirect';
import ChangePlan from './components/ChangePlan/ChangePlan';
import PlanCalculator from './components/ChangePlan/PlanCalculator/PlanCalculator';
import AgenciesForm from './components/DopplerPlus/AgenciesForm';
import InvoicesList from './components/InvoicesList/InvoicesList';
import ExclusiveForm from './components/DopplerPlus/ExclusiveForm';
import { ContactPolicy } from './components/ContactPolicy/ContactPolicy';
import { Promotional } from './components/Integrations/BigQuery/Promotional/Promotional';
import { AuthorizationPage } from './components/Integrations/BigQuery/ControlPanel/AuthorizationPage';
import Checkout from './components/ChangePlan/Checkout/Checkout';

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
    <>
      {state.dopplerSession.status === 'maintenance' ? (
        <Offline />
      ) : (
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
              <PrivateRoute path="/subscribers/:email/:section" exact component={Subscribers} />
              {/* TODO: delete this when urls change in MasterSubscribers */}
              {/* This is to keep backward compatibility with /reports/subscriber-history and /reports/subscriber-history */}
              <PrivateRoute
                path="/reports/subscriber-:section"
                exact
                component={SubscribersLegacyUrlRedirect}
              />
              <PrivateRoute path="/new-features" exact component={NewFeatures} />
              <PrivateRoute path={['/plan-selection']} exact component={ChangePlan} />
              <PrivateRoute
                path={'/plan-selection/:pathType/:planType?'}
                exact
                component={PlanCalculator}
              />
              <PrivateRoute path={'/checkout/:pathType/:planType?'} exact component={Checkout} />
              <PrivateRoute path={'/email-marketing-for-agencies'} exact component={AgenciesForm} />
              <PrivateRoute path={'/email-marketing-exclusive'} exact component={ExclusiveForm} />
              <PrivateRoute path="/push" exact component={PushNotifications} />
              <PrivateRoute
                path="/reports/partials-campaigns"
                exact
                component={ReportsPartialsCampaigns}
              />
              <PrivateRoute path={['/billing/invoices']} exact component={InvoicesList} />
              <PrivateRoute
                path={'/sending-preferences/contact-policy'}
                exact
                component={ContactPolicy}
              />
              <PrivateRoute path="/integrations/big-query" exact component={Promotional} />
              <PrivateRoute
                path="/integrations/big-query/plus"
                exact
                component={AuthorizationPage}
              />
              <PublicRouteWithLegacyFallback exact path="/login" />
              <PublicRouteWithLegacyFallback exact path="/signup" />
              <PublicRouteWithLegacyFallback exact path="/login/reset-password" />
              <Route path="/signup/confirmation" exact component={SignupConfirmation} />
              <Route path="/offline" exact component={Offline} />
              <RedirectWithQuery exact from="/ingresa" to="/login?lang=es" />
              <RedirectWithQuery exact from="/registrate" to="/signup?lang=es" />
              <RedirectWithQuery
                exact
                from="/ingresa/cambiar-clave"
                to="/forgot-password?lang=es"
              />
              <RedirectWithQuery exact from="/forgot-password" to="/login/reset-password" />
              {/* TODO: Implement NotFound page in place of redirect all to reports */}
              {/* <Route component={NotFound} /> */}
              <Route component={() => <Redirect to={{ pathname: '/reports' }} />} />
            </Switch>
          </>
        </DopplerIntlProvider>
      )}
    </>
  );
};

export default withRouter(InjectAppServices(App));
