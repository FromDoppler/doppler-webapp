import React, { useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import UpgradePlanForm from '../../UpgradePlanForm/UpgradePlanForm';
import { TooltipContainer } from '../../TooltipContainer/TooltipContainer';
import { FormattedNumber, useIntl } from 'react-intl';

const HeaderUserMenu = ({ user }) => {
  const intl = useIntl();
  const [buyModalIsOpen, setBuyModalIsOpen] = useState(false);
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const toggleModal = (isOpen) => setBuyModalIsOpen(isOpen);
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
            {!user.hasClientManager && (user.plan.isSubscribers || user.plan.isMonthlyByEmail) ? (
              <>
                <p className="user-plan--monthly-text">
                  <strong>{user.plan.planName}</strong> ({user.plan.maxSubscribers}{' '}
                  {user.plan.itemDescription})
                </p>
                {user.plan.buttonUrl && !user.plan.pendingFreeUpgrade && (
                  <a className="user-plan" href={user.plan.buttonUrl}>
                    {user.plan.buttonText}
                  </a>
                )}
              </>
            ) : !user.hasClientManager ? (
              <p className="user-plan--monthly-text">{_('header.plan_prepaid')}</p>
            ) : (
              ''
            )}

            {!user.hasClientManager &&
            ((user.plan.buttonUrl && user.plan.pendingFreeUpgrade) || !user.plan.buttonUrl) ? (
              !user.isLastPlanRequested ? (
                <button onClick={() => toggleModal(true)} className="user-plan">
                  {user.plan.buttonText}
                </button>
              ) : (
                <div className="dp-request-sent">
                  <TooltipContainer
                    visible={false}
                    content={_('header.tooltip_last_plan')}
                    orientation="left"
                  >
                    <button
                      onClick={() => toggleModal(true)}
                      className="user-plan close-user--menu dp-tooltip-left"
                    >
                      {_('header.send_request')}
                      <div className="tooltiptext">{_('header.tooltip_last_plan')}</div>
                    </button>
                    <span className="ms-icon icon-info-icon"></span>
                  </TooltipContainer>
                </div>
              )
            ) : (
              ''
            )}

            {user.hasClientManager && user.clientManager.profileName ? (
              <p className="user-plan--monthly-text">
                <strong>{_('header.profile')}</strong> {user.clientManager.profileName}
              </p>
            ) : (
              ''
            )}

            {user.hasClientManager && !user.clientManager.profileName ? (
              <>
                <p className="user-plan--monthly-text">{_('header.send_mails')}</p>
                <p className="user-plan-enabled">{_('header.enabled')}</p>
              </>
            ) : (
              ''
            )}
          </div>
          {!user.hasClientManager ? (
            <>
              <div className="user-plan--type">
                {user.plan.planType === 'monthly-deliveries' ||
                user.plan.planType === 'suscribers' ? (
                  <div className="user-plan--buyContainer">
                    <p>
                      {user.plan.maxSubscribers - user.plan.remainingCredits}{' '}
                      {_(
                        `header.plan_${
                          user.plan.planType === 'suscribers' ? 'suscribers' : 'emails'
                        }`,
                      )}{' '}
                      (<strong>{user.plan.remainingCredits}</strong> {_('header.availables')})
                    </p>
                  </div>
                ) : (
                  <div className="user-plan--buyContainer">
                    <p>
                      <strong>{user.plan.remainingCredits}</strong> {user.plan.description}
                    </p>
                  </div>
                )}
                {Object.keys(user.sms).length ? (
                  <div className="user-plan--buyContainer">
                    <p>
                      <strong>
                        US${' '}
                        <FormattedNumber
                          value={user.sms.remainingCredits}
                          {...numberFormatOptions}
                        />
                      </strong>{' '}
                      {user.sms.description}
                    </p>
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
              </div>
            </>
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
