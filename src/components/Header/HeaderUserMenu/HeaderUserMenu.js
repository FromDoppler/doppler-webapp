import React from 'react';
import Modal from '../../../components/Modal/Modal';
import UpgradePlanForm from '../../UpgradePlanForm/UpgradePlanForm';

class HeaderUserMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buyModalIsOpen: false,
    };

    this.handleOpenBuyModal = () => this.setState({ buyModalIsOpen: true });
    this.handleCloseBuyModal = () => this.setState({ buyModalIsOpen: false });
  }

  render() {
    const user = this.props.user;
    return (
      <div>
        <span className="user-menu--open">
          <span style={{ background: user.avatar.color }} className="user-avatar">
            {user.avatar.text}
          </span>
        </span>
        <div className="user-menu">
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
              {user.plan.isSubscribers || user.plan.isMonthlyByEmail ? (
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
                <strong>{user.plan.remainingCredits}</strong> {user.plan.description}
              </p>
            </div>
            {!user.hasClientManager && user.plan.buttonUrl && !user.plan.pendingFreeUpgrade ? (
              <a className="user-plan" href={user.plan.buttonUrl}>
                {user.plan.buttonText}
              </a>
            ) : (
              ''
            )}
            {!user.hasClientManager && user.plan.buttonUrl && user.plan.pendingFreeUpgrade ? (
              <button onClick={this.handleOpenBuyModal} className="user-plan">
                {user.plan.buttonText}
              </button>
            ) : (
              ''
            )}
            {!user.hasClientManager && !user.plan.buttonUrl ? (
              <button onClick={this.handleOpenBuyModal} className="user-plan">
                {user.plan.buttonText}
              </button>
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
        <Modal
          className="modal"
          isOpen={this.state.buyModalIsOpen}
          handleClose={this.handleCloseBuyModal}
        >
          <UpgradePlanForm
            isSubscriber={user.plan.isSubscribers}
            handleClose={this.handleCloseBuyModal}
          />
        </Modal>
      </div>
    );
  }
}

export default HeaderUserMenu;
