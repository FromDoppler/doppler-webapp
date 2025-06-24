import queryString from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.scss';
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
import Checkout from './components/Plans/Checkout/Checkout';
import { CheckoutSummary } from './components/Plans/Checkout/CheckoutSummary/CheckoutSummary';
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
import { InjectAppServices } from './services/pure-di';
import EditorsDemo from './components/EditorsDemo/EditorsDemo';
import UpdatePaymentInformation from './components/Plans/UpdatePaymentInformation/index';
import UpdatePaymentInformationSummary from './components/Plans/UpdatePaymentInformation/UpdatePaymentInformationSummary/index';
import IntegrationsSection from './components/Integrations/index';
import smoothscroll from 'smoothscroll-polyfill';
import { PlanTypes } from './components/BuyProcess/PlanTypes';
import { PlanSelection } from './components/BuyProcess/PlanSelection';
import { LandingPacksSelection } from './components/BuyProcess/LandingPacksSelection';
import { CollaboratorsSections } from './components/ControlPanel/CollaboratorsSections';
import { CollaboratorsInvite } from './components/CollaborationInvite';
import { PlanChat } from './components/BuyProcess/PlanChat';
import { BuyProcessLayout } from './components/BuyProcess/BuyProcessLayout';
import { CollaboratorEditionSection } from './components/ControlPanel/CollaboratorEditionSection';
import { Conversations } from './components/Conversations';
import { BuyConversation } from './components/Plans/BuyConversation';
import { OnSitePlansSelection } from './components/BuyProcess/OnSitePlanSelection';
import { OnSite } from './components/OnSite';
import { MyPlan } from './components/MyPlan';
import { PushNotifications } from './components/PushNotifications';
import { PushNotificationPlanSelection } from './components/BuyProcess/PushNotificationPlanSelection';
import { AdditionalServices } from './components/MyPlan/AdditionalServices';

// https://www.npmjs.com/package/smoothscroll-polyfill
smoothscroll.polyfill();

/**
 * @param { Object } props - props
 * @param { string } props.locale - locale
 * @param { import('./services/pure-di').AppServices } props.dependencies - dependencies
 */

const newDashboard = process.env.REACT_APP_NEW_DASHBOARD === 'true';

