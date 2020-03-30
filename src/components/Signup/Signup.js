import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
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
import { extractParameter, isWhitelisted } from './../../utils';

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
const Signup = function({ location, dependencies: { dopplerLegacyClient, originResolver } }) {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const [registeredUser, setRegisteredUser] = useState(null);
  const [alreadyExistentAddresses, setAlreadyExistentAddresses] = useState([]);
  const [blockedDomains, setBlockedDomains] = useState([]);

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
    return <Redirect to={{ pathname: '/signup/confirmation', status: { resend: resend } }} />;
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
    try {
      var redirectUrl = extractRedirect(location);
      const result = await dopplerLegacyClient.registerUser({
        ...values,
        language: intl.locale,
        firstOrigin: originResolver.getFirstOrigin(),
        origin: originResolver.getCurrentOrigin(),
        redirect: !!redirectUrl && isWhitelisted(redirectUrl) ? redirectUrl : '',
      });
      if (result.success) {
        setRegisteredUser(values[fieldNames.email]);
      } else if (result.expectedError && result.expectedError.emailAlreadyExists) {
        addExistentEmailAddress(values[fieldNames.email]);
        validateForm();
      } else if (result.expectedError && result.expectedError.blockedDomain) {
        const domain = extractDomain(values[fieldNames.email]);
        addBlockedDomain(domain);
        validateForm();
      } else if (result.expectedError && result.expectedError.registerDenied) {
        setErrors({ _error: 'validation_messages.error_register_denied' });
      } else {
        console.log('Unexpected error', result);
        setErrors({
          _error: <FormattedMessage id="validation_messages.error_unexpected_HTML" values={{
            i: (...chunks) => (
              <i>{chunks}</i>
            ),
            br: (...chunks) => (
              <><br/><br/></>
            ),
            a: (...chunks) => (
              <a href={_('urls.mailtoSupport')}>{chunks}</a>
            )
          }} />,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="panel-wrapper">
      <Helmet>
        <title>{_('signup.head_title')}</title>
        <meta name="description" content={_('signup.head_description')} />
      </Helmet>
      <article className="main-panel">
        <header>
          <h1 className="logo-doppler-new">
            <a target="_blank" href={_('signup.url_site')} rel="noopener noreferrer">
              Doppler
            </a>
          </h1>
          <LanguageSelector />
        </header>
        <h5>{_('signup.sign_up')}</h5>
        <p className="content-subtitle">
          {_('signup.sign_up_sub')} {_('signup.do_you_already_have_an_account')}{' '}
          <Link to="/login" className="link--title">
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
                label={<FormattedMessage id="signup.privacy_policy_consent_HTML" values={{
                  a: (...chunks) => (
                    <a target="_blank" href={_('urls.urlPrivacyFromSignup_HTMLEncoded')} rel="noopener noreferrer">{chunks}</a>
                  )
                }} />}
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
          <p>
            <FormattedMessage id="signup.legal_HTML_part1" />
          </p>
          <p>
            <FormattedMessage id="signup.legal_HTML_part2"
            values={{
              strong: (...chunks) => (
                <strong>{chunks}</strong>
              )
            }}
            />
          </p>
          <p>
            <FormattedMessage id="signup.legal_HTML_part3"
            values={{
              strong: (...chunks) => (
                <strong>{chunks}</strong>
              )
            }}
            />
          </p>
          <p>
            <FormattedMessage id="signup.legal_HTML_part4"
            values={{
              strong: (...chunks) => (
                <strong>{chunks}</strong>
              )
            }}
            />
          </p>
          <p>
            <FormattedMessage id="signup.legal_HTML_part5"
            values={{
              strong: (...chunks) => (
                <strong>{chunks}</strong>
              ),
              a: (...chunks) => (
                <a target="_blank" href={_('urls.urlPrivacyFromSignup_HTMLEncoded')} rel="noopener noreferrer">{chunks}</a>
              )
            }}
            />
          </p>
        </div>
        <footer>
          <p>
            <FormattedMessageMarkdown
              container="small"
              id="signup.copyright_MD"
              options={{ linkTarget: '_blank' }}
            />
          </p>
        </footer>
      </article>
      <Promotions type="signup" page={extractPage(location)} />
    </main>
  );
};

export default InjectAppServices(Signup);
