import React from 'react';

const HeaderUserMenu = (props) => {
  const user = props.user;
  return (
    <div>
      <div>
        <span style={{ background: user.avatar.color }}>{user.avatar.text}</span>
        <div>
          <span>{user.fullname}</span>
          <span>{user.email}</span>
        </div>
      </div>
      <div>
        <div>
          {user.plan.isSubscribers === 'true' || user.plan.isMonthlyByEmail === 'true' ? (
            <p>
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
        {user.clientManager && user.plan.buttonUrl && user.plan.pendingFreeUpgrade !== 'true' ? (
          <a href={user.plan.buttonUrl}>{user.plan.buttonText}</a>
        ) : (
          ''
        )}
        {!user.clientManager && user.plan.buttonUrl && user.plan.pendingFreeUpgrade !== 'true' ? (
          <button>{user.plan.buttonText}</button>
        ) : (
          ''
        )}
        {!user.clientManager && !user.plan.buttonUrl ? <button>{user.plan.buttonText}</button> : ''}
        <ul>
          {user.nav.map((item, index) => (
            <li key={index}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HeaderUserMenu;
