import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

export const ConfirmationContent = function ({
  contentActivation,
  registeredUser,
  incrementAndResend,
  mailtoSupport,
  resentTimes,
}) {
  const intl = useIntl();

  useEffect(() => {
    const resendEmailButton = document.querySelector('button#resend-email');
    if (resendEmailButton) {
      resendEmailButton.addEventListener('click', incrementAndResend, false);

      if (resentTimes !== 0) {
        const resendEmailText = document.querySelector('p#resend-email-p');
        if (resendEmailText) {
          resendEmailText.innerHTML = `
          <div class="dp-wrap-message dp-wrap-warning">
              <span class="dp-message-icon"></span>
              <div class="dp-content-message">
                <p>
                  ${intl.formatMessage({ id: 'signup.no_more_resend_MD' }) + ' '}
                  <a href=${mailtoSupport} class="dp-message-link">
                    ${intl.formatMessage({ id: 'signup.no_more_resend_MD_link' })}
                  </a>
                </p>
              </div>
            </div>
          `;
        }
      }
    }
    return () => {
      if (resendEmailButton) {
        resendEmailButton.removeEventListener('click', incrementAndResend, false);
      }
    };
  }, [incrementAndResend, intl, mailtoSupport, resentTimes]);

  const template = contentActivation.replace('{{useremail}}', registeredUser);

  return <div data-testid="dinamic-content" dangerouslySetInnerHTML={{ __html: template }} />;
};
