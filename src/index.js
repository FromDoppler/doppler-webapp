import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AppServicesProvider } from './services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
// Only used in development environment, it does not affect production build
import { HardcodedDopplerLegacyClient } from './services/doppler-legacy-client.doubles';
import { HardcodedDatahubClient } from './services/datahub-client.doubles';
import { HardcodedDopplerSitesClient } from './services/doppler-sites-client.doubles';
import { HardcodedDopplerBillingApiClient } from './services/doppler-billing-api-client.double';
import { polyfill } from 'es6-object-assign';
import 'polyfill-array-includes';
import 'promise-polyfill/src/polyfill';
import { availableLanguageOrDefault } from './i18n/utils';
import { HardcodedShopifyClient } from './services/shopify-client.doubles';
import { getDataHubParams } from './utils';
import { HardcodedDopplerApiClient } from './services/doppler-api-client.double';
import { HardcodedIpinfoClient } from './services/ipinfo-client.doubles';
import { HardcodedBigQueryClient } from './services/big-query-client.double';
import { HardcodedDopplerUserApiClient } from './services/doppler-user-api-client.double';
import { HardcodedDopplerContactPolicyApiClient } from './services/doppler-contact-policy-api-client.double';
import { HardcodedStaticDataClient } from './services/static-data-client.double';
import { HardcodedDopplerBillingUserApiClient } from './services/doppler-billing-user-api-client.double';
import { HardcodedDopplerAccountPlansApiClient } from './services/doppler-account-plans-api-client.double';
import { HardcodedReportClient } from './services/reports/index.double';
import { HardcodedDopplerSystemUsageApiClient } from './services/doppler-system-usage-api-client.double';
import { HardcodedSystemUsageSummaryClient } from './services/dashboardService/SystemUsageSummary.double';
import { HardcodedDopplerBeplicApiClient } from './services/doppler-beplic-api-client.double';
import { HardcodedDopplerPopupHubApiClient } from './services/doppler-popup-hub-api-client.double';

polyfill();

if (document.querySelector('body').setActive) {
  document.querySelector('body').setActive();
}

const locale = availableLanguageOrDefault(navigator.language.toLowerCase().split(/[_-]+/)[0]);

// Only used in development and demo environments, it does not affect production build
const forcedServices =
  process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_DEMO_ENABLED
    ? {
        dopplerLegacyClient: new HardcodedDopplerLegacyClient(),
        dopplerSitesClient: new HardcodedDopplerSitesClient(),
        datahubClient: new HardcodedDatahubClient(),
        shopifyClient: new HardcodedShopifyClient(),
        dopplerApiClient: new HardcodedDopplerApiClient(),
        ipinfoClient: new HardcodedIpinfoClient(),
        dopplerBillingApiClient: new HardcodedDopplerBillingApiClient(),
        bigQueryClient: new HardcodedBigQueryClient(),
        reportClient: new HardcodedReportClient(),
        dopplerUserApiClient: new HardcodedDopplerUserApiClient(),
        dopplerContactPolicyApiClient: new HardcodedDopplerContactPolicyApiClient(),
        staticDataClient: new HardcodedStaticDataClient(),
        dopplerBillingUserApiClient: new HardcodedDopplerBillingUserApiClient(),
        dopplerSystemUsageApiClient: new HardcodedDopplerSystemUsageApiClient(),
        systemUsageSummary: new HardcodedSystemUsageSummaryClient(),
        dopplerAccountPlansApiClient: new HardcodedDopplerAccountPlansApiClient(),
        dopplerBeplicApiClient: new HardcodedDopplerBeplicApiClient(),
        dopplerPopupHubApiClient: new HardcodedDopplerPopupHubApiClient(),
      }
    : {};

// Initialize Google Analytics ID
ReactGA.initialize('UA-532159-1');

const history = createBrowserHistory();

const trackNavigation = (location) => {
  const locationPage = location.hash && location.hash[0] === '#' && location.hash.slice(1);
  ReactGA.set({ page: locationPage });
  ReactGA.pageview(locationPage);
  const dataHubParams = getDataHubParams(locationPage);
  window._dha &&
    (window._dha.track(dataHubParams) || window._dha.trackDOMMutation(window._dha.trackInputEmail));
};

trackNavigation(window.location);

// Get the current location
history.listen((location) => {
  trackNavigation(location);
});

// Choose hash router for cdn only
const Router = process.env.REACT_APP_ROUTER === 'hash' ? HashRouter : BrowserRouter;

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <AppServicesProvider forcedServices={forcedServices}>
    <Router>
      <App locale={locale} window={window} />
    </Router>
  </AppServicesProvider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
