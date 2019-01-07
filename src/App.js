import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import HeaderNav from './components/Header/Nav';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <HeaderNav />
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. Test Pr builder. PR.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
