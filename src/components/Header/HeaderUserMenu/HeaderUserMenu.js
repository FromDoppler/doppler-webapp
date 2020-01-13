import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import UpgradePlanForm from '../../UpgradePlanForm/UpgradePlanForm';
import { FormattedNumber } from 'react-intl';

const HeaderUserMenu = ({ user }) => {
  const [buyModalIsOpen, setBuyModalIsOpen] = useState(false);

  const toggleModal = (isOpen) => setBuyModalIsOpen(isOpen);
  const smsBalanceStyle = user.sms.remainingCredits < 0 ? 'dp-color-red' : '';
  const numberFormatOptions = {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  return (
    <div>
      <button className="user-menu--open">
        <span style={{ background: user.avatar.color }} className="user-avatar">
          {user.avatar.text}
        </span>
      </button>
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
            <button onClick={() => toggleModal(true)} className="user-plan">
              {user.plan.buttonText}
            </button>
          ) : (
            ''
          )}
          {!user.hasClientManager && !user.plan.buttonUrl ? (
            <button onClick={() => toggleModal(true)} className="user-plan">
              {user.plan.buttonText}
            </button>
          ) : (
            ''
          )}
        </div>
        {user.sms.description ? (
          <div className="user-plan--container">
            <div className="user-plan--type">
              <p>
                <strong className={smsBalanceStyle}>
                  US$ <FormattedNumber value={user.sms.remainingCredits} {...numberFormatOptions} />
                </strong>{' '}
                {user.sms.description}
              </p>
            </div>
            {user.sms.buttonUrl ? (
              <a className="user-plan" target="_self" href={user.sms.buttonUrl}>
                {user.sms.buttonText}
              </a>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
        <ul className="options-user">
          {user.nav.map((item, index) => (
            <li key={index}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
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

export default HeaderUserMenu;