const App = ({ locale, window, dependencies: { appSessionRef, sessionManager } }) => {
  const [state, setState] = useState({
    dopplerSession: appSessionRef.current,
    i18nLocale: locale,
  });
  const location = useLocation();

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

    window.zE('messenger:set', 'locale', expectedLang ?? 'es');

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
      <DopplerIntlProvider locale={state.i18nLocale}>
        <>
          <Helmet>
            <html lang={state.i18nLocale} />
          </Helmet>
          <Routes>
            <Route
              path="/"
              element={
                location.hash.length && process.env.REACT_APP_ROUTER !== 'hash' ? (
                  <Navigate to={location.hash.replace('#', '')} />
                ) : newDashboard ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <SafeRedirect to="/Campaigns/Draft" />
                )
              }
            />
            <Route
              path="/dashboard/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports/"
              element={
                <PrivateRoute requireSiteTracking>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/integrations/shopify"
              element={
                <PrivateRoute>
                  <Shopify />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports/master-subscriber"
              element={
                <PrivateRoute>
                  <MasterSubscriber />
                </PrivateRoute>
              }
            />
            <Route
              path="/subscribers/:email/:section"
              element={
                <PrivateRoute>
                  <Subscribers />
                </PrivateRoute>
              }
            />
            <Route
              path="/control-panel/"
              element={
                <PrivateRoute>
                  <ControlPanel />
                </PrivateRoute>
              }
            />
            {/* TODO: delete this when urls change in MasterSubscribers */}
            {/* This is to keep backward compatibility with /reports/subscriber-history and /reports/subscriber-history */}
            <Route
              path="/reports/subscriber-:section"
              element={
                <PrivateRoute>
                  <SubscribersLegacyUrlRedirect />
                </PrivateRoute>
              }
            />
            <Route
              path="/new-features"
              element={
                <PrivateRoute>
                  <NewFeatures />
                </PrivateRoute>
              }
            />
            <Route
              path="/upgrade-suggestion-form"
              element={
                <PrivateRoute>
                  <UpgradeSuggestionForm />
                </PrivateRoute>
              }
            />
            {/* TODO: GoToUpgrade should be removed when the calculator supports upgrade between paid accounts */}
            <Route
              path="/plan-selection/premium/:planType"
              element={
                <PrivateRoute>
                  <BuyProcessLayout>
                    <PlanSelection />
                  </BuyProcessLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/plan-chat/premium/:planType"
              element={
                <PrivateRoute>
                  <BuyProcessLayout>
                    <PlanChat />
                  </BuyProcessLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/buy-conversation"
              element={
                <PrivateRoute>
                  <BuyConversation />
                </PrivateRoute>
              }
            />
            <Route
              path="/buy-onsite-plans"
              element={
                <PrivateRoute>
                  <BuyProcessLayout>
                    <OnSitePlansSelection />
                  </BuyProcessLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout/:pathType/:planType"
              element={
                <PrivateRoute>
                  <BuyProcessLayout>
                    <Checkout />
                  </BuyProcessLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/email-marketing-for-agencies"
              element={
                <PrivateRoute>
                  <AgenciesForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/email-marketing-exclusive"
              element={
                <PrivateRoute>
                  <ExclusiveForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports/partials-campaigns"
              element={
                <PrivateRoute>
                  <ReportsPartialsCampaigns />
                </PrivateRoute>
              }
            />
            <Route
              path="/billing/invoices"
              element={
                <PrivateRoute>
                  <InvoicesList />
                </PrivateRoute>
              }
            />
            <Route
              path="/sending-preferences/contact-policy"
              element={
                <PrivateRoute>
                  <ContactPolicy />
                </PrivateRoute>
              }
            />
            <Route
              path="/integrations/big-query"
              element={
                <PrivateRoute>
                  <AuthorizationPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout-summary"
              element={
                <PrivateRoute>
                  <BuyProcessLayout>
                    <CheckoutSummary />
                  </BuyProcessLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/editors-demo"
              element={
                <PrivateRoute>
                  <EditorsDemo />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<PublicRouteWithLegacyFallback />} />
            <Route path="/signup" element={<PublicRouteWithLegacyFallback />} />
            <Route path="/login/reset-password" element={<PublicRouteWithLegacyFallback />} />
            <Route path="/signup/confirmation" element={<SignupConfirmation />} />
            <Route path="/collab/acceptance" element={<CollaboratorsInvite />} />
            <Route path="/ingresa" element={<RedirectWithQuery to="/login?lang=es" />} />
            <Route path="/registrate" element={<RedirectWithQuery to="/signup?lang=es" />} />
            <Route
              path="/ingresa/cambiar-clave"
              element={<RedirectWithQuery to="/forgot-password?lang=es" />}
            />
            <Route
              path="/forgot-password"
              element={<RedirectWithQuery to="/login/reset-password" />}
            />
            <Route
              path="/plan-selection"
              element={
                <RedirectWithQuery
                  to={`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`}
                />
              }
            />
            {/* TODO: Implement NotFound page in place of redirect all to reports */}
            {/* <Route component={NotFound} /> */}
            <Route path="/*" element={<Navigate to={newDashboard ? '/dashboard' : '/reports'} />} />
            <Route
              path="/update-payment-method"
              element={
                <PrivateRoute>
                  <UpdatePaymentInformation />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment-information-summary"
              element={
                <PrivateRoute>
                  <UpdatePaymentInformationSummary />
                </PrivateRoute>
              }
            />
            <Route
              path="/plan-types"
              element={
                <PrivateRoute>
                  <PlanTypes />
                </PrivateRoute>
              }
            />
            <Route
              path="/landing-packages"
              element={
                <PrivateRoute>
                  <BuyProcessLayout>
                    <LandingPacksSelection />
                  </BuyProcessLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/integrations/"
              element={
                <PrivateRoute>
                  <IntegrationsSection />
                </PrivateRoute>
              }
            />
            <Route
              path="/control-panel/collaborators/"
              element={
                <PrivateRoute>
                  <CollaboratorsSections />
                </PrivateRoute>
              }
            />
            <Route
              path="/control-panel/collaborator-edition/"
              element={
                <PrivateRoute>
                  <CollaboratorEditionSection />
                </PrivateRoute>
              }
            />
            <Route
              path="/conversations/"
              element={
                <PrivateRoute>
                  <Conversations />
                </PrivateRoute>
              }
            />
            <Route
              path="/onsite/"
              element={
                <PrivateRoute>
                  <OnSite />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-plan/"
              element={
                <PrivateRoute>
                  <MyPlan />
                </PrivateRoute>
              }
            />
            <Route
              path="/additional-services/"
              element={
                <PrivateRoute>
                  <AdditionalServices />
                </PrivateRoute>
              }
            />
            <Route
              path="/push-notifications/"
              element={
                <PrivateRoute>
                  <PushNotifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/buy-push-notification-plans"
              element={
                <PrivateRoute>
                  <BuyProcessLayout>
                    <PushNotificationPlanSelection />
                  </BuyProcessLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </>
      </DopplerIntlProvider>
    </>
  );
};

export default InjectAppServices(App);
