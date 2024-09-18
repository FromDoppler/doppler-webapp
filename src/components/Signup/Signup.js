import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useIntl, FormattedMessage } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';
import {
  FieldGroup,
  FormWithCaptcha,
  ValidatedPasswordFieldItem,
  SubmitButton,
  FormMessages,
  CheckboxFieldItemAccessible,
  InputFieldItemAccessible,
  EmailFieldItemAccessible,
  PhoneFieldItemAccessible,
  PasswordFieldItem,
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
import { useFingerPrinting } from '../../hooks/useFingerPrinting';
import Modal from '../Modal/Modal';

const minLength = {
  min: 2,
  errorMessageKey: 'validation_messages.error_min_length_2',
};

const CollaboratorFormFieldNames = {
  email: 'email',
  password: 'password',
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
  const { fingerPrintingId } = useFingerPrinting();

  const [alreadyExistentAddresses, setAlreadyExistentAddresses] = useState([]);
  const [blockedDomains, setBlockedDomains] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState(false);
  const [fieldNames, setFieldNames] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    accept_privacy_policies: '',
    accept_promotions: '',
  });

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

  const validateCollaboratorEmail = async (email) => {
    const errors = {};
    if (email !== currentEmail) {
      setCurrentEmail(email);
      const response = await dopplerLegacyClient.verifyUserAccountExistens(email);

      if (response.success) {
        if (response.associatedAsAccountOwner) {
          return (errors['email'] = 'validation_messages.error_email_already_exists');
        } else if (response.associatedAsAccountCollaborator) {
          setShowModal(true);
        }
      }
    }
    return (errors['email'] = '');
  };
  const validate = (values) => {
    const errors = {};

    const email = values['email'];
    const domain = email && extractDomain(email);
    const checkbox = values['accept_privacy_policies'];

    if (email && alreadyExistentAddresses.includes(email)) {
      errors['email'] = 'validation_messages.error_email_already_exists';
    } else if (domain && blockedDomains.includes(domain)) {
      errors['email'] = 'validation_messages.error_invalid_domain_to_register_account';
    } else if (!checkbox) {
      errors['accept_privacy_policies'] = 'validation_messages.error_checkbox_policy';
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
      email: values['email'].trim(),
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
      fingerprint: fingerPrintingId,
    });
    if (result.success) {
      if (result.value && result.value.verificationCode) {
        window.location.href = `${process.env.REACT_APP_DOPPLER_LEGACY_URL}/Registration/CompleteRegistry/CompleteUserInfo/${result.value.verificationCode}`;
      } else {
        const hasQueryParams = location.search.length > 0;
        const registeredUser = values[fieldNames.email].trim();
        navigate(`/signup/confirmation${hasQueryParams ? location.search : ''}`, {
          state: {
            registeredUser,
            contentActivation: bannerDataState.bannerData.contentActivation,
          },
        });
      }
    } else if (result.expectedError && result.expectedError.emailAlreadyExists) {
      addExistentEmailAddress(values['email']);
      validateForm();
      setSubmitting(false);
    } else if (result.expectedError && result.expectedError.blockedDomain) {
      const domain = extractDomain(values['email']);
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
        account: values['email'],
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
    <>
      {showModal ? (
        <Modal
          isOpen={true}
          type="large"
          handleClose={() => {
            setCurrentEmail(null);
            setFieldNames({ ...fieldNames, email: ' ' });
            setShowModal(false);
          }}
        >
          <h2>{_('login.collaborator_login_title')}</h2>
          <p>{_('login.collaborator_login_description')}</p>
          <FormWithCaptcha
            className="login-form"
            initialValues={getCollaboratorFormInitialValues()}
            onSubmit={onSubmitCollaboratorForm}
            enableReinitialize={true}
          >
            <div className="dp-rowflex">
              <fieldset className="col-sm-9 col-md-9 col-lg-9">
                <FieldGroup>
                  <EmailFieldItemAccessible
                    autoFocus
                    fieldName={CollaboratorFormFieldNames.email}
                    label={_('login.label_user')}
                    disabled={true}
                    placeholder={_('login.placeholder_email')}
                  />
                  <PasswordFieldItem
                    fieldName={CollaboratorFormFieldNames.password}
                    label={_('signup.label_password')}
                    placeholder={_('login.placeholder_password')}
                    required
                  />
                </FieldGroup>
              </fieldset>
              <fieldset>
                <hr className="m-b-12" />
                <FormMessages />
                <div className="dp-rowflex">
                  <div className="col-sm-8 col-md-8 col-lg-10"></div>
                  <SubmitButton className="col-sm-4 col-md-4 col-lg-2">
                    {_('common.accept')}
                  </SubmitButton>
                </div>
              </fieldset>
            </div>
          </FormWithCaptcha>
        </Modal>
      ) : null}
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
            <p id="content-subtitle" className="content-subtitle">
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
              initialValues={fieldNames}
              onSubmit={onSubmit}
              validate={validate}
              enableReinitialize={true}
            >
              <ScrollToFieldError fieldsOrder={Object.keys(fieldNames)} />
              <fieldset>
                <FieldGroup>
                  <EmailFieldItemAccessible
                    fieldName="email"
                    label={_('signup.label_email')}
                    placeholder={_('signup.placeholder_email')}
                    required="validation_messages.error_invalid_email_address"
                    withSubmitCount={false}
                    validateCollaboratorEmail={validateCollaboratorEmail}
                  />
                  <li>
                    <FieldGroup>
                      <InputFieldItemAccessible
                        autoFocus
                        className="field-item--50"
                        fieldName="firstname"
                        label={_('signup.label_firstname')}
                        placeholder={_('signup.placeholder_first_name')}
                        type="text"
                        minLength={minLength}
                        required
                        withNameValidation
                        withSubmitCount={false}
                      />
                      <InputFieldItemAccessible
                        className="field-item--50"
                        fieldName="lastname"
                        label={_('signup.label_lastname')}
                        placeholder={_('signup.placeholder_last_name')}
                        type="text"
                        minLength={minLength}
                        required
                        withNameValidation
                        withSubmitCount={false}
                      />
                    </FieldGroup>
                  </li>
                </FieldGroup>
              </fieldset>
              <fieldset>
                <FieldGroup>
                  <PhoneFieldItemAccessible
                    fieldName="phone"
                    label={_('signup.label_phone')}
                    placeholder={_('signup.placeholder_phone')}
                    required="validation_messages.error_phone_required"
                    withSubmitCount={false}
                  />
                  <ValidatedPasswordFieldItem
                    fieldName="password"
                    label={_('signup.label_password')}
                    placeholder={_('signup.placeholder_password')}
                    required
                    disabled={disablePassword}
                  />
                </FieldGroup>
              </fieldset>
              <fieldset>
                <FieldGroup className="dp-items-accept">
                  <CheckboxFieldItemAccessible
                    fieldName="accept_privacy_policies"
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
                  <CheckboxFieldItemAccessible
                    fieldName="accept_promotions"
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
    </>
  );
};

export default InjectAppServices(Signup);
