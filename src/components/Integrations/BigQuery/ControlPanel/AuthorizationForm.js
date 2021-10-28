import React from 'react';
import { Formik, Form } from 'formik';
import { useIntl } from 'react-intl';
import { validateEmail } from '../../../../validations';
import { CloudTagField } from '../../../form-helpers/CloudTagField';
import { FormattedMessage } from 'react-intl';

const fieldNames = {
  emails: 'emails',
};

export const AuthorizationForm = ({ emails, onSubmit }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const _validateEmail = (value) => {
    const errorKey = validateEmail(value);
    return errorKey ? <FormattedMessage id={errorKey} /> : null;
  };

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  const formikConfig = {
    enableReinitialize: true,
    initialValues: { [fieldNames.emails]: emails },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleSubmit,
  };

  return (
    <Formik {...formikConfig}>
      <Form className="dp-add-tags" aria-label="form" noValidate id="big-query-configuration-form">
        <fieldset>
          <legend>{_('big_query.add_permission_google_account')}</legend>
          <CloudTagField
            fieldName={fieldNames.emails}
            validateTag={_validateEmail}
            render={({ value, onChange, onKeyDown }) => (
              <input
                type="email"
                placeholder={_('big_query.add_google_account')}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className="dp--dashed"
              />
            )}
          />
        </fieldset>
      </Form>
    </Formik>
  );
};
