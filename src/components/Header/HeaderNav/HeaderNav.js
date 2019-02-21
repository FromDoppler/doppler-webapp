import React from 'react';

const HeaderNav = (props) => {
  const navItems = props.nav;
  return (
    <nav className="nav-left-main">
      <div className="menu-main--container">
        <ul className="menu-main">
          {navItems.map((item, index) => (
            <li className="submenu-item" key={index}>
              <a className={item.isSelected ? 'active' : ''} href={item.url}>
                {item.title}
              </a>
              {item.subNav ? (
                <ul className="sub-menu">
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
      </div>
    </nav>
  );
};

export default HeaderNav;
