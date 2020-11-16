import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';

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
        <p>
          {intl.formatMessage({ id: 'signup.email_not_received' })}{' '}
          <button type="button" onClick={incrementAndResend}>
            {intl.formatMessage({ id: 'signup.resend_email' })}
          </button>
          .
        </p>
      </>
    ) : (
      <FormattedMessageMarkdown id="signup.no_more_resend_MD" />
    );
  },
);
