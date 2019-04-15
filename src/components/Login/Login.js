import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { timeout } from '../../utils';
import { Formik, Form } from 'formik';
import { EmailFieldItem, FieldGroup, PasswordFieldItem } from '../form-helpers/form-helpers';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';

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
          <LanguageSelector />
        </header>
        <h5>{_('login.enter_doppler')}</h5>
        <p className="content-subtitle">{_('login.enter_doppler_sub')}</p>
        <p className="content-subtitle">
          {_('login.you_want_create_account')}{' '}
          <Link to="/signup" className="link--title">
            {_('login.signup')}
          </Link>
        </p>
        <Formik initialValues={getFormInitialValues()} onSubmit={onSubmit}>
          <Form className="login-form">
            <fieldset>
              <FieldGroup>
                <EmailFieldItem
                  fieldName={fieldNames.user}
                  label={_('login.label_user')}
                  required
                  placeholder={_('signup.placeholder_email')}
                />
                <PasswordFieldItem
                  fieldName={fieldNames.password}
                  label={_('signup.label_password')}
                  placeholder={_('signup.placeholder_password')}
                  required
                />
              </FieldGroup>
            </fieldset>
            <fieldset>
              <button type="submit" className="dp-button button--round button-medium primary-green">
                {_('login.button_login')}
              </button>
              <Link to="/forgot-password" className="forgot-link">
                {_('login.forgot_password')}
              </Link>
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
