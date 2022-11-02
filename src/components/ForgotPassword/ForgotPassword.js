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
import { getFormInitialValues } from '../../utils';
import { useGetBannerData } from '../../hooks/useGetBannerData';

const fieldNames = {
  email: 'email',
};

/**
 *
 * @param { Object } props
 * @param { import('react-intl').InjectedIntl } props.intl
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */
const ForgotPassword = ({
  location,
  dependencies: { dopplerLegacyClient, dopplerSitesClient },
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [sentEmail, setSentEmail] = useState(null);
  const bannerDataState = useGetBannerData({ dopplerSitesClient, intl, type: 'login' });

  /** Prepare empty values for all fields
   * It is required because in another way, the fields are not marked as touched.
   */
  const _getFormInitialValues = () => {
    const initialValues = getFormInitialValues(fieldNames);

    if (location.state?.email) {
      initialValues[fieldNames.email] = location.state.email;
    }

    return initialValues;
  };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    let isShowingForm = true;
    try {
      const result = await dopplerLegacyClient.sendResetPasswordEmail({
        email: values[fieldNames.email].trim(),
        captchaResponseToken: values['captchaResponseToken'],
      });

      if (result.success) {
        setSentEmail(values[fieldNames.email]);
        isShowingForm = false;
      } else {
        console.log('Unexpected error', result);
        setErrors({
          _error: <FormattedMessageMarkdown id="validation_messages.error_unexpected_MD" />,
        });
      }
    } finally {
      if (isShowingForm) {
        setSubmitting(false);
      }
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
        className={sentEmail ? 'dp-message-link' : 'forgot-link'}
      >
        {!sentEmail ? <span className="triangle-right" /> : null}
        {sentEmail ? _('forgot_password.back_login_after_forgot') : _('forgot_password.back_login')}
      </Link>
    );
  };

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
              <a target="_blank" href={_('forgot_password.url_site') + location.search}>
                Doppler
              </a>
            </h1>
            <LanguageSelector urlParameters={location.search} />
          </header>
          <h5>{_('login.forgot_password')}</h5>
          <p className="content-subtitle">{_('forgot_password.description')}</p>
          {sentEmail ? (
            <div
              className={`m-b-36 m-t-12 dp-wrap-message dp-wrap-success`}
              role="alert"
              aria-label="cancel"
            >
              <span className="dp-message-icon" />
              <div className="dp-content-message">
                <FormattedMessageMarkdown
                  tagName="div"
                  id="forgot_password.confirmation_message_MD"
                />
                <LinkToLoginSuccess />
              </div>
            </div>
          ) : (
            <FormWithCaptcha
              className="login-form"
              initialValues={_getFormInitialValues()}
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
        <Promotions {...bannerDataState} />
      </main>
    </div>
  );
};

export default InjectAppServices(ForgotPassword);
