import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal/Modal';
import { InjectAppServices } from '../../../services/pure-di';
import UpgradePlanForm from '../../UpgradePlanForm/UpgradePlanForm';
import ValidateSubscribers from '../../ValidateSubscribers';

const HeaderMessages = ({ alert, user, closeAlert, dependencies: { dopplerLegacyClient } }) => {
  const [buyModalIsOpen, setBuyModalIsOpen] = useState(false);
  const toggleModal = (isOpen) => setBuyModalIsOpen(isOpen);
  const [nextAlert, setNextAlert] = useState(false);
  const [content, setContent] = useState(alert);

  useEffect(() => {
    nextAlert ? setContent(alert.nextAlert) : setContent(alert);
  }, [alert, nextAlert]);

  const sendAcceptButtonAction = async () => {
    await dopplerLegacyClient.sendAcceptButtonAction();
    closeAlert();
  };

  const hasModal = (state) =>
    state.button?.action === 'validateSubscribersPopup' ||
    state.button?.action === 'upgradePlanPopup';

  const setButtonOnclick = (alert) => {
    if (hasModal(alert)) {
      return () => toggleModal(true);
    }
    if (alert.button?.action === 'closeModal') {
      return sendAcceptButtonAction;
    }
  };

  return content ? (
    <>
      <div className={'messages-container sticky ' + content.type}>
        <div className="wrapper">
          <p>{content.message}</p>
          {content.button && content.button.url ? (
            <a
              href={content.button.url}
              className="button button--light button--tiny"
              data-testid="linkButton"
            >
              {content.button.text}
            </a>
          ) : content.button ? (
            <button
              className="button button--light button--tiny"
              data-testid="actionButton"
              onClick={setButtonOnclick(content)}
            >
              {content.button.text}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      {hasModal(alert) ? (
        <Modal
          isOpen={buyModalIsOpen}
          handleClose={() => toggleModal(false)}
          type={alert.button?.action === 'validateSubscribersPopup' ? 'large' : 'medium'}
        >
          {alert.button?.action === 'validateSubscribersPopup' ? (
            <ValidateSubscribers
              handleClose={() => toggleModal(false)}
              setNextAlert={() => setNextAlert(true)}
            />
          ) : (
            <UpgradePlanForm
              isSubscriber={user.plan.isSubscribers}
              handleClose={() => toggleModal(false)}
            />
          )}
        </Modal>
      ) : (
        <></>
      )}
    </>
  ) : (
    <></>
  );
};

export default InjectAppServices(HeaderMessages);
