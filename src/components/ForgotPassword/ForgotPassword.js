import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  EmailFieldItem,
  FieldGroup,
  SubmitButton,
  FormMessages,
  CaptchaLegalMessage,
  FormWithCaptcha,
} from '../form-helpers/form-helpers';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Helmet } from 'react-helmet';
import { connect } from 'formik';
import Promotions from '../shared/Promotions/Promotions';
import * as S from './ForgotPassword.styles';

const fieldNames = {
  email: 'email',
};

/**
 *
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const ForgotPassword = ({ location, dependencies: { dopplerLegacyClient } }) => {
  const intl = useIntl();
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
          _error: <FormattedMessageMarkdown id="validation_messages.error_unexpected_MD" />,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const LinkToLogin = connect(
    ({
      formik: {
        values: { email },
      },
    }) => {
      return <LinkCommon email={email} />;
    },
  );

  const LinkToLoginSuccess = () => {
    return <LinkCommon email={sentEmail} />;
  };

  const LinkCommon = ({ email }) => {
    return (
      <Link
        to={{
          pathname: '/login',
          state: { email: email },
          search: location.search,
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
          <LanguageSelector urlParameters={location.search} />
        </header>
        <h5>{_('login.forgot_password')}</h5>
        <p className="content-subtitle">{_('forgot_password.description')}</p>
        {sentEmail ? (
          <S.MessageSuccess>
            <div className="form-message dp-ok-message bounceIn">
              <FormattedMessageMarkdown
                tagName="div"
                id="forgot_password.confirmation_message_MD"
              />
              <LinkToLoginSuccess />
            </div>
          </S.MessageSuccess>
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
              <FormMessages />
              <SubmitButton className="button--round">
                {_('forgot_password.button_request')}
              </SubmitButton>
              <LinkToLogin />
            </fieldset>
          </FormWithCaptcha>
        )}
        <footer>
          <CaptchaLegalMessage />
          <small>
            <FormattedMessageMarkdown id="forgot_password.copyright_MD" linkTarget={'_blank'} />
          </small>
        </footer>
      </article>
      <Promotions type="login" />
    </main>
  );
};

export default InjectAppServices(ForgotPassword);
