import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Redirect } from 'react-router-dom';
import * as S from './SignupConfirmation.styles';
import { InjectAppServices } from '../../services/pure-di';

/**
 * Signup Confirmation Page
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { Function } props.resend - Function to resend registration email.
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const SignupConfirmation = function ({ location, dependencies: { captchaUtilsService } }) {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [resentTimes, setResentTimes] = useState(0);
  const [Captcha, verifyCaptcha] = captchaUtilsService.useCaptcha();

  if (!location.status || !location.status.resend) {
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
    <div className="dp-app-container">
      <S.MainContainer className="confirmation-wrapper">
        <S.ImageBackground className="background bg-c" />
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
            <FormattedMessageMarkdown id="signup.no_more_resend_MD" />
          )}
        </main>
        <footer className="confirmation-footer">
          <small>
            <FormattedMessageMarkdown id="signup.copyright_MD" linkTarget={'_blank'} />
          </small>
        </footer>
        <S.ImageBackground className="background bg-b" />
      </S.MainContainer>
    </div>
  );
};

export default InjectAppServices(SignupConfirmation);
