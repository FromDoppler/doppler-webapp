import React from 'react';
import Modal from '../../../components/Modal/Modal';
import UpgradePlanForm from '../../UpgradePlanForm/UpgradePlanForm';

class HeaderMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buyModalIsOpen: false,
    };

    this.handleOpenBuyModal = () => this.setState({ buyModalIsOpen: true });
    this.handleCloseBuyModal = () => this.setState({ buyModalIsOpen: false });
  }

  render() {
    const alert = this.props.alert;
    const user = this.props.user;
    //TODO implement max subscribers modal
    if (alert.button && alert.button.action && alert.button.action !== 'updatePlanPopup') {
      return <></>;
    } else {
      return (
        <div className={'messages-container ' + alert.type}>
          <div className="wrapper">
            <p>{alert.message}</p>
            {alert.button && alert.button.url ? (
              <a
                href={alert.button.url}
                className="button button--light button--tiny"
                data-testid="linkButton"
              >
                {alert.button.text}
              </a>
            ) : alert.button ? (
              <button
                className="button button--light button--tiny"
                data-testid="actionButton"
                onClick={this.handleOpenBuyModal}
              >
                {alert.button.text}
              </button>
            ) : null}
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
}

export default HeaderMessages;
