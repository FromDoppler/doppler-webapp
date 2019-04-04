import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { timeout } from '../../utils';
import { Formik, Form } from 'formik';
import { InjectAppServices } from '../../services/pure-di';
import {
  EmailFieldItem,
  FieldGroup,
  InputFieldItem,
  CheckboxFieldItem,
  ValidatedPasswordFieldItem,
  PhoneFieldItem,
  SubmitButton,
} from '../form-helpers/form-helpers';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';

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
const Signup = function({ intl, dependencies: { dopplerLegacyClient } }) {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const onSubmit = async (values, { setSubmitting }) => {
    // TODO: implement it
    await timeout(1500);
    setSubmitting(false);
  };

  return (
    <main className="panel-wrapper">
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
        <Formik initialValues={getFormInitialValues()} onSubmit={onSubmit}>
          <Form className="signup-form">
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
              <SubmitButton>{_('signup.button_signup')}</SubmitButton>
            </fieldset>
          </Form>
        </Formik>
        <div className="content-legal">
          <FormattedHTMLMessage id="signup.legal_HTML" />
        </div>
        <p className="content-promotion">
          {' '}
          {_('signup.promotion_code_reminder')}{' '}
          <a
            href={_('signup.promotion_code_help_url')}
            className="link-green uppercase"
            target="_blank"
            rel="noopener noreferrer"
          >
            {_('common.help')}
          </a>
        </p>
        <footer>
          <small>{_('signup.copyright', { year: 2019 })}</small>
        </footer>
      </article>
      <section className="feature-panel">
        <article className="feature-content">
          <h6>{_('feature_panel.email_editor')}</h6>
          <h3>{_('feature_panel.email_editor_description')}</h3>
          <p>{_('feature_panel.email_editor_remarks')}</p>
        </article>
      </section>
    </main>
  );
};

export default InjectAppServices(injectIntl(Signup));
