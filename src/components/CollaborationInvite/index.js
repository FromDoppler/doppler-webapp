import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import { extractParameter, getFormInitialValues } from '../../utils';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';
import {
  CheckboxFieldItemAccessible,
  FieldGroup,
  FormMessages,
  FormWithCaptcha,
  InputFieldItemAccessible,
  PhoneFieldItemAccessible,
  SubmitButton,
  ValidatedPasswordFieldItem,
} from '../form-helpers/form-helpers';
import { ScrollToFieldError } from '../shared/ScrollToFieldError';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import Promotions from '../shared/Promotions/Promotions';
import { useQueryParams } from '../../hooks/useQueryParams';
import { useGetBannerData } from '../../hooks/useGetBannerData';
import jwtDecode from 'jwt-decode';
import { UnexpectedError } from '../shared/UnexpectedError';

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

const mapInvitationErrors = (error) => {
  switch (error) {
    case 'Wrong link':
      return 'validation_messages.error_wrong_invitation_link';
    case 'Expired link':
      return 'validation_messages.error_expired_invitation_link';
    default:
      return 'common.something_wrong';
  }
};

export const CollaboratorsInvite = InjectAppServices(
  ({ dependencies: { dopplerLegacyClient, dopplerSitesClient } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [inviteStatus, setInviteStatus] = useState({});

    const query = useQueryParams();
    const page = query.get('page') || query.get('Page');
    const bannerDataState = useGetBannerData({ dopplerSitesClient, type: 'signup', page });

    const sendInvitationData = useCallback(
      async (model) => {
        const token = extractParameter(location, queryString.parse, 'token', 'Token');
        const result = await dopplerLegacyClient.confirmCollaborationinvite(token, model);
        if (result.success && result.message === 'success') {
          navigate('dashboard');
        }
        setInviteStatus({ success: result.success, message: mapInvitationErrors(result.message) });
      },
      [navigate, location, dopplerLegacyClient],
    );

    useEffect(() => {
      const fetchData = async () => {
        if (!location.search.includes('token')) {
          navigate('/login');
        }
        const token = extractParameter(location, queryString.parse, 'token', 'Token');
        try {
          setEmail(jwtDecode(token).Email);
        } catch {}

        sendInvitationData(null);

        setLoading(false);
      };

      fetchData();
      // eslint-disable-next-line
    }, []);

    const validate = (values) => {
      const errors = {};
      if (!values[fieldNames.accept_privacy_policies]) {
        errors[fieldNames.accept_privacy_policies] = 'validation_messages.error_checkbox_policy';
      }
      return errors;
    };

    const onSubmit = async (values, { setSubmitting, setErrors }) => {
      values[fieldNames.email] = email;
      values['language'] = intl.locale;
      const result = sendInvitationData(values);

      setErrors({ _error: mapInvitationErrors(result.message) });
      setSubmitting(false);
    };

    if (loading) {
      return <Loading page />;
    }

    return (
      <div className="dp-app-container">
        <main className="panel-wrapper">
          <Helmet>
            <title>{_('signup.head_title')}</title>
            <meta name="description" content={_('signup.head_description')} />
          </Helmet>
          <article className="main-panel">
            <header>
              <h1 className="logo-doppler-new">
                <a target="_blank" href={_('signup.url_site') + location.search}>
                  Doppler
                </a>
              </h1>
              <LanguageSelector urlParameters={location.search} />
            </header>
            <h5>{_('signup.invitation_signup_title')}</h5>
            <p id="content-subtitle" className="content-subtitle m-t-24">
              <FormattedMessage id={`signup.sign_up_sub`} />
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
                  <InputFieldItemAccessible
                    fieldName={fieldNames.email}
                    label={_('signup.label_email')}
                    withSubmitCount={false}
                    value={email}
                    disabled={true}
                    type="text"
                  ></InputFieldItemAccessible>
                  <InputFieldItemAccessible
                    autoFocus
                    className="field-item--50"
                    fieldName={fieldNames.firstname}
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
                    fieldName={fieldNames.lastname}
                    label={_('signup.label_lastname')}
                    placeholder={_('signup.placeholder_last_name')}
                    type="text"
                    minLength={minLength}
                    required
                    withNameValidation
                    withSubmitCount={false}
                  />
                </FieldGroup>
              </fieldset>
              <fieldset>
                <FieldGroup>
                  <PhoneFieldItemAccessible
                    fieldName={fieldNames.phone}
                    label={_('signup.label_phone')}
                    placeholder={_('signup.placeholder_phone')}
                    required="validation_messages.error_phone_required"
                    withSubmitCount={false}
                  />
                  <ValidatedPasswordFieldItem
                    fieldName={fieldNames.password}
                    label={_('signup.label_password')}
                    placeholder={_('signup.placeholder_password')}
                    required
                  />
                </FieldGroup>
              </fieldset>
              <fieldset>
                <FieldGroup className="dp-items-accept">
                  <CheckboxFieldItemAccessible
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
                  <CheckboxFieldItemAccessible
                    fieldName={fieldNames.accept_promotions}
                    label={_('signup.promotions_consent')}
                  />
                </FieldGroup>
              </fieldset>
              <FormMessages />
              {!inviteStatus.success ? (
                <div className="m-b-12">
                  <UnexpectedError msgId={inviteStatus.message} className={'m-b-12'} />
                </div>
              ) : (
                <></>
              )}
              <SubmitButton className="button--round" disabled={!inviteStatus.success}>
                {_('common.accept')}
              </SubmitButton>
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
          </article>
          <Promotions {...bannerDataState} />
        </main>
      </div>
    );
  },
);
