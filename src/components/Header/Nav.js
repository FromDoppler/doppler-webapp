import React, { Component } from 'react';

import './Nav.css';

export default class HeaderNav extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
    };
  }

  componentWillMount() {
    fetch(process.env.REACT_APP_API_URL + '/Reports/Reports/GetUserData', {
      mode: 'cors',
      credentials: 'include',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ data: data.user });
      })
      .catch((error) => {
        window.location.href = process.env.REACT_APP_API_URL + '/SignIn/index';
      });
  }

  render() {
    return (
      <nav>
        <ul>
          <li>{this.state.data.Email}</li>
        </ul>
      </nav>
    );
  }
}
