import React, { useState } from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';
import { useIntl } from 'react-intl';
import { validateEmail } from '../../../../validations';

export const AuthorizationForm = ({ emails }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const initialValues = [...emails, ''];

  const emailValidation = (value) => {
    const validateEmailMessage = validateEmail(value);
    // error message is set manually because formik's original error function doesn't with
    // doppler error component
    if (!value) {
      setErrorMessage(_('big_query.plus_error_message_empty'));
      return true;
    }

    if (validateEmailMessage) {
      setErrorMessage(_(validateEmailMessage));
      return true;
    }

    setErrorMessage('');
    return false;
  };

  const addEmail = async (validateField, fieldName, callback, values) => {
    const errors = await validateField(fieldName);
    const tags = [...values.emails];
    const tagToAdd = tags.pop();

    if (!errors && callback) {
      if (!tags.includes(tagToAdd)) {
        setErrorMessage('');
        callback();
      } else {
        setErrorMessage(_('big_query.plus_error_message_email_exists'));
      }
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ emails: initialValues }}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ values, validateField }) => (
        <Form>
          <ul className="field-group">
            <FieldArray
              name="emails"
              render={(arrayHelpers) => {
                const lastIndex = Math.max(0, values.emails.length - 1);
                const fieldName = `emails.${lastIndex}`;
                const isEmailEmpty = !values.emails[lastIndex];
                return (
                  <div>
                    <li
                      className={errorMessage !== '' ? 'field-item dp-error error' : 'field-item'}
                    >
                      {/* email input field and add button */}
                      <div className="dp-rowflex p-b-32">
                        <div className="col-md-8">
                          <Field
                            type="email"
                            name={fieldName}
                            // TODO: add items on enter event
                            validate={!isEmailEmpty ? emailValidation : null}
                          />
                          <div className="wrapper-errors dp-message dp-error-form">
                            <p>{errorMessage}</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <button
                            disabled={isEmailEmpty}
                            type="button"
                            onClick={() =>
                              addEmail(
                                validateField,
                                fieldName,
                                () => arrayHelpers.push(''),
                                values,
                              )
                            }
                            className="dp-button button-medium secondary-green"
                          >
                            {_('big_query.plus_button_add')}
                          </button>
                        </div>
                      </div>
                    </li>
                    {values.emails?.length > 1 &&
                      values.emails.slice(0, values.emails.length - 1).map((email, index) => (
                        <div key={index} className="p-b-6 p-t-6">
                          <span className="p-r-36">{email}</span>
                          <button type="button" onClick={() => arrayHelpers.remove(index)}>
                            {_('big_query.plus_button_remove')}
                          </button>
                        </div>
                      ))}
                    <div className="p-t-54 p-l-54 m-l-54"></div>
                  </div>
                );
              }}
            />
          </ul>
        </Form>
      )}
    </Formik>
  );
};
