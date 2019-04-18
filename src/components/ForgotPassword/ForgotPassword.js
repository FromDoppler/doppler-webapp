import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { timeout } from '../../utils';
import { Formik, Form } from 'formik';
import { EmailFieldItem, FieldGroup, SubmitButton } from '../form-helpers/form-helpers';
import LanguageSelector from '../shared/LanguageSelector/LanguageSelector';

const fieldNames = {
  email: 'email',
};

/** Prepare empty values for all fields
 * It is required because in another way, the fields are not marked as touched.
 */
const getFormInitialValues = () =>
  Object.keys(fieldNames).reduce(
    (accumulator, currentValue) => ({ ...accumulator, [currentValue]: '' }),
    {},
  );

const ForgotPassword = ({ intl }) => {
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // TODO: implement forgot password submit
      const result = await timeout(1500);
      if (result && result.success) {
        // TODO: show OK message
      } else {
        console.log('Unexpected error', result);
        setErrors({ _general: 'validation_messages.error_unexpected' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="panel-wrapper">
      <article className="main-panel">
        <header>
          <h1 className="logo-doppler-new">Doppler</h1>
          <LanguageSelector />
        </header>
        <h5>{_('login.forgot_password')}</h5>
        <p className="content-subtitle">{_('forgot_password.description')}</p>
        <p className="content-subtitle">{_('forgot_password.description2')}</p>
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
                  fieldName={fieldNames.email}
                  label={_('signup.label_email')}
                  required
                  placeholder={_('signup.placeholder_email')}
                />
              </FieldGroup>
            </fieldset>
            <fieldset>
              <SubmitButton>{_('login.button_login')}</SubmitButton>
              <Link to="/login" className="forgot-link">
                <span className="triangle-right" />
                {_('forgot_password.back_login')}
              </Link>
            </fieldset>
          </Form>
        </Formik>
        <footer>
          <FormattedHTMLMessage
            tagName="small"
            id="signup.copyright"
            values={{ year: new Date().getFullYear() }}
          />
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

export default injectIntl(ForgotPassword);
