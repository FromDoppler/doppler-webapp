import React from 'react';
import { Formik, Form } from 'formik';
import { useIntl } from 'react-intl';
import { validateEmail } from '../../../../validations';
import { CloudTagField } from '../../../form-helpers/CloudTagField';
import { FormattedMessage } from 'react-intl';
import { SubmitButton } from '../../../form-helpers/form-helpers';

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

  const handleSubmit = async (values) => {
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
      <Form className="dp-add-tags" aria-label="form" noValidate>
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
        <SubmitButton className="dp-button button-medium primary-green m-t-30">
          {_('common.save')}
        </SubmitButton>
      </Form>
    </Formik>
  );
};
