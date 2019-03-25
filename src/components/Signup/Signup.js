import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';

export default injectIntl(function({ intl }) {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <main className="panel-wrapper">
      <article className="main-panel">
        <header>
          <img src="img/doppler-logo.svg" className="logo-doppler" alt="Doppler" />
          <small className="content-signin">
            {_('signup.do_you_already_have_an_account')}{' '}
            <Link to="/login" className="link-green uppercase">
              {_('signup.log_in')}
            </Link>
          </small>
        </header>
        <h5>{_('signup.sign_up')}</h5>
        <p className="content-subtitle">{_('signup.sign_up_sub')}</p>
            <form className="signup-form">
              <fieldset>
                <ul className="field-group">
                  <li className="field-item field-item--50">
                    <label htmlFor="name">{_('signup.label_firstname')}</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder={_('signup.placeholder_firstname')}
                    />
                  </li>
                  <li className="field-item field-item--50">
                    <label htmlFor="lastname">{_('signup.label_lastname')}</label>
                    <input
                      type="text"
                      name="lastname"
                      id="lastname"
                      placeholder={_('signup.placeholder_lastname')}
                    />
                  </li>
                  <li className="field-item error">
                    <label htmlFor="phone">{_('signup.label_phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder={_('signup.placeholder_phone')}
                    />
                  </li>
                </ul>
              </fieldset>
              <fieldset>
                <ul className="field-group">
                  <li className="field-item error">
                    <label htmlFor="email">{_('signup.label_email')}</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder={_('signup.placeholder_email')}
                    />
                  </li>
                  <li className="field-item">
                    <label htmlFor="password">{_('signup.label_password')}</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder={_('signup.placeholder_password')}
                    />
                  </li>
                </ul>
              </fieldset>
              <fieldset>
                <ul className="field-group">
                  <li className="field-item field-item__checkbox error">
                    <input type="checkbox" name="accept_privacy_policies" />
                    <span className="checkmark" />
                    <label htmlFor="accept_privacy_policy">
                      {' '}
                      <FormattedHTMLMessage id="signup.privacy_policy_consent_HTML" />
                    </label>
                  </li>
                  <li className="field-item field-item__checkbox">
                    <input type="checkbox" name="accept_promotions" />
                    <span className="checkmark" />
                    <label htmlFor="accept_promotions">{_('signup.promotions_consent')}</label>
                  </li>
                </ul>
                <button type="button" className="dp-button button--round button-medium primary-green">
                  {_('signup.button_signup')}
                </button>
              </fieldset>
            </form>
        <div className="content-legal">
          <FormattedHTMLMessage id="signup.legal_HTML" />
        </div>
        <p className="content-promotion">
          {' '}
          {_('signup.promotion_code_reminder')}{' '}
          <a
            href={_('signup.promotion_code_help_url')}
            className="link-green uppercase"
            target="_blank"
            rel="noopener noreferrer"
          >
            {_('common.help')}
          </a>
        </p>
        <footer>
          <small>{_('signup.copyright', { year: 2019 })}</small>
        </footer>
      </article>
      <section className="feature-panel">
        <article className="feature-content">
          <h6>{_('feature_panel.email_editor')}</h6>
          <h3>{_('feature_panel.email_editor_description')}</h3>
          <p>{_('feature_panel.email_editor_remarks')}</p>
        </article>
      </section>
    </main>
  );
});
