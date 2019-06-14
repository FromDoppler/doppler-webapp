import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import {
  EmailFieldItem,
  FieldGroup,
  PasswordFieldItem,
  SubmitButton,
  FormWithCaptcha,
  FormErrors,
  CaptchaLegalMessage,
} from '../form-helpers/form-helpers';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';
import RedirectToLegacyUrl from '../RedirectToLegacyUrl';
import { InjectAppServices } from '../../services/pure-di';
import { LoginErrorAccountNotValidated } from './LoginErrorAccountNotValidated';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { connect } from 'formik';
import Promotions from '../shared/Promotions/Promotions';

const fieldNames = {
  user: 'user',
  password: 'password',
};

const extractLegacyRedirectUrl = (location) => {
  const result = /[&?]redirect=(.*)$/.exec(location.search);
  return (result && result.length === 2 && result[1] + location.hash) || null;
};

const LoginErrorBlockedAccountNotPayed = () => (
  <p>
    <FormattedHTMLMessage id="login.error_payment_HTML" />
  </p>
);

/**
 * Login Page
 * @param { Object } props - props
 * @param { import('react-intl').InjectedIntl } props.intl - intl
 * @param { import('history').Location } props.location - location
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const Login = ({ intl, location, dependencies: { dopplerLegacyClient, sessionManager } }) => {
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(false);
  const [redirectToUrl, setRedirectToUrl] = useState(false);
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  /** Prepare empty values for all fields
   * It is required because in another way, the fields are not marked as touched.
   */
  const getFormInitialValues = () => {
    const values = Object.keys(fieldNames).reduce(
      (accumulator, currentValue) => ({ ...accumulator, [currentValue]: '' }),
      {},
    );
    if (location.state && location.state.email) {
      values[fieldNames.user] = location.state.email;
    }

    return values;
  };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await dopplerLegacyClient.login({
        username: values[fieldNames.user],
        password: values[fieldNames.password],
        captchaResponseToken: values['captchaResponseToken'],
      });

      if (result.success) {
        sessionManager.restart();
        if (result.redirectUrl) {
          setRedirectToUrl('/' + result.redirectUrl);
        } else {
          setRedirectAfterLogin(true);
        }
      } else if (result.expectedError && result.expectedError.blockedAccountNotPayed) {
        setErrors({ _general: <LoginErrorBlockedAccountNotPayed /> });
      } else if (result.expectedError && result.expectedError.userInactive) {
        // TODO: define how this error should be shown
        console.log('userInactive error', result);
        setErrors({
          _general: <FormattedHTMLMessage id="validation_messages.error_unexpected_HTML" />,
        });
      } else if (result.expectedError && result.expectedError.accountNotValidated) {
        setErrors({
          _generalWarning: <LoginErrorAccountNotValidated email={values[fieldNames.user]} />,
        });
      } else if (result.expectedError && result.expectedError.cancelatedAccount) {
        setErrors({
          _general: (
            <FormattedHTMLMessage id="validation_messages.error_account_is_canceled_HTML" />
          ),
        });
      } else if (result.expectedError && result.expectedError.blockedAccountInvalidPassword) {
        setErrors({
          _general: (
            <FormattedHTMLMessage id="validation_messages.error_account_is_blocked_invalid_pass_HTML" />
          ),
        });
      } else if (result.expectedError && result.expectedError.invalidLogin) {
        setErrors({ _general: 'validation_messages.error_invalid_login' });
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

  if (redirectToUrl) {
    return <RedirectToLegacyUrl to={redirectToUrl} />;
  }

  if (redirectAfterLogin) {
    const legacyRedirectUrl = extractLegacyRedirectUrl(location);
    return legacyRedirectUrl ? (
      <RedirectToLegacyUrl to={legacyRedirectUrl} />
    ) : (
      <Redirect to={(location.state && location.state.from) || { pathname: '/' }} />
    );
  }

  const LinkToForgotPassword = connect(({ formik: { values: { user } } }) => {
    return (
      <Link
        to={{
          pathname: '/login/reset-password',
          state: { email: user },
        }}
        className="forgot-link"
      >
        {_('login.forgot_password')}
      </Link>
    );
  });

  return (
    <main className="panel-wrapper">
      <Helmet>
        <title>{_('login.head_title')}</title>
        <meta name="description" content={_('login.head_description')} />
      </Helmet>
      <article className="main-panel">
        <header>
          <h1 className="logo-doppler-new">
            <a target="_blank" href={_('login.url_site')} rel="noopener noreferrer">
              Doppler
            </a>
          </h1>
          <LanguageSelector />
        </header>
        <h5>{_('login.enter_doppler')}</h5>
        <p className="content-subtitle">{_('login.enter_doppler_sub')}</p>
        <p className="content-subtitle">
          {_('login.you_want_create_account')} <Link to="/signup">{_('login.signup')}</Link>
        </p>
        <FormWithCaptcha
          className="login-form"
          initialValues={getFormInitialValues()}
          onSubmit={onSubmit}
        >
          <fieldset>
            <FieldGroup>
              <EmailFieldItem
                autoFocus
                fieldName={fieldNames.user}
                label={_('login.label_user')}
                required
                placeholder={_('login.placeholder_email')}
              />
              <PasswordFieldItem
                fieldName={fieldNames.password}
                label={_('signup.label_password')}
                placeholder={_('signup.placeholder_password')}
                required
              />
            </FieldGroup>
          </fieldset>
          <fieldset>
            <FormErrors />
            <SubmitButton className="button--round">{_('login.button_login')}</SubmitButton>
            <LinkToForgotPassword />
          </fieldset>
        </FormWithCaptcha>
        <footer>
          <CaptchaLegalMessage />
          <p>
            <FormattedMessageMarkdown
              container="small"
              id="login.copyright_MD"
              options={{ linkTarget: '_blank' }}
            />
          </p>
        </footer>
      </article>
      <Promotions type="login" />
        <div
          className="feature-panel--bg"
          style={{
            backgroundImage: `url('https://cdn.fromdoppler.com/doppler-ui-library/v2.5.0/img/violet-yellow.png')`,
          }}
        >
        </div>
    </main>
  );
};

export default InjectAppServices(injectIntl(Login));
