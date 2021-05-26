import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';
import {
  EmailFieldItem,
  FieldGroup,
  FormWithCaptcha,
  InputFieldItem,
  CheckboxFieldItem,
  ValidatedPasswordFieldItem,
  PhoneFieldItem,
  SubmitButton,
  FormMessages,
} from '../form-helpers/form-helpers';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import Promotions from '../shared/Promotions/Promotions';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
import { extractParameter, isWhitelisted, addLogEntry } from './../../utils';
import * as S from './Signup.styles';
import useZohoScript from '../../hooks/useZohoScript';

export const scriptUrl = 'https://crm.zoho.com/crm/javascript/zcga.js';

const fieldNames = {
  firstname: 'firstname',
  lastname: 'lastname',
  phone: 'phone',
  email: 'email',
  password: 'password',
  accept_privacy_policies: 'accept_privacy_policies',
  accept_promotions: 'accept_promotions',
};

const minLength = {
  min: 2,
  errorMessageKey: 'validation_messages.error_min_length_2',
};

/** Extract the page parameter from url*/
function extractPage(location) {
  return extractParameter(location, queryString.parse, 'page', 'Page');
}

function extractRedirect(location) {
  return extractParameter(location, queryString.parse, 'redirect');
}

function getParameter(location, parameter) {
  return extractParameter(location, queryString.parse, parameter);
}

function getSource(location) {
  let utmSource = getParameter(location, 'utm_source');
  if (!utmSource) {
    utmSource = document.referrer || 'direct';
  }
  return utmSource;
}

/** Prepare empty values for all fields
 * It is required because in another way, the fields are not marked as touched.
 */
const getFormInitialValues = () =>
  Object.keys(fieldNames).reduce(
    (accumulator, currentValue) => ({ ...accumulator, [currentValue]: '' }),
    {},
  );

