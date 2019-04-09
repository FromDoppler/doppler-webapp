import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { timeout } from '../../utils';
import { Formik, Form } from 'formik';
import { FieldGroup, InputFieldItem, PasswordFieldItem } from '../form-helpers/form-helpers';

const fieldNames = {
  user: 'user',
  password: 'password',
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
 * Login Page
 * @param { Object } props - props
 * @param { import('react-intl').InjectedIntl } props.intl - intl
 * @param { import('history').Location } props.location - location
 */
const Login = ({ intl, location }) => {
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(false);
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const validate = (values) => {
    const errors = {};

    if (!values[fieldNames.user]) {
      errors[fieldNames.user] = _('validation_messages.error_required_field');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[fieldNames.user])) {
      // TODO: review if this is our desired validation
      errors[fieldNames.user] = _('validation_messages.error_invalid_email_address');
    }

    if (!values[fieldNames.password]) {
      // TODO: I think that password validation has a different format
      errors[fieldNames.password] = _('validation_messages.error_required_field');
    } else {
      // TODO: validate password
    }

    return errors;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    // TODO: implement login submit
    await timeout(1500);
    setSubmitting(false);
    setRedirectAfterLogin(true);
  };

  if (redirectAfterLogin) {
    //TODO: Also allow redirect to doppler legacy URLs
    const from = (location.state && location.state.from) || { pathname: '/' };
    return <Redirect to={from} />;
  }

  return (
    <main className="panel-wrapper">
      <article className="main-panel">
        <header>
          <h1 className="logo-doppler-new">Doppler</h1>
          <div className="language-selector">
            {intl.locale === 'es' ? (
              <div className="option" id="spanish-selector">
                <span>
                  <strong>ES</strong>
                </span>
                <Link to="?lang=en" className="option--item">
                  EN
                </Link>
              </div>
            ) : (
              <div className="option" id="spanish-selector">
                <span>
                  <strong>EN</strong>
                </span>
                <Link to="?lang=es" className="option--item">
                  ES
                </Link>
              </div>
            )}
          </div>
        </header>
        <h5>{_('login.enter_doppler')}</h5>
        <p className="content-subtitle">{_('login.enter_doppler_sub')}</p>
        <p className="content-subtitle">
          {_('login.you_want_create_account')}{' '}
          <Link to="/signup" className="uppercase">
            {_('login.signup')}
          </Link>
        </p>
        <Formik initialValues={getFormInitialValues()} validate={validate} onSubmit={onSubmit}>
          <Form className="login-form">
            <fieldset>
              <FieldGroup>
                <InputFieldItem
                  fieldName={fieldNames.user}
                  label={_('login.label_user')}
                  type="email"
                  placeholder={_('signup.placeholder_email')}
                />
                <PasswordFieldItem
                  fieldName={fieldNames.password}
                  label={_('signup.label_password')}
                  placeholder={_('signup.placeholder_password')}
                />
              </FieldGroup>
            </fieldset>
            <fieldset>
              <button type="submit" className="dp-button button--round button-medium primary-green">
                {_('login.button_login')}
              </button>
              {/*
                // TODO: implement forgot password
                */}
            </fieldset>
          </Form>
        </Formik>
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

export default injectIntl(Login);
