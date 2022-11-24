import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';

const mailtoSupport = `mailto:soporte@fromdoppler.com`;

export const LoginErrorAccountNotValidated = InjectAppServices(
  /**
   * @param { Object } props
   * @param { string } props.email
   * @param { import('../../services/pure-di').AppServices } props.dependencies
   */
  ({ email, dependencies: { dopplerLegacyClient, captchaUtilsService } }) => {
    const [resentTimes, setResentTimes] = useState(0);
    const [Captcha, verifyCaptcha] = captchaUtilsService.useCaptcha();
    const intl = useIntl();

    const incrementAndResend = async () => {
      const captchaResult = await verifyCaptcha();
      if (captchaResult.success) {
        setResentTimes((times) => times + 1);
        dopplerLegacyClient.resendRegistrationEmail({
          email: email,
          captchaResponseToken: captchaResult.captchaResponseToken,
        });
      } else {
        console.log('Error validating captcha for resend registration email', captchaResult);
      }
    };
    return resentTimes === 0 ? (
      <>
        <Captcha />
        <p>{intl.formatMessage({ id: 'signup.email_not_received' })}</p>
        <p>
          <button type="button" onClick={incrementAndResend} class="dp-message-link">
            <FormattedMessage
              id={'signup.resend_email'}
              values={{
                underline: (chunks) => <u>{chunks}</u>,
              }}
            />
          </button>
        </p>
      </>
    ) : (
      <>
        <p>{intl.formatMessage({ id: 'signup.no_more_resend_MD' })}</p>
        <a href={mailtoSupport} class="dp-message-link">
          {intl.formatMessage({ id: 'signup.no_more_resend_MD_link' })}
        </a>
      </>
    );
  },
);
