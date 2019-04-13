import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { timeout } from '../../utils';
import { Formik, Form } from 'formik';
import {
  FieldGroup,
  InputFieldItem,
  CheckboxFieldItem,
  ValidatedPasswordFieldItem,
  PhoneFieldItem,
} from '../form-helpers/form-helpers';
import { validateEmail, validateRequiredField, validatePassword } from '../../validations';
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

export default injectIntl(function({ intl }) {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const validate = (values) => {
    const errors = {};
    if (!values[fieldNames.firstname]) {
      errors[fieldNames.firstname] = 'validation_messages.error_required_field';
    }

    if (!values[fieldNames.lastname]) {
      errors[fieldNames.lastname] = 'validation_messages.error_required_field';
    }

    if (!values[fieldNames.phone]) {
      errors[fieldNames.phone] = 'validation_messages.error_required_field';
    }

    const emailMsgError =
      validateRequiredField(values[fieldNames.email]) || validateEmail(values[fieldNames.email]);
    if (emailMsgError) {
      errors[fieldNames.email] = emailMsgError;
    }

    const passwordMsgError = validatePassword(values[fieldNames.password]);
    if (passwordMsgError) {
      errors[fieldNames.password] = passwordMsgError;
    }

    if (!values[fieldNames.accept_privacy_policies]) {
      // TODO: show the right message
      errors[fieldNames.accept_privacy_policies] = 'validation_messages.error_required_field';
    }

    return errors;
  };

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
        <Formik initialValues={getFormInitialValues()} validate={validate} onSubmit={onSubmit}>
          <Form className="signup-form">
            <fieldset>
              <FieldGroup>
                <InputFieldItem
                  className="field-item--50"
                  fieldName={fieldNames.firstname}
                  label={_('signup.label_firstname')}
                  type="text"
                  placeholder={_('signup.placeholder_firstname')}
                />
                <InputFieldItem
                  className="field-item--50"
                  fieldName={fieldNames.lastname}
                  label={_('signup.label_lastname')}
                  type="text"
                  placeholder={_('signup.placeholder_lastname')}
                />
                <PhoneFieldItem
                  fieldName={fieldNames.phone}
                  label={_('signup.label_phone')}
                  placeholder={_('signup.placeholder_phone')}
                />
              </FieldGroup>
            </fieldset>
            <fieldset>
              <FieldGroup>
                <InputFieldItem
                  fieldName={fieldNames.email}
                  label={_('signup.label_email')}
                  type="email"
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
                />
                <CheckboxFieldItem
                  fieldName={fieldNames.accept_promotions}
                  label={_('signup.promotions_consent')}
                />
              </FieldGroup>
              <button type="submit" className="dp-button button--round button-medium primary-green">
                {_('signup.button_signup')}
              </button>
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
});
