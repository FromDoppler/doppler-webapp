import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
import { ContactPolicy } from './components/ContactPolicy/ContactPolicy';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { Dashboard } from './components/Dashboard/Dashboard';
import AgenciesForm from './components/DopplerPlus/AgenciesForm';
import ExclusiveForm from './components/DopplerPlus/ExclusiveForm';
import UpgradeSuggestionForm from './components/DopplerPlus/UpgradeSuggestionForm';
import { AuthorizationPage } from './components/Integrations/BigQuery/AuthorizationPage';
import Shopify from './components/Integrations/Shopify/Shopify';
import InvoicesList from './components/InvoicesList/InvoicesList';
import NewFeatures from './components/NewFeatures/NewFeatures';
import Offline from './components/Offline/Offline';
import Checkout from './components/Plans/Checkout/Checkout';
import { CheckoutSummary } from './components/Plans/Checkout/CheckoutSummary';
import { GoToUpgrade } from './components/Plans/PlanCalculator/GoToUpgrade';
import PrivateRoute from './components/PrivateRoute';
import PublicRouteWithLegacyFallback from './components/PublicRouteWithLegacyFallback';
import RedirectWithQuery from './components/RedirectWithQuery';
import MasterSubscriber from './components/Reports/MasterSubscriber/MasterSubscriber';
import Reports from './components/Reports/Reports';
import ReportsPartialsCampaigns from './components/Reports/ReportsPartialsCampaigns/ReportsPartialsCampaigns';
import Subscribers from './components/Reports/Subscribers/Subscribers';
import SubscribersLegacyUrlRedirect from './components/Reports/Subscribers/SubscribersLegacyUrlRedirect';
import SafeRedirect from './components/SafeRedirect';
import SignupConfirmation from './components/Signup/SignupConfirmation';
import { PLAN_TYPE, URL_PLAN_TYPE } from './doppler-types';
import DopplerIntlProvider from './i18n/DopplerIntlProvider';
import { availableLanguageOrNull } from './i18n/utils';
import { OriginCatcher } from './services/origin-management';
import { InjectAppServices } from './services/pure-di';

/**
 * @param { Object } props - props
 * @param { string } props.locale - locale
 * @param { import('./services/pure-di').AppServices } props.dependencies - dependencies
 */

const newDashboard = process.env.REACT_APP_NEW_DASHBOARD === 'true';

const App = ({ locale, location, window, dependencies: { appSessionRef, sessionManager } }) => {
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

    window.zE('webWidget', 'setLocale', expectedLang ?? 'es');

    if (!expectedLang) {
      langFromUrl.current = null;
    } else if (!langFromUrl.current || langFromUrl.current !== expectedLang) {
      setState((prevState) => ({
        i18nLocale: expectedLang,
        dopplerSession: prevState.dopplerSession,
      }));
      langFromUrl.current = expectedLang;
    }
  }, [location, window]);

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
                  ) : newDashboard ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <SafeRedirect to="/Campaigns/Draft" />
                  )
                }
              />
              <PrivateRoute path="/dashboard/" exact component={Dashboard} />
              <PrivateRoute path="/reports/" exact requireSiteTracking component={Reports} />
              <PrivateRoute path="/integrations/shopify" exact component={Shopify} />
              <PrivateRoute path="/reports/master-subscriber" exact component={MasterSubscriber} />
              <PrivateRoute path="/subscribers/:email/:section" exact component={Subscribers} />
              <PrivateRoute path="/control-panel/" exact component={ControlPanel} />
              {/* TODO: delete this when urls change in MasterSubscribers */}
              {/* This is to keep backward compatibility with /reports/subscriber-history and /reports/subscriber-history */}
              <PrivateRoute
                path="/reports/subscriber-:section"
                exact
                component={SubscribersLegacyUrlRedirect}
              />
              <PrivateRoute path="/new-features" exact component={NewFeatures} />
              <PrivateRoute
                path={['/upgrade-suggestion-form']}
                exact
                component={UpgradeSuggestionForm}
              />
              {/* TODO: GoToUpgrade should be removed when the calculator supports upgrade between paid accounts */}
              <PrivateRoute
                path="/plan-selection/premium/:planType?"
                exact
                component={GoToUpgrade}
              />
              <PrivateRoute path={'/checkout/:pathType/:planType?'} exact component={Checkout} />
              <PrivateRoute path={'/email-marketing-for-agencies'} exact component={AgenciesForm} />
              <PrivateRoute path={'/email-marketing-exclusive'} exact component={ExclusiveForm} />
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
              <PrivateRoute path="/integrations/big-query" exact component={AuthorizationPage} />
              <PrivateRoute path={['/checkout-summary']} exact component={CheckoutSummary} />
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
              <RedirectWithQuery
                exact
                from="/plan-selection"
                to={`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`}
              />
              {/* TODO: Implement NotFound page in place of redirect all to reports */}
              {/* <Route component={NotFound} /> */}
              <Route
                component={() =>
                  newDashboard ? (
                    <Redirect to={{ pathname: '/dashboard' }} />
                  ) : (
                    <Redirect to={{ pathname: '/reports' }} />
                  )
                }
              />
            </Switch>
          </>
        </DopplerIntlProvider>
      )}
    </>
  );
};

export default withRouter(InjectAppServices(App));
