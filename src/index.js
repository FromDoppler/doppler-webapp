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
import { polyfill } from 'es6-object-assign';
import 'polyfill-array-includes';
import 'promise-polyfill/src/polyfill';

polyfill();

if (document.querySelector('body').setActive) {
  document.querySelector('body').setActive();
}

// TODO: this hardcoded data will depend by the app language
const localeFromNavigator = navigator.language.toLowerCase().split(/[_-]+/)[0] || 'en';
// TODO: remove language validation code
const locale = ['es', 'en'].includes(localeFromNavigator) ? localeFromNavigator : 'en';

// Only used in development environment, it does not affect production build
const forcedServices =
  process.env.NODE_ENV === 'development'
    ? {
        dopplerLegacyClient: new HardcodedDopplerLegacyClient(),
        datahubClient: new HardcodedDatahubClient(),
      }
    : {};

// Initialize Google Analytics ID
ReactGA.initialize('UA-532159-1');

const history = createBrowserHistory();

// Get the current location
history.listen((location) => {
  const locationPage = location.hash && location.hash[0] === '#' && location.hash.slice(1);
  ReactGA.set({ page: locationPage });
  ReactGA.pageview(locationPage);
  // TODO: Also notify navigation to DataHub (DataHub does not have this feature yet)
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
