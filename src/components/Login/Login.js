import React from 'react';
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

class Login extends React.Component {
  constructor({ intl }) {
    super();

    this.state = {
      redirectAfterLogin: false,
    };

    this.intl = intl;
    this._ = this._.bind(this);
    this.validate = this.validate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  _ = (id, values) => this.intl.formatMessage({ id: id }, values);

  validate = (values) => {
    const errors = {};

    if (!values[fieldNames.user]) {
      errors[fieldNames.user] = this._('validation_messages.error_required_field');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[fieldNames.user])) {
      // TODO: review if this is our desired validation
      errors[fieldNames.user] = this._('validation_messages.error_invalid_email_address');
    }

    if (!values[fieldNames.password]) {
      // TODO: I think that password validation has a different format
      errors[fieldNames.password] = this._('validation_messages.error_required_field');
    } else {
      // TODO: validate password
    }

    return errors;
  };

  onSubmit = async (values, { setSubmitting }) => {
    // TODO: implement login submit
    await timeout(1500);
    setSubmitting(false);

    this.setState({ redirectAfterLogin: true });
  };

  render() {
    //TODO Add Doppler app redirect
    const { from } = this.props.location.state
      ? this.props.location.state
      : { from: { pathname: '/' } };

    const { redirectAfterLogin } = this.state;

    if (redirectAfterLogin) {
      return <Redirect to={from} />;
    }

    return (
      <main className="panel-wrapper">
        <article className="main-panel">
          <header>
            <h1 className="logo-doppler-new">Doppler</h1>
            <div className="language-selector">
              {this.intl.locale === 'es' ? (
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
          <h5>{this._('login.enter_doppler')}</h5>
          <p className="content-subtitle">{this._('login.enter_doppler_sub')}</p>
          <p className="content-subtitle">
            {this._('login.you_want_create_account')}{' '}
            <Link to="/signup" className="link-green uppercase">
              {this._('login.signup')}
            </Link>
          </p>
          <Formik
            initialValues={getFormInitialValues()}
            validate={this.validate}
            onSubmit={this.onSubmit}
          >
            <Form className="login-form">
              <fieldset>
                <FieldGroup>
                  <InputFieldItem
                    fieldName={fieldNames.user}
                    label={this._('login.label_user')}
                    type="email"
                    placeholder={this._('signup.placeholder_email')}
                  />
                  <PasswordFieldItem
                    fieldName={fieldNames.password}
                    label={this._('signup.label_password')}
                    placeholder={this._('signup.placeholder_password')}
                  />
                </FieldGroup>
              </fieldset>
              <fieldset>
                <button
                  type="submit"
                  className="dp-button button--round button-medium primary-green"
                >
                  {this._('login.button_login')}
                </button>
                {/*
                // TODO: implement forgot password
                */}
              </fieldset>
            </Form>
          </Formik>
          <footer>
            <small>{this._('signup.copyright', { year: 2019 })}</small>
          </footer>
        </article>
        <section className="feature-panel">
          <article className="feature-content">
            <h6>{this._('feature_panel.email_editor')}</h6>
            <h3>{this._('feature_panel.email_editor_description')}</h3>
            <p>{this._('feature_panel.email_editor_remarks')}</p>
          </article>
        </section>
      </main>
    );
  }
}

export default injectIntl(Login);
