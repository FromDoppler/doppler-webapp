import React from 'react';

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
