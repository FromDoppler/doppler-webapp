import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { timeout } from '../../utils';
import { Formik, Form, Field } from 'formik';

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
      errors[fieldNames.firstname] = _('validation_messages.error_required_field');
    }

    if (!values[fieldNames.lastname]) {
      errors[fieldNames.lastname] = _('validation_messages.error_required_field');
    }

    if (!values[fieldNames.phone]) {
      errors[fieldNames.phone] = _('validation_messages.error_required_field');
    } else {
      // TODO: validate phone
    }

    if (!values[fieldNames.email]) {
      errors[fieldNames.email] = _('validation_messages.error_required_field');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[fieldNames.email])) {
      // TODO: review if this is our desired validation
      errors[fieldNames.email] = _('validation_messages.error_invalid_email_address');
    }

    if (!values[fieldNames.password]) {
      // TODO: I think that password validation has a different format
      errors[fieldNames.password] = _('validation_messages.error_required_field');
    } else {
      // TODO: validate password
    }

    if (!values[fieldNames.accept_privacy_policies]) {
      // TODO: show the right message
      errors[fieldNames.accept_privacy_policies] = _('validation_messages.error_required_field');
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
          <img src="img/doppler-logo.svg" className="logo-doppler" alt="Doppler" />
          <small className="content-signin">
            {_('signup.do_you_already_have_an_account')}{' '}
            <Link to="/login" className="link-green uppercase">
              {_('signup.log_in')}
            </Link>
          </small>
        </header>
        <h5>{_('signup.sign_up')}</h5>
        <p className="content-subtitle">{_('signup.sign_up_sub')}</p>
        <Formik initialValues={getFormInitialValues()} validate={validate} onSubmit={onSubmit}>
          {({ errors, touched }) => (
            <Form className="signup-form">
              <fieldset>
                <ul className="field-group">
                  <li
                    className={
                      'field-item field-item--50' +
                      (touched[fieldNames.firstname] && errors[fieldNames.firstname]
                        ? ' error'
                        : '')
                    }
                  >
                    <label htmlFor={fieldNames.firstname}>{_('signup.label_firstname')}</label>
                    <Field
                      type="text"
                      name={fieldNames.firstname}
                      id={fieldNames.firstname}
                      placeholder={_('signup.placeholder_firstname')}
                    />
                    {touched[fieldNames.firstname] && errors[fieldNames.firstname] ? (
                      <div className="wrapper-errors">
                        <p className="error-message">{errors[fieldNames.firstname]}</p>
                      </div>
                    ) : null}
                  </li>

                  <li
                    className={
                      'field-item field-item--50' +
                      (touched[fieldNames.lastname] && errors[fieldNames.lastname] ? ' error' : '')
                    }
                  >
                    <label htmlFor={fieldNames.lastname}>{_('signup.label_lastname')}</label>
                    <Field
                      type="text"
                      name={fieldNames.lastname}
                      id={fieldNames.lastname}
                      placeholder={_('signup.placeholder_lastname')}
                    />
                    {touched[fieldNames.lastname] && errors[fieldNames.lastname] ? (
                      <div className="wrapper-errors">
                        <p className="error-message">{errors[fieldNames.lastname]}</p>
                      </div>
                    ) : null}
                  </li>
                  <li
                    className={
                      'field-item' +
                      (touched[fieldNames.phone] && errors[fieldNames.phone] ? ' error' : '')
                    }
                  >
                    <label htmlFor={fieldNames.phone}>{_('signup.label_phone')}</label>
                    <Field
                      type="tel"
                      name={fieldNames.phone}
                      id={fieldNames.phone}
                      placeholder={_('signup.placeholder_phone')}
                    />
                    {touched[fieldNames.phone] && errors[fieldNames.phone] ? (
                      <div className="wrapper-errors">
                        <p className="error-message">{errors[fieldNames.phone]}</p>
                      </div>
                    ) : null}
                  </li>
                </ul>
              </fieldset>
              <fieldset>
                <ul className="field-group">
                  <li
                    className={
                      'field-item' +
                      (touched[fieldNames.email] && errors[fieldNames.email] ? ' error' : '')
                    }
                  >
                    <label htmlFor={fieldNames.email}>{_('signup.label_email')}</label>
                    <Field
                      type="email"
                      name={fieldNames.email}
                      id={fieldNames.email}
                      placeholder={_('signup.placeholder_email')}
                    />
                    {touched[fieldNames.email] && errors[fieldNames.email] ? (
                      <div className="wrapper-errors">
                        <p className="error-message">{errors[fieldNames.email]}</p>
                      </div>
                    ) : null}
                  </li>
                  <li
                    className={
                      'field-item' +
                      (touched[fieldNames.password] && errors[fieldNames.password] ? ' error' : '')
                    }
                  >
                    <label htmlFor={fieldNames.password}>{_('signup.label_password')}</label>
                    <Field
                      type="password"
                      name={fieldNames.password}
                      id={fieldNames.password}
                      placeholder={_('signup.placeholder_password')}
                    />
                    {touched[fieldNames.password] && errors[fieldNames.password] ? (
                      <div className="wrapper-errors">
                        <p className="error-message">{errors[fieldNames.password]}</p>
                      </div>
                    ) : null}
                  </li>
                </ul>
              </fieldset>
              <fieldset>
                <ul className="field-group">
                  <li
                    className={
                      'field-item field-item__checkbox' +
                      (touched[fieldNames.accept_privacy_policies] &&
                      errors[fieldNames.accept_privacy_policies]
                        ? ' error'
                        : '')
                    }
                  >
                    <Field
                      type="checkbox"
                      name={fieldNames.accept_privacy_policies}
                      id={fieldNames.accept_privacy_policies}
                    />
                    <span className="checkmark" />
                    <label htmlFor={fieldNames.accept_privacy_policies}>
                      {' '}
                      <FormattedHTMLMessage id="signup.privacy_policy_consent_HTML" />
                    </label>
                    {touched[fieldNames.password] && errors[fieldNames.accept_privacy_policies] ? (
                      <div className="wrapper-errors">
                        <p className="error-message">
                          {errors[fieldNames.accept_privacy_policies]}
                        </p>
                      </div>
                    ) : null}
                  </li>
                  <li className="field-item field-item__checkbox">
                    <Field
                      type="checkbox"
                      name={fieldNames.accept_promotions}
                      id={fieldNames.accept_promotions}
                    />
                    <span className="checkmark" />
                    <label htmlFor={fieldNames.accept_promotions}>
                      {_('signup.promotions_consent')}
                    </label>
                  </li>
                </ul>
                <button
                  type="submit"
                  className="dp-button button--round button-medium primary-green"
                >
                  {_('signup.button_signup')}
                </button>
              </fieldset>
            </Form>
          )}
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
