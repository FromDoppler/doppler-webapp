import React, { useState } from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';

/**
 * Signup Confirmation Page
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { Function } props.resend - Function to resend registration email.
 */
const SignupConfirmation = function({ resend, intl }) {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [resentTimes, setResentTimes] = useState(0);
  const incrementAndResend = function() {
    setResentTimes((times) => times + 1);
    resend();
  };
  return (
    <main className="confirmation-wrapper">
      <div className="background bg-c" />
      <header className="confirmation-header">
        <h1 className="logo-doppler-new">Doppler</h1>
      </header>
      <main className="confirmation-main">
        <article className="confirmation-article">
          <h1>{_('signup.thanks_for_registering')}</h1>
          <p>{_('signup.check_inbox')}</p>
          <span className="icon-registration m-bottom--lv6">
            {_('signup.check_inbox_icon_description')}
          </span>
          <p className="text-italic">{_('signup.activate_account_instructions')}</p>
        </article>
        {resentTimes === 0 ? (
          <p>
            {_('signup.email_not_received')}{' '}
            <button className="link-green" onClick={incrementAndResend}>
              {_('signup.resend_email')}
            </button>
            .
          </p>
        ) : (
          // TODO: review content
          <p>{_('signup.no_more_resend')}</p>
        )}
      </main>
      <footer className="confirmation-footer">
        <p>
          <FormattedHTMLMessage tagName="small" id="common.recaptcha_legal_HTML" />
        </p>
        <p>
          <FormattedHTMLMessage
            tagName="small"
            id="common.copyright_HTML"
            values={{ year: new Date().getFullYear() }}
          />
        </p>
      </footer>
      <div className="background bg-b" />
    </main>
  );
};

export default injectIntl(SignupConfirmation);
