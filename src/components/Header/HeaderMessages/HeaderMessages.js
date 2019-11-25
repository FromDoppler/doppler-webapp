import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import UpgradePlanForm from '../../UpgradePlanForm/UpgradePlanForm';

const HeaderMessages = ({ alert, user }) => {
  const [buyModalIsOpen, setBuyModalIsOpen] = useState(false);

  const toggleModal = (isOpen) => setBuyModalIsOpen(isOpen);

  return alert.button && alert.button.action && alert.button.action !== 'updatePlanPopup' ? null : (
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
            onClick={() => toggleModal(true)}
          >
            {alert.button.text}
          </button>
        ) : (
          <></>
        )}
      </div>
      <Modal className="modal" isOpen={buyModalIsOpen} handleClose={() => toggleModal(false)}>
        <UpgradePlanForm
          isSubscriber={user.plan.isSubscribers}
          handleClose={() => toggleModal(false)}
        />
      </Modal>
    </div>
  );
};

export default HeaderMessages;
