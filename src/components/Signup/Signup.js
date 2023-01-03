import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useIntl, FormattedMessage } from 'react-intl';
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
import { isWhitelisted, addLogEntry, getFormInitialValues } from './../../utils';
import * as S from './Signup.styles';
import { useLinkedinInsightTag } from '../../hooks/useLinkedingInsightTag';
import { useQueryParams } from '../../hooks/useQueryParams';
import { useGetBannerData } from '../../hooks/useGetBannerData';
import { ScrollToFieldError } from '../shared/ScrollToFieldError';

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

function getReferrerHostname() {
  const referrer = document.referrer;
  try {
    return referrer && new URL(referrer).hostname;
  } catch (e) {
    // When referrer is not a valid URL
    // TODO: if it is not a valid scenario, remove error handling
    return null;
  }
}

/**
 * Signup Page
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const Signup = function ({
  location,
  dependencies: { dopplerLegacyClient, dopplerSitesClient, utmCookiesManager },
}) {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const query = useQueryParams();
  const page = query.get('page') || query.get('Page');
  const bannerDataState = useGetBannerData({ dopplerSitesClient, type: 'signup', page });
  const navigate = useNavigate();
  useLinkedinInsightTag();

  const [alreadyExistentAddresses, setAlreadyExistentAddresses] = useState([]);
  const [blockedDomains, setBlockedDomains] = useState([]);

  const utmParams = {
    UTMSource: query.get('utm_source') || getReferrerHostname() || 'direct',
    UTMCampaign: query.get('utm_campaign'),
    UTMMedium: query.get('utm_medium'),
    UTMTerm: query.get('utm_term'),
    gclid: query.get('gclid'),
    UTMContent: query.get('utm_content'),
    Origin_Inbound: query.get('origin_inbound'),
  };
  utmCookiesManager.setCookieEntry(utmParams);

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
    const redirectUrl = query.get('redirect');
    const origin = query.get('origin') ?? query.get('Origin');
    const utmCookies = utmCookiesManager.getUtmCookie() ?? [];

    const lastUTMCookieEntry = utmCookies[utmCookies.length - 1] ?? utmParams;

    const result = await dopplerLegacyClient.registerUser({
      ...values,
      email: values[fieldNames.email].trim(),
      language: intl.locale,
      origin,
      page,
      redirect: !!redirectUrl && isWhitelisted(redirectUrl) ? redirectUrl : '',
      utm_source: lastUTMCookieEntry.UTMSource,
      utm_campaign: lastUTMCookieEntry.UTMCampaign,
      utm_medium: lastUTMCookieEntry.UTMMedium,
      utm_term: lastUTMCookieEntry.UTMTerm,
      utm_cookies: utmCookies.length ? utmCookies : null,
      gclid: lastUTMCookieEntry.gclid,
      utm_content: lastUTMCookieEntry.UTMContent,
      origin_inbound: lastUTMCookieEntry.Origin_Inbound,
    });
    if (result.success) {
      const hasQueryParams = location.search.length > 0;
      const registeredUser = values[fieldNames.email].trim();

      navigate(`/signup/confirmation${hasQueryParams ? location.search : ''}`, {
        state: {
          registeredUser,
          contentActivation: bannerDataState.bannerData.contentActivation,
        },
      });
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
              <a target="_blank" href={_('signup.url_site') + location.search}>
                Doppler
              </a>
            </h1>
            <LanguageSelector urlParameters={location.search} />
          </header>
          <h5>{_('signup.sign_up')}</h5>
          <p className="content-subtitle">
            <FormattedMessage
              id={`signup.sign_up_sub`}
              values={{
                Link: (chunk) => (
                  <Link
                    to={{ pathname: '/login', search: location.search }}
                    className="link--title"
                  >
                    {chunk}
                  </Link>
                ),
                Bold: (chunk) => <strong>{chunk}</strong>,
              }}
            />
          </p>
          <FormWithCaptcha
            className="signup-form"
            initialValues={getFormInitialValues(fieldNames)}
            onSubmit={onSubmit}
            validate={validate}
          >
            <ScrollToFieldError fieldsOrder={Object.values(fieldNames)} />
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
                  withSubmitCount={false}
                />
                <InputFieldItem
                  className="field-item--50"
                  fieldName={fieldNames.lastname}
                  label={_('signup.label_lastname')}
                  type="text"
                  minLength={minLength}
                  required
                  withNameValidation
                  withSubmitCount={false}
                />
                <PhoneFieldItem
                  fieldName={fieldNames.phone}
                  label={_('signup.label_phone')}
                  placeholder={_('signup.placeholder_phone')}
                  required
                  withSubmitCount={false}
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
                  withSubmitCount={false}
                />
                <ValidatedPasswordFieldItem
                  fieldName={fieldNames.password}
                  label={_('signup.label_password')}
                  placeholder={_('signup.placeholder_password')}
                />
              </FieldGroup>
            </fieldset>
            <fieldset>
              <FieldGroup className="dp-items-accept">
                <CheckboxFieldItem
                  fieldName={fieldNames.accept_privacy_policies}
                  className={'label--policy'}
                  label={
                    <FormattedMessage
                      values={{
                        Link: (chunk) => (
                          <a href={_('signup.privacy_policy_consent_url')} target="_blank">
                            {chunk}
                          </a>
                        ),
                      }}
                      id="signup.privacy_policy_consent_MD"
                    />
                  }
                  checkRequired
                  withSubmitCount={false}
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
          <ul id="legal-accordion" className="dp-accordion content-legal">
            <li>
              <span className="dp-accordion-thumb">{_('signup.legal_tittle')}</span>
              <div className="dp-accordion-panel">
                <FormattedMessageMarkdown linkTarget={'_blank'} id="signup.legal_MD" />
              </div>
            </li>
          </ul>
          <footer>
            <small>
              <FormattedMessageMarkdown id="signup.copyright_MD" linkTarget={'_blank'} />
            </small>
          </footer>
        </S.MainPanel>
        <Promotions {...bannerDataState} />
      </main>
    </div>
  );
};

export default InjectAppServices(Signup);
