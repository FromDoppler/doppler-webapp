import React from 'react';

const HeaderNav = (props) => {
  const navItems = props.nav;
  return (
    <nav>
      <ul>
        {navItems.map((item, index) => (
          <li key={index}>
            <a className={item.isSelected ? 'active' : ''} href={item.url}>
              {item.title}
            </a>
            {item.subNav ? (
              <ul>
                {item.subNav.map((itemSubNav, index) => (
                  <li key={index}>
                    <a className={itemSubNav.isSelected ? 'active' : ''} href={itemSubNav.url}>
                      {itemSubNav.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HeaderNav;
