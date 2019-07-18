import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AppServicesProvider } from './services/pure-di';
import { HashRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
// Only used in development environment, it does not affect production build
import { HardcodedDopplerLegacyClient } from './services/doppler-legacy-client.doubles';
import { HardcodedDatahubClient } from './services/datahub-client.doubles';
import { HardcodedDopplerSitesClient } from './services/doppler-sites-client.doubles';
import { polyfill } from 'es6-object-assign';
import 'polyfill-array-includes';
import 'promise-polyfill/src/polyfill';
import { availableLanguageOrDefault } from './i18n/utils';
import { HardcodedShopifyClient } from './services/shopify-client.doubles';

polyfill();

if (document.querySelector('body').setActive) {
  document.querySelector('body').setActive();
}

const locale = availableLanguageOrDefault(navigator.language.toLowerCase().split(/[_-]+/)[0]);

// Only used in development environment, it does not affect production build
const forcedServices =
  process.env.NODE_ENV === 'development'
    ? {
        dopplerLegacyClient: new HardcodedDopplerLegacyClient(),
        dopplerSitesClient: new HardcodedDopplerSitesClient(),
        datahubClient: new HardcodedDatahubClient(),
        shopifyClient: new HardcodedShopifyClient(),
      }
    : {};

// Initialize Google Analytics ID
ReactGA.initialize('UA-532159-1');

const history = createBrowserHistory();

const parseUrl = (partialUrl) => {
  const hash =
    partialUrl.indexOf('#') !== -1
      ? partialUrl.substring(partialUrl.indexOf('#') + 1, partialUrl.length)
      : '';
  const search =
    partialUrl.indexOf('?') !== -1
      ? hash.length
        ? partialUrl.substring(partialUrl.indexOf('?') + 1, partialUrl.indexOf('#'))
        : partialUrl.substring(partialUrl.indexOf('?') + 1, partialUrl.length)
      : '';
  const page =
    partialUrl.split('?').length >= 2
      ? partialUrl.split('?')[0]
      : partialUrl.split('#').length >= 2
      ? partialUrl.split('#')[0]
      : partialUrl;
  return { hash, search, page };
};

const trackNavigation = (location) => {
  const locationPage = location.hash && location.hash[0] === '#' && location.hash.slice(1);
  ReactGA.set({ page: locationPage });
  ReactGA.pageview(locationPage);
  const result = parseUrl(locationPage);
  window._dha &&
    window._dha.track({ navigatedPage: result.page, hash: result.hash, search: result.search });
};

trackNavigation(window.location);

// Get the current location
history.listen((location) => {
  trackNavigation(location);
});

ReactDOM.render(
  <AppServicesProvider forcedServices={forcedServices}>
    <Router>
      <App locale={locale} />
    </Router>
  </AppServicesProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
