import React from 'react';

class HeaderNav extends React.Component {
  constructor(props) {
    super(props);

    this.hoverMenu = this.hoverMenu.bind(this);
  }

  hoverMenu(hasSubNav) {
    if (Array.isArray(hasSubNav) && hasSubNav.length) {
      this.props.toggleHeaderOpen(true);
    } else {
      this.props.toggleHeaderOpen(false);
    }
  }

  render() {
    const navItems = this.props.nav;
    return (
      <nav className="nav-left-main">
        <div className="menu-main--container">
          <ul className="menu-main">
            {navItems.map((item, index) => (
              <li
                className="submenu-item"
                key={index}
                onMouseEnter={this.hoverMenu.bind(this, item.subNav)}
                onMouseLeave={this.hoverMenu.bind(this)}
              >
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
  }
}

export default HeaderNav;
