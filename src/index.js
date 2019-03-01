import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// TODO: this hardcoded data will depend by the app language
const locale = navigator.language.toLowerCase().split(/[_-]+/)[0] || 'en';

ReactDOM.render(<App locale={locale} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
