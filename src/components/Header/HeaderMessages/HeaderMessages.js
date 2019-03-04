import React from 'react';

const HeaderMessages = ({ alert }) => {
  return (
    <div className={'messages-container ' + alert.type}>
      <div className="wrapper">
        <p>{alert.message}</p>
        {alert.button ? (
          alert.button.url ? (
            <a
              href={alert.button.url}
              className="button button--light button--tiny"
              data-testid="linkButton"
            >
              {alert.button.text}
            </a>
          ) : (
            <button className="button button--light button--tiny" data-testid="actionButton">
              {alert.button.text}
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};

export default HeaderMessages;