/**
 * Signup Page
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const Signup = function ({
  location,
  dependencies: { dopplerLegacyClient, originResolver, localStorage, utmCookiesManager },
}) {
  useZohoScript({ scriptUrl });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const [registeredUser, setRegisteredUser] = useState(null);
  const [alreadyExistentAddresses, setAlreadyExistentAddresses] = useState([]);
  const [blockedDomains, setBlockedDomains] = useState([]);

  const utmSource = getSource(location);
  const utmCampaign = getParameter(location, 'utm_campaign');
  const utmMedium = getParameter(location, 'utm_medium');
  const utmTerm = getParameter(location, 'utm_term');
  const gclid = getParameter(location, 'gclid');

  utmCookiesManager.setCookieEntry({
    storage: localStorage,
    UTMSource: utmSource,
    UTMCampaign: utmCampaign,
    UTMMedium: utmMedium,
    UTMTerm: utmTerm,
    gclid,
  });
  const utmCookies = utmCookiesManager.getUtmCookie(localStorage);

  const addExistentEmailAddress = (email) => {
    setAlreadyExistentAddresses((x) => [...x, email]);
  };

  const extractDomain = (email) => {
    const regexResult = /.+@(.+)/.exec(email);
    return (regexResult && regexResult.length === 2 && regexResult[1]) || null;
  };

  const addBlockedDomain = (domain) => {
    setBlockedDomains((x) => [...x, domain]);
  };

  if (registeredUser) {
    const resend = (captchaResponseToken) =>
      dopplerLegacyClient.resendRegistrationEmail({
        email: registeredUser,
        captchaResponseToken: captchaResponseToken,
      });
    return (
      <Redirect
        to={{
          pathname: '/signup/confirmation',
          status: { resend: resend },
          search: location.search,
        }}
      />
    );
  }

  const validate = (values) => {
    const errors = {};

    const email = values[fieldNames.email];
    const domain = email && extractDomain(email);
    const checkbox = values[fieldNames.accept_privacy_policies];

    if (email && alreadyExistentAddresses.includes(email)) {
      errors[fieldNames.email] = 'validation_messages.error_email_already_exists';
    } else if (domain && blockedDomains.includes(domain)) {
      errors[fieldNames.email] = 'validation_messages.error_invalid_domain_to_register_account';
    } else if (!checkbox) {
      errors[fieldNames.accept_privacy_policies] = 'validation_messages.error_checkbox_policy';
    }

    return errors;
  };

  const onSubmit = async (values, { setSubmitting, setErrors, validateForm }) => {
    var redirectUrl = extractRedirect(location);

    const result = await dopplerLegacyClient.registerUser({
      ...values,
      language: intl.locale,
      firstOrigin: originResolver.getFirstOrigin(),
      origin: originResolver.getCurrentOrigin(),
      redirect: !!redirectUrl && isWhitelisted(redirectUrl) ? redirectUrl : '',
      utm_source: utmSource,
      utm_campaign: utmCampaign,
      utm_medium: utmMedium,
      utm_term: utmTerm,
      utm_cookies: utmCookies,
      gclid,
    });
    if (result.success) {
      setRegisteredUser(values[fieldNames.email]);
    } else if (result.expectedError && result.expectedError.emailAlreadyExists) {
      addExistentEmailAddress(values[fieldNames.email]);
      validateForm();
      setSubmitting(false);
    } else if (result.expectedError && result.expectedError.blockedDomain) {
      const domain = extractDomain(values[fieldNames.email]);
      addBlockedDomain(domain);
      validateForm();
      setSubmitting(false);
    } else if (result.expectedError && result.expectedError.registerDenied) {
      setErrors({ _error: 'validation_messages.error_register_denied' });
      setSubmitting(false);
    } else if (result.expectedError && result.expectedError.invalidDomain) {
      setErrors({ _error: 'validation_messages.error_invalid_domain' });
      setSubmitting(false);
    } else if (result.expectedError && result.expectedError.confirmationSendFail) {
      setErrors({ _error: 'validation_messages.error_invalid_domain' });
      setSubmitting(false);
      addLogEntry({
        account: values[fieldNames.email],
        origin: window.location.origin,
        section: 'Signup',
        browser: window.navigator.userAgent,
        message: 'Confirmation email send failed',
      });
    } else {
      console.log('Unexpected error', result);
      setErrors({
        _error: (
          <FormattedMessageMarkdown
            id="validation_messages.error_unexpected_register_MD"
            linkTarget={'_blank'}
          />
        ),
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="dp-app-container">
      <main className="panel-wrapper">
        <Helmet>
          <title>{_('signup.head_title')}</title>
          <meta name="description" content={_('signup.head_description')} />
        </Helmet>
        <S.MainPanel className="main-panel">
          <header>
            <h1 className="logo-doppler-new">
              <a target="_blank" href={_('signup.url_site')} rel="noopener noreferrer">
                Doppler
              </a>
            </h1>
            <LanguageSelector urlParameters={location.search} />
          </header>
          <h5>{_('signup.sign_up')}</h5>
          <p className="content-subtitle">
            {_('signup.sign_up_sub')} {_('signup.do_you_already_have_an_account')}{' '}
            <Link to={{ pathname: '/login', search: location.search }} className="link--title">
              {_('signup.log_in')}
            </Link>
          </p>
          <FormWithCaptcha
            className="signup-form"
            initialValues={getFormInitialValues()}
            onSubmit={onSubmit}
            validate={validate}
          >
            <fieldset>
              <FieldGroup>
                <InputFieldItem
                  autoFocus
                  className="field-item--50"
                  fieldName={fieldNames.firstname}
                  label={_('signup.label_firstname')}
                  type="text"
                  minLength={minLength}
                  required
                  withNameValidation
                />
                <InputFieldItem
                  className="field-item--50"
                  fieldName={fieldNames.lastname}
                  label={_('signup.label_lastname')}
                  type="text"
                  minLength={minLength}
                  required
                  withNameValidation
                />
                <PhoneFieldItem
                  fieldName={fieldNames.phone}
                  label={_('signup.label_phone')}
                  placeholder={_('signup.placeholder_phone')}
                  required
                />
              </FieldGroup>
            </fieldset>
            <fieldset>
              <FieldGroup>
                <EmailFieldItem
                  fieldName={fieldNames.email}
                  label={_('signup.label_email')}
                  placeholder={_('signup.placeholder_email')}
                  required
                />
                <ValidatedPasswordFieldItem
                  fieldName={fieldNames.password}
                  label={_('signup.label_password')}
                  placeholder={_('signup.placeholder_password')}
                />
              </FieldGroup>
            </fieldset>
            <fieldset>
              <FieldGroup>
                <CheckboxFieldItem
                  fieldName={fieldNames.accept_privacy_policies}
                  className={'label--policy'}
                  label={
                    <FormattedMessageMarkdown
                      linkTarget={'_blank'}
                      id="signup.privacy_policy_consent_MD"
                    />
                  }
                  checkRequired
                />
                <CheckboxFieldItem
                  fieldName={fieldNames.accept_promotions}
                  label={_('signup.promotions_consent')}
                />
              </FieldGroup>
            </fieldset>
            <FormMessages />
            <SubmitButton className="button--round">{_('signup.button_signup')}</SubmitButton>
          </FormWithCaptcha>
          <div className="content-legal">
            <FormattedMessageMarkdown linkTarget={'_blank'} id="signup.legal_MD" />
          </div>
          <footer>
            <small>
              <FormattedMessageMarkdown id="signup.copyright_MD" linkTarget={'_blank'} />
            </small>
          </footer>
        </S.MainPanel>
        <Promotions type="signup" page={extractPage(location)} />
      </main>
    </div>
  );
};

export default InjectAppServices(Signup);
