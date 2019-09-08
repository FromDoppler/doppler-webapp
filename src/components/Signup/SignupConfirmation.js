import React, { useState } from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { useCaptcha } from '../form-helpers/captcha-utils';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Redirect } from 'react-router-dom';

/**
 * Signup Confirmation Page
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { Function } props.resend - Function to resend registration email.
 */
const SignupConfirmation = function({ location }) {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [resentTimes, setResentTimes] = useState(0);
  const [Captcha, verifyCaptcha] = useCaptcha();

  if (!location.state || !location.state.resend) {
    return <Redirect to="/signup" />;
  }
  const incrementAndResend = async () => {
    const captchaResult = await verifyCaptcha();
    if (captchaResult.success) {
      setResentTimes((times) => times + 1);
      location.state.resend(captchaResult.captchaResponseToken);
    } else {
      console.log(captchaResult);
    }
  };
  return (
    <main className="confirmation-wrapper">
      <div className="background bg-c" />
      <header className="confirmation-header">
        <h1 className="logo-doppler-new">
          <a target="_blank" href={_('signup.url_site')} rel="noopener noreferrer">
            Doppler
          </a>
        </h1>
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
          <>
            <Captcha />
            <p>
              {_('signup.email_not_received')}{' '}
              <button type="button" className="dp-button link-green" onClick={incrementAndResend}>
                {_('signup.resend_email')}
              </button>
              .
            </p>
          </>
        ) : (
          <FormattedHTMLMessage tagName="p" id="signup.no_more_resend_HTML" />
        )}
      </main>
      <footer className="confirmation-footer">
        <p>
          <FormattedMessageMarkdown
            container="small"
            id="signup.copyright_MD"
            options={{ linkTarget: '_blank' }}
          />
        </p>
      </footer>
      <div className="background bg-b" />
    </main>
  );
};

export default SignupConfirmation;
