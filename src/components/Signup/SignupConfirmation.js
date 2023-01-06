import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Navigate, useLocation } from 'react-router-dom';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { InjectAppServices } from '../../services/pure-di';
import { DynamicConfirmationContent } from './DynamicConfirmationContent';
import { DefaultConfirmationContent } from './DefaultConfirmationContent';

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
  const [resentTimes, setResentTimes] = useState(0);
  const [Captcha, verifyCaptcha] = captchaUtilsService.useCaptcha();
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const mailtoSupport = `mailto:soporte@fromdoppler.com`;

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
    <main className="confirmation-main">
      <header className="confirmation-header">
        <h1 className="logo-doppler-new">
          <a target="_blank" href={_('signup.url_site')} rel="noopener noreferrer">
            Doppler
          </a>
        </h1>
      </header>
      <article className="confirmation-article">
        {contentActivation ? (
          <DynamicConfirmationContent
            contentActivation={contentActivation}
            registeredUser={registeredUser}
            incrementAndResend={incrementAndResend}
            mailtoSupport={mailtoSupport}
            resentTimes={resentTimes}
          />
        ) : (
          <DefaultConfirmationContent
            incrementAndResend={incrementAndResend}
            registeredUser={registeredUser}
            resentTimes={resentTimes}
            mailtoSupport={mailtoSupport}
            Captcha={Captcha}
          />
        )}
      </article>
      <footer className="confirmation-footer">
        <small>
          <FormattedMessageMarkdown id="signup.copyright_MD" linkTarget={'_blank'} />
        </small>
      </footer>
    </main>
  );
};

export default InjectAppServices(SignupConfirmation);
