import React from 'react';

import './HeaderNav.css';

const HeaderNav = (props) => {
  return (
    <nav>
      <ul>
        <li>{props.user.Email}</li>
      </ul>
    </nav>
  );
};

export default HeaderNav;
