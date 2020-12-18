import React, { useState, useMemo, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';
import {
  EmailFieldItem,
  FieldGroup,
  PasswordFieldItem,
  SubmitButton,
  FormWithCaptcha,
  FormMessages,
  CaptchaLegalMessage,
} from '../form-helpers/form-helpers';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';
import SafeRedirect from '../SafeRedirect';
import { InjectAppServices } from '../../services/pure-di';
import { LoginErrorAccountNotValidated } from './LoginErrorAccountNotValidated';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { connect } from 'formik';
import Promotions from '../shared/Promotions/Promotions';
import queryString from 'query-string';
import {
  addLogEntry,
  extractParameter,
  isZohoChatOnline,
  openZohoChatWithMessage,
} from '../../utils';

const fieldNames = {
  user: 'user',
  password: 'password',
};

function extractPageFromRedirect(location) {
  const redirectParameter = extractParameter(location, queryString.parse, 'redirect');
  return /doppleracademy/.exec(redirectParameter) ? 'doppler-academy' : null;
}

/** Extract the page parameter from url*/
function extractPage(location) {
  return (
    extractParameter(location, queryString.parse, 'page', 'Page') ||
    extractPageFromRedirect(location)
  );
}

const extractLegacyRedirectUrl = (location) => {
  const result = /[&?]redirect=(.*)$/.exec(location.search);
  return (result && result.length === 2 && result[1] + location.hash) || null;
};

function getForgotErrorMessage(location) {
  let parsedQuery = location && location.search && queryString.parse(location.search);
  parsedQuery = (parsedQuery && parsedQuery['message']) || null;
  switch (parsedQuery) {
    case 'ExpiredLink':
      return { _warning: 'forgot_password.expired_link' };
    case 'ExpiredData':
      return { _warning: 'forgot_password.expired_data' };
    case 'PassResetOk':
      return { _success: 'forgot_password.pass_reset_ok' };
    case 'BlockedAccount':
      return { _error: <FormattedMessageMarkdown id="forgot_password.blocked_account_MD" /> };
    case 'MaxAttemptsSecQuestion':
      return { _error: 'forgot_password.max_attempts_sec_question' };
    default:
      return null;
  }
}

const isActivactionInProgress = (location) => {
  let params = location && location.search && location.search.replace(/%20/g, '');
  let parsedQuery = queryString.parse(params);
  parsedQuery = (parsedQuery && parsedQuery['activationInProgress']) || null;
  return parsedQuery && parsedQuery === 'true';
};

const LoginErrorBasedOnCustomerSupport = ({ messages }) => {
  return (
    <>
      <p>
        <FormattedMessage id={messages.msgReasonId} />
      </p>
      {isZohoChatOnline() ? (
        <p>
          <FormattedMessage
            id={'validation_messages.error_account_contact_zoho_chat'}
            values={{
              button: (chunk) => (
                <button type="button" onClick={() => openZohoChatWithMessage(messages.msgZohoChat)}>
                  {chunk}
                </button>
              ),
            }}
          />
        </p>
      ) : (
        <FormattedMessageMarkdown id={messages.msgEmailContact} />
      )}
    </>
  );
};

/**
 * Login Page
 * @param { Object } props - props
 * @param { import('react-intl').InjectedIntl } props.intl - intl
 * @param { import('history').Location } props.location - location
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const Login = ({ location, dependencies: { dopplerLegacyClient, sessionManager, window } }) => {
  const intl = useIntl();
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

  const formMessage = useMemo(() => getForgotErrorMessage(location), [location]);

  useEffect(() => {
    if (isActivactionInProgress(location) && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { send_to: 'AW-1065197040/ZA62CKv_gZEBEPC79vsD' });
    }
  }, [location, window]);

  const errorMessages = {
    blockedAccountNotPayed: {
      msgReasonId: 'validation_messages.error_account_is_blocked_not_pay',
      msgZohoChat: _('validation_messages.error_account_is_blocked_not_pay_zoho_chat_msg'),
      msgEmailContact: 'validation_messages.error_account_is_blocked_not_pay_contact_support_MD',
    },
    cancelatedAccountNotPayed: {
      msgReasonId: 'validation_messages.error_account_is_canceled_not_pay',
      msgZohoChat: _('validation_messages.error_account_is_canceled_not_pay_zoho_chat_msg'),
      msgEmailContact: 'validation_messages.error_account_is_canceled_not_pay_contact_support_MD',
    },
    cancelatedAccount: {
      msgReasonId: 'validation_messages.error_account_is_canceled_other_reason',
      msgZohoChat: _('validation_messages.error_account_is_canceled_other_reason_zoho_chat_msg'),
      msgEmailContact:
        'validation_messages.error_account_is_canceled_other_reason_contact_support_MD',
    },
    blockedAccountInvalidPassword: {
      msgReasonId: 'validation_messages.error_account_is_blocked_invalid_password',
      msgZohoChat: _('validation_messages.error_account_is_blocked_invalid_password_zoho_chat_msg'),
      msgEmailContact:
        'validation_messages.error_account_is_blocked_invalid_password_contact_support_MD',
    },
  };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const result = await dopplerLegacyClient.login({
        username: values[fieldNames.user].trim(),
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
        setErrors({
          _error: (
            <LoginErrorBasedOnCustomerSupport messages={errorMessages.blockedAccountNotPayed} />
          ),
        });
      } else if (result.expectedError && result.expectedError.cancelatedAccountNotPayed) {
        setErrors({
          _error: (
            <LoginErrorBasedOnCustomerSupport messages={errorMessages.cancelatedAccountNotPayed} />
          ),
        });
      } else if (result.expectedError && result.expectedError.userInactive) {
        // TODO: define how this error should be shown
        console.log('userInactive error', result);
        setErrors({
          _error: <FormattedMessageMarkdown id="validation_messages.error_unexpected_MD" />,
        });
      } else if (result.expectedError && result.expectedError.accountNotValidated) {
        setErrors({
          _warning: <LoginErrorAccountNotValidated email={values[fieldNames.user]} />,
        });
      } else if (result.expectedError && result.expectedError.cancelatedAccount) {
        setErrors({
          _error: <LoginErrorBasedOnCustomerSupport messages={errorMessages.cancelatedAccount} />,
        });
      } else if (result.expectedError && result.expectedError.blockedAccountCMDisabled) {
        setErrors({
          _error: (
            <p>
              <FormattedMessage
                id={'validation_messages.error_account_is_blocked_disabled_by_cm'}
              />
              <strong>{result.expectedError.errorMessage}</strong>
            </p>
          ),
        });
      } else if (
        result.expectedError &&
        (result.expectedError.blockedAccountInvalidPassword ||
          result.expectedError.maxLoginAttempts)
      ) {
        setErrors({
          _error: (
            <LoginErrorBasedOnCustomerSupport
              messages={errorMessages.blockedAccountInvalidPassword}
            />
          ),
        });
      } else if (result.expectedError && result.expectedError.invalidLogin) {
        setErrors({ _error: 'validation_messages.error_invalid_login' });
      } else if (result.expectedError && result.expectedError.wrongCaptcha) {
        setErrors({ _error: 'validation_messages.error_invalid_captcha' });
        addLogEntry({
          account: values[fieldNames.user],
          origin: window.location.origin,
          section: 'Login',
          browser: window.navigator.userAgent,
          error: result,
        });
        console.log('invalid captcha', result);
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

  if (redirectToUrl) {
    return <SafeRedirect to={redirectToUrl} />;
  }

  if (redirectAfterLogin) {
    const legacyRedirectUrl = extractLegacyRedirectUrl(location);
    return legacyRedirectUrl ? (
      <SafeRedirect to={legacyRedirectUrl} />
    ) : (
      <Redirect to={(location.state && location.state.from) || { pathname: '/' }} />
    );
  }

  const LinkToForgotPassword = connect(
    ({
      formik: {
        values: { user },
      },
    }) => {
      return (
        <Link
          to={{
            pathname: '/login/reset-password',
            state: { email: user },
            search: location.search,
          }}
          className="forgot-link"
        >
          {_('login.forgot_password')}
        </Link>
      );
    },
  );

  return (
    <div className="dp-app-container">
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
            <LanguageSelector urlParameters={location.search} />
          </header>
          <h5>{_('login.enter_doppler')}</h5>
          <p className="content-subtitle">{_('login.enter_doppler_sub')}</p>
          <p className="content-subtitle">
            {_('login.you_want_create_account')}{' '}
            <Link to={{ pathname: '/signup', search: location.search }}>{_('login.signup')}</Link>
          </p>
          <FormWithCaptcha
            className="login-form"
            initialValues={getFormInitialValues()}
            initialFormMessage={formMessage}
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
              <FormMessages />
              <SubmitButton className="button--round">{_('login.button_login')}</SubmitButton>
              <LinkToForgotPassword />
            </fieldset>
          </FormWithCaptcha>
          <footer>
            <CaptchaLegalMessage />
            <small>
              <FormattedMessageMarkdown id="login.copyright_MD" linkTarget={'_blank'} />
            </small>
          </footer>
        </article>
        <Promotions type="login" page={extractPage(location)} />
      </main>
    </div>
  );
};

export default InjectAppServices(Login);
