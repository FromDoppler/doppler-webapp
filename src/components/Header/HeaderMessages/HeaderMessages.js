import React from 'react';

const HeaderMessages = ({ alert: { type, message, button } }) => {
  return (
    <div className={'messages-container ' + type}>
      <div className="wrapper">
        <p>{message}</p>
        {button ? (
          button.url ? (
            <a
              href={button.url}
              className="button button--light button--tiny"
              data-testid="linkButton"
            >
              {button.text}
            </a>
          ) : (
            <button className="button button--light button--tiny" data-testid="actionButton">
              {button.text}
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};

export default HeaderMessages;
