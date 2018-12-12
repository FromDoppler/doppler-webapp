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
    fetch('http://localhost:52191/Reports/Reports/GetUserData', {
      mode: 'cors',
      credentials: 'include',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ data: data.user });
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
