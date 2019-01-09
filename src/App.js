import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FormattedHTMLMessage } from 'react-intl';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';

import HeaderNav from './components/Header/Nav';

addLocaleData([...en, ...es]);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <HeaderNav />
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <FormattedHTMLMessage id="app.title" />
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FormattedHTMLMessage id="app.link" />
          </a>
        </header>
      </div>
    );
  }
}

export default App;
