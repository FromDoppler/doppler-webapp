import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
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
  FormErrors,
} from '../form-helpers/form-helpers';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';
import SignupConfirmation from './SignupConfirmation';

const fieldNames = {
  firstname: 'firstname',
  lastname: 'lastname',
  phone: 'phone',
  email: 'email',
  password: 'password',
  accept_privacy_policies: 'accept_privacy_policies',
  accept_promotions: 'accept_promotions',
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
 * Signup Page
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const Signup = function({ intl, dependencies: { dopplerLegacyClient, originResolver } }) {
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
    return <SignupConfirmation resend={resend} />;
  }

  const validate = (values) => {
    const errors = {};

    const email = values[fieldNames.email];
    const domain = email && extractDomain(email);

    if (email && alreadyExistentAddresses.includes(email)) {
      errors[fieldNames.email] = 'validation_messages.error_email_already_exists';
    } else if (domain && blockedDomains.includes(domain)) {
      errors[fieldNames.email] = 'validation_messages.error_invalid_domain_to_register_account';
    }

    return errors;
  };

  const onSubmit = async (values, { setSubmitting, setErrors, validateForm }) => {
    try {
      const result = await dopplerLegacyClient.registerUser({
        ...values,
        language: intl.locale,
        firstOrigin: originResolver.getFirstOrigin(),
        origin: originResolver.getCurrentOrigin(),
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
      } else {
        console.log('Unexpected error', result);
        setErrors({ _general: 'validation_messages.error_unexpected' });
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
          <h1 className="logo-doppler-new">Doppler</h1>
          <LanguageSelector />
        </header>
        <h5>{_('signup.sign_up')}</h5>
        <p className="content-subtitle">{_('signup.sign_up_sub')}</p>
        <p className="content-subtitle">
          {_('signup.do_you_already_have_an_account')}{' '}
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
          <FormErrors />
          <fieldset>
            <FieldGroup>
              <InputFieldItem
                className="field-item--50"
                fieldName={fieldNames.firstname}
                label={_('signup.label_firstname')}
                type="text"
                required
                placeholder={_('signup.placeholder_firstname')}
              />
              <InputFieldItem
                className="field-item--50"
                fieldName={fieldNames.lastname}
                label={_('signup.label_lastname')}
                type="text"
                required
                placeholder={_('signup.placeholder_lastname')}
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
                label={<FormattedHTMLMessage id="signup.privacy_policy_consent_HTML" />}
                checkRequired
              />
              <CheckboxFieldItem
                fieldName={fieldNames.accept_promotions}
                label={_('signup.promotions_consent')}
              />
            </FieldGroup>
          </fieldset>
          <SubmitButton>{_('signup.button_signup')}</SubmitButton>
        </FormWithCaptcha>
        <div className="content-legal">
          <FormattedHTMLMessage id="signup.legal_HTML" />
          <FormattedHTMLMessage id="signup.recaptcha_legal_HTML" />
        </div>
        <footer>
          <FormattedHTMLMessage
            tagName="small"
            id="signup.copyright_HTML"
            values={{ year: new Date().getFullYear() }}
          />
        </footer>
      </article>
      <section className="feature-panel bg--signup">
        <article className="feature-content">
          <h6>{_('feature_panel.email_automation')}</h6>
          <h1>{_('feature_panel.email_automation_description')}</h1>
          <p>{_('feature_panel.email_automation_remarks')}</p>
        </article>
      </section>
    </main>
  );
};

export default InjectAppServices(injectIntl(Signup));
