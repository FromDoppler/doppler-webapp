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
import { connect } from 'formik';
import Promotions from '../shared/Promotions/Promotions';

const fieldNames = {
  email: 'email',
};

/**
 *
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const ForgotPassword = ({ intl, location, dependencies: { dopplerLegacyClient } }) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [sentEmail, setSentEmail] = useState(null);

  /** Prepare empty values for all fields
   * It is required because in another way, the fields are not marked as touched.
   */
  const getFormInitialValues = () => {
    const values = Object.keys(fieldNames).reduce(
      (accumulator, currentValue) => ({ ...accumulator, [currentValue]: '' }),
      {},
    );
    if (location.state && location.state.email) {
      values[fieldNames.email] = location.state.email;
    }

    return values;
  };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await dopplerLegacyClient.sendResetPasswordEmail({
        email: values[fieldNames.email],
        captchaResponseToken: values['captchaResponseToken'],
      });

      if (result.success) {
        setSentEmail(values[fieldNames.email]);
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

  const LinkToLogin = connect(({ formik: { values: { email } } }) => {
    return <LinkCommon email={email} />;
  });

  const LinkToLoginSuccess = () => {
    return <LinkCommon email={sentEmail} />;
  };

  const LinkCommon = ({ email }) => {
    return (
      <Link
        to={{
          pathname: '/login',
          state: { email: email },
        }}
        className="forgot-link"
      >
        <span className="triangle-right" />
        {sentEmail ? _('forgot_password.back_login_after_forgot') : _('forgot_password.back_login')}
      </Link>
    );
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
        {sentEmail ? (
          <div className="forgot-message">
            <div className="form-message dp-ok-message bounceIn">
              <FormattedHTMLMessage tagName="div" id="forgot_password.confirmation_message_HTML" />
              <LinkToLoginSuccess />
            </div>
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
                  autoFocus
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
              <LinkToLogin />
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
      <Promotions type="login" disabledSitesContent />
    </main>
  );
};

export default InjectAppServices(injectIntl(ForgotPassword));
