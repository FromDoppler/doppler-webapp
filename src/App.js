import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

addLocaleData([...en, ...es]);

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      loginSession: {},
    };
  }

  componentWillMount() {
    this.getUserData();
    this.interval = setInterval(() => {
      this.getUserData();
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  manageJwtToken() {
    var encodedToken = localStorage.getItem('jwtToken');
    if (encodedToken) {
      try {
        this.setState({ loginSession: this.decodeLoginSession(encodedToken) });
        if (this.state.user.Email !== this.state.loginSession.email) {
          this.saveStoredSession(this.state.loginSession);
        }
      } catch (error) {
        this.logOut();
        return;
      }
    } else {
      axios
        .get(process.env.REACT_APP_API_URL + '/Reports/Reports/GetJwtToken', {
          withCredentials: 'include',
        })
        .then((response) => {
          this.saveStoredSession({ token: response.data.jwtToken });
        })
        .catch((error) => {
          this.logOut();
        });
    }
  }

  getUserData() {
    axios
      .get(process.env.REACT_APP_API_URL + '/Reports/Reports/GetUserData', {
        withCredentials: 'include',
      })
      .then((response) => {
        this.setState({ user: response.data.user });
        this.manageJwtToken();
      })
      .catch((error) => {
        this.logOut();
      });
  }

  decodeLoginSession(jwtToken) {
    var decodedToken = jwt_decode(jwtToken);
    return {
      token: jwtToken,
      email: decodedToken.email,
      name: decodedToken.name,
      lang: decodedToken.lang,
    };
  }

  saveStoredSession(loginSession) {
    localStorage.setItem('jwtToken', loginSession.token);
  }

  logOut() {
    localStorage.removeItem('jwtToken');
    window.location.href = process.env.REACT_APP_API_URL + '/SignIn/index?redirect=/webapp';
  }

  render() {
    const isLoggedIn = !!this.state.user;
    if (isLoggedIn) {
      return (
        <div>
          <Header />
          <img src={logo} alt="logo" />
          <Footer />
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

export default App;
