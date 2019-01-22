import React, { Component } from 'react';

import './Nav.css';

export default class HeaderNav extends Component {
  render() {
    return (
      <nav>
        <ul>
          <li>{this.props.user.Email}</li>
        </ul>
      </nav>
    );
  }
}
