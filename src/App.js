import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Translate} from 'react-translated';

import HeaderNav from './components/Header/Nav';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <HeaderNav />
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <Translate text='Edit' /> <code>src/App.js</code> <Translate text='and save to reload.' />
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Translate text='Learn React' />
          </a>
        </header>
      </div>
    );
  }
}

export default App;
