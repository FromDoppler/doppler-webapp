import React from 'react';

class HeaderUserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  render() {
    const user = this.props.user;
    return (
      <div>
        <span id="user-menu--open" onClick={this.toggleMenu}>
          <span style={{ background: user.avatar.color }} className="user-avatar">
            {user.avatar.text}
          </span>
        </span>
        <div className={this.state.isMenuOpen ? 'user-menu open' : 'user-menu'}>
          <header>
            <span className="user-avatar--menu" style={{ background: user.avatar.color }}>
              {user.avatar.text}
            </span>
            <p>
              <span className="name">{user.fullname}</span>
              <span className="email">{user.email}</span>
            </p>
          </header>
          <div className="user-plan--container">
            <div className="user-plan--type">
              {user.plan.isSubscribers === 'true' || user.plan.isMonthlyByEmail === 'true' ? (
                <p className="user-plan--monthly-text">
                  <span>{user.plan.planName}</span> |{' '}
                  <strong>
                    {user.plan.maxSubscribers} {user.plan.itemDescription}
                  </strong>
                </p>
              ) : (
                ''
              )}
              <p>
                <strong>{user.plan.remainingCredits}</strong>
                {user.plan.description}
              </p>
            </div>
            {user.clientManager &&
            user.plan.buttonUrl &&
            user.plan.pendingFreeUpgrade !== 'true' ? (
              <a className="buy-plan" href={user.plan.buttonUrl}>
                {user.plan.buttonText}
              </a>
            ) : (
              ''
            )}
            {!user.clientManager &&
            user.plan.buttonUrl &&
            user.plan.pendingFreeUpgrade !== 'true' ? (
              <button className="buy-plan">{user.plan.buttonText}</button>
            ) : (
              ''
            )}
            {!user.clientManager && !user.plan.buttonUrl ? (
              <button className="buy-plan">{user.plan.buttonText}</button>
            ) : (
              ''
            )}
          </div>
          <ul className="options-user">
            {user.nav.map((item, index) => (
              <li key={index}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default HeaderUserMenu;
