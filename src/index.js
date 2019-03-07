import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Only used in development environment, it does not affect production build
import { HardcodedDopplerLegacyClient } from './services/doppler-legacy-client.doubles';

// TODO: this hardcoded data will depend by the app language
const locale = navigator.language.toLowerCase().split(/[_-]+/)[0] || 'en';

if (process.env.NODE_ENV === 'development') {
  // Only used in development environment, it does not affect production build
  const dependencies = {
    dopplerLegacyClient: new HardcodedDopplerLegacyClient(),
  };
  ReactDOM.render(
    <App locale={locale} dependencies={dependencies} />,
    document.getElementById('root'),
  );
} else {
  ReactDOM.render(<App locale={locale} />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
