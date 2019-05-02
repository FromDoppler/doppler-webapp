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

const fieldNames = {
  user: 'user',
  password: 'password',
};

/** Prepare empty values for all fields
 * It is required because in another way, the fields are not marked as touched.
 */
const getFormInitialValues = () =>
  Object.keys(fieldNames).reduce(
    (accumulator, currentValue) => ({ ...accumulator, [currentValue]: '' }),
    {},
  );

const extractLegacyRedirectUrl = (location) => {
  const result = /[&?]redirect=(.*)$/.exec(location.search);
  return (result && result.length === 2 && result[1] + location.hash) || null;
};

const LoginErrorBlockedAccountNotPayed = () => (
  <p>
    <FormattedHTMLMessage id="login.error_payment" />
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
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await dopplerLegacyClient.login({
        username: values[fieldNames.user],
        password: values[fieldNames.password],
        captchaResponseToken: values['captchaResponseToken'],
      });

      if (result.success) {
        sessionManager.restart();
        setRedirectAfterLogin(true);
      } else if (result.expectedError && result.expectedError.blockedAccountNotPayed) {
        setErrors({ _general: <LoginErrorBlockedAccountNotPayed /> });
      } else if (result.expectedError && result.expectedError.userInactive) {
        // TODO: define how this error should be shown
        console.log('userInactive error', result);
        setErrors({ _general: 'validation_messages.error_unexpected' });
      } else if (result.expectedError && result.expectedError.accountNotValidated) {
        setErrors({ _general: <LoginErrorAccountNotValidated email={values[fieldNames.user]} /> });
      } else {
        console.log('Unexpected error', result);
        setErrors({ _general: 'validation_messages.error_unexpected' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (redirectAfterLogin) {
    const legacyRedirectUrl = extractLegacyRedirectUrl(location);
    return legacyRedirectUrl ? (
      <RedirectToLegacyUrl to={legacyRedirectUrl} />
    ) : (
      <Redirect to={(location.state && location.state.from) || { pathname: '/' }} />
    );
  }

  return (
    <main className="panel-wrapper">
      <Helmet>
        <title>{_('login.head_title')}</title>
        <meta name="description" content={_('login.head_description')} />
      </Helmet>
      <article className="main-panel">
        <header>
          <h1 className="logo-doppler-new">Doppler</h1>
          <LanguageSelector />
        </header>
        <h5>{_('login.enter_doppler')}</h5>
        <p className="content-subtitle">{_('login.enter_doppler_sub')}</p>
        <p className="content-subtitle">
          {_('login.you_want_create_account')}{' '}
          <Link to="/signup" className="link--title">
            {_('login.signup')}
          </Link>
        </p>
        <FormWithCaptcha
          className="login-form"
          initialValues={getFormInitialValues()}
          onSubmit={onSubmit}
        >
          <fieldset>
            <FieldGroup>
              <EmailFieldItem
                fieldName={fieldNames.user}
                label={_('login.label_user')}
                required
                placeholder={_('signup.placeholder_email')}
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
            <SubmitButton>{_('login.button_login')}</SubmitButton>
            <Link to="/forgot-password" className="forgot-link">
              {_('login.forgot_password')}
            </Link>
          </fieldset>
        </FormWithCaptcha>
        <footer>
          <CaptchaLegalMessage />
          <p>
            <FormattedHTMLMessage
              tagName="small"
              id="common.copyright_HTML"
              values={{ year: new Date().getFullYear() }}
            />
          </p>
        </footer>
      </article>
      <section className="feature-panel bg--login">
        <article className="feature-content">
          <h6>{_('feature_panel.forms')}</h6>
          <h1>{_('feature_panel.forms_description')}</h1>
          <p>{_('feature_panel.forms_remarks')}</p>
        </article>
      </section>
    </main>
  );
};

export default InjectAppServices(injectIntl(Login));
