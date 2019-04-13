import React from 'react';
import { injectIntl } from 'react-intl';

/**
 * Signup Confirmation Page
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 */
const SignupConfirmation = function({ intl }) {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <main className="confirmation-wrapper">
      <header className="confirmation-header">
        <h1 className="logo-doppler-new">Doppler</h1>
      </header>
      <main className="confirmation-main">
        <article className="confirmation-article">
          <h2>{_('signup.thanks_for_registering')}</h2>
          <p>{_('signup.check_inbox')}</p>
          <span className="icon-registration m-bottom--lv6">
            {_('signup.check_inbox_icon_description')}
          </span>
          <p className="text-italic">{_('signup.activate_account_instructions')}</p>
        </article>
        <div className="background bg-c" />
      </main>
      <footer className="confirmation-footer">
        <p>{_('signup.copyright', { year: 2019 })}</p>
        <div className="background bg-b" />
      </footer>
    </main>
  );
};

export default injectIntl(SignupConfirmation);
