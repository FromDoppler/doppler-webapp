import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Navigate, useLocation } from 'react-router-dom';
import { InjectAppServices } from '../../services/pure-di';
import { ConfirmationContent } from './ConfirmationContent';

/**
 * Signup Confirmation Page
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { Function } props.resend - Function to resend registration email.
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const SignupConfirmation = function ({
  dependencies: { captchaUtilsService, dopplerLegacyClient },
}) {
  const location = useLocation();
  const registeredUser = location.state?.registeredUser;
  const contentActivation = location.state?.contentActivation;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [resentTimes, setResentTimes] = useState(0);
  const [Captcha, verifyCaptcha] = captchaUtilsService.useCaptcha();

  if (!registeredUser) {
    return <Navigate to="/signup" />;
  }

  const incrementAndResend = async () => {
    const resend = (captchaResponseToken) =>
      dopplerLegacyClient.resendRegistrationEmail({
        email: registeredUser,
        captchaResponseToken,
      });

    const captchaResult = await verifyCaptcha();
    if (captchaResult.success) {
      setResentTimes((times) => times + 1);
      resend(captchaResult.captchaResponseToken);
    } else {
      console.log(captchaResult);
    }
  };
  return (
    <div className="dp-app-container">
      <main className="confirmation-main">
        <header className="confirmation-header">
          <h1 className="logo-doppler-new">
            <a target="_blank" href={_('signup.url_site')} rel="noopener noreferrer">
              Doppler
            </a>
          </h1>
        </header>
        <ConfirmationContent contentActivation={contentActivation} />
        {resentTimes === 0 ? (
          <>
            <Captcha />
            <p>
              {_('signup.email_not_received')}
              {'. '}
              <button type="button" className="dp-button link-green" onClick={incrementAndResend}>
                <FormattedMessage
                  id={'signup.resend_email'}
                  values={{
                    underline: (chunks) => <u>{chunks}</u>,
                  }}
                />
              </button>
              .
            </p>
          </>
        ) : (
          <FormattedMessageMarkdown id="signup.no_more_resend_MD" />
        )}
        <footer className="confirmation-footer">
          <small>
            <FormattedMessageMarkdown id="signup.copyright_MD" linkTarget={'_blank'} />
          </small>
        </footer>
      </main>
    </div>
  );
};

export default InjectAppServices(SignupConfirmation);
