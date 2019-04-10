import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AppServicesProvider } from './services/pure-di';
import { RedirectToInternalLogin } from './components/RedirectToLogin';
import { HashRouter as Router } from 'react-router-dom';

// Only used in development environment, it does not affect production build
import { HardcodedDopplerLegacyClient } from './services/doppler-legacy-client.doubles';
import { HardcodedDatahubClient } from './services/datahub-client.doubles';

// TODO: this hardcoded data will depend by the app language
const locale = navigator.language.toLowerCase().split(/[_-]+/)[0] || 'en';

// Only used in development environment, it does not affect production build
const forcedServices =
  process.env.NODE_ENV === 'development'
    ? {
        dopplerLegacyClient: new HardcodedDopplerLegacyClient(),
        datahubClient: new HardcodedDatahubClient(),
        RedirectToLogin: RedirectToInternalLogin,
      }
    : {};

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
