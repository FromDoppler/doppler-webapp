import React from 'react';
import { Formik, Field, Form } from 'formik';
import { validateEmail } from '../../../validations';
import { CloudTagField } from '../../form-helpers/CloudTagField';
import { FormattedMessage } from 'react-intl';

const fieldName = 'emails';

export const BigQueryAuthorizationForm = ({ initialValues }) => {
  const _validateEmail = (value) => {
    let errorKey = validateEmail(value);
    return errorKey ? <FormattedMessage id={errorKey} /> : null;
  };

  const onSubmit = (values) => {
    let emails = [...values[fieldName]];
    emails.pop();
    alert(JSON.stringify(emails));
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ [fieldName]: initialValues }}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
    >
      <Form className="dp-add-tags">
        <fieldset>
          <legend>Agregar permiso para cuentas de Google</legend>
          <CloudTagField
            fieldName={fieldName}
            validateTag={_validateEmail}
            render={({ tagName, onKeyDown, validate }) => (
              <Field
                type="email"
                placeholder="Agregar cuenta de google"
                name={tagName}
                onKeyDown={onKeyDown}
                validate={validate}
              />
            )}
          />
        </fieldset>
        <button type="submit" className="dp-button button-medium primary-green m-t-30">
          Guardar
        </button>
      </Form>
    </Formik>
  );
};
