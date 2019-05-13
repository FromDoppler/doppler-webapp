import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import {
  EmailFieldItem,
  FieldGroup,
  SubmitButton,
  FormErrors,
  CaptchaLegalMessage,
  FormWithCaptcha,
} from '../form-helpers/form-helpers';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';
import { InjectAppServices } from '../../services/pure-di';
import './ForgotPassword.css';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Helmet } from 'react-helmet';

const fieldNames = {
  email: 'email',
};

/** Prepare empty values for all fields
 * It is required because in another way, the fields are not marked as touched.
 */
const getFormInitialValues = () =>
  Object.keys(fieldNames).reduce(
    (accumulator, currentValue) => ({ ...accumulator, [currentValue]: '' }),
    {},
  );

/**
 *
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const ForgotPassword = ({ intl, dependencies: { dopplerLegacyClient } }) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [sentTimes, setSentTimes] = useState(0);

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await dopplerLegacyClient.sendResetPasswordEmail({
        email: values[fieldNames.email],
        captchaResponseToken: values['captchaResponseToken'],
      });

      if (result.success) {
        setSentTimes((x) => x + 1);
      } else {
        console.log('Unexpected error', result);
        setErrors({
          _general: <FormattedHTMLMessage id="validation_messages.error_unexpected_HTML" />,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="panel-wrapper">
      <Helmet>
        <title>{_('login.head_title')}</title>
        <meta name="description" content={_('login.head_description')} />
      </Helmet>
      <article className="main-panel">
        <header>
          <h1 className="logo-doppler-new">
            <a target="_blank" href={_('forgot_password.url_site')} rel="noopener noreferrer">
              Doppler
            </a>
          </h1>
          <LanguageSelector />
        </header>
        <h5>{_('login.forgot_password')}</h5>
        <p className="content-subtitle">{_('forgot_password.description')}</p>
        {sentTimes > 0 ? (
          <div className="forgot-message bounceIn">
            <FormattedHTMLMessage tagName="div" id="forgot_password.confirmation_message_HTML" />
            <Link to="/login" className="forgot-link">
              <span className="triangle-right" />
              {_('forgot_password.back_login_after_forgot')}
            </Link>
          </div>
        ) : (
          <FormWithCaptcha
            className="login-form"
            initialValues={getFormInitialValues()}
            onSubmit={onSubmit}
          >
            <fieldset>
              <FieldGroup>
                <EmailFieldItem
                  fieldName={fieldNames.email}
                  label={_('signup.label_email')}
                  required
                  placeholder={_('forgot_password.placeholder_email')}
                />
              </FieldGroup>
            </fieldset>
            <fieldset>
              <FormErrors />
              <SubmitButton className="button--round">
                {_('forgot_password.button_request')}
              </SubmitButton>
              <Link to="/login" className="forgot-link">
                <span className="triangle-right" />
                {_('forgot_password.back_login')}
              </Link>
            </fieldset>
          </FormWithCaptcha>
        )}
        <footer>
          <CaptchaLegalMessage />
          <p>
            <FormattedMessageMarkdown
              container="small"
              id="forgot_password.copyright_MD"
              options={{ linkTarget: '_blank' }}
            />
          </p>
        </footer>
      </article>
      <section className="feature-panel bg--forgot">
        <article className="feature-content">
          <h6>{_('feature_panel.forms')}</h6>
          <h1>{_('feature_panel.forms_description')}</h1>
          <p>{_('feature_panel.forms_remarks')}</p>
        </article>
        <figure class="content-img">
          <img src={_('forgot_password.image_path')} alt="Forms" />
        </figure>
      </section>
    </main>
  );
};

export default InjectAppServices(injectIntl(ForgotPassword));
