import React, { useState } from 'react';
import { useCaptcha } from '../form-helpers/captcha-utils';
import { injectIntl } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';

export const LoginErrorAccountNotValidated = injectIntl(
  InjectAppServices(
    /**
     * @param { Object } props
     * @param { string } props.email
     * @param { import('react-intl').InjectedIntl } props.intl
     * @param { import('../../services/pure-di').AppServices } props.dependencies
     */
    ({ intl, email, dependencies: { dopplerLegacyClient } }) => {
      const [resentTimes, setResentTimes] = useState(0);
      const [Captcha, verifyCaptcha] = useCaptcha();

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
        // TODO: review content
        <p>{intl.formatMessage({ id: 'signup.no_more_resend' })}</p>
      );
    },
  ),
);
