import React from 'react';
import { Formik, Form } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  CheckboxFieldItemAccessible,
  FieldGroup,
  SubmitButton,
} from '../../../form-helpers/form-helpers';

const fieldNames = {
  permissions: 'permissions',
};

export const CollaboratorPermissionsForm = ({
  permissions,
  selectedPermissions = [],
  onBack,
  onSubmit,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const validate = (values) => {
    const errors = {};
    if (!values[fieldNames.permissions]?.length) {
      errors[fieldNames.permissions] = 'collaborators.form_modal.permissions_error';
    }

    return errors;
  };

  const getPermissionLabel = (permission) => {
    const permissionId = `${permission.idSection}`.padStart(2, '0');
    const messageId = `collaborators.form_modal.permissions_labels.section_${permissionId}`;
    const translatedLabel = _(messageId);
    return translatedLabel === messageId ? permission.name : translatedLabel;
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        [fieldNames.permissions]: selectedPermissions.map((permissionId) => `${permissionId}`),
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validate={validate}
      onSubmit={(values) =>
        onSubmit(values[fieldNames.permissions].map((permissionId) => Number(permissionId)))
      }
    >
      {({ errors, submitCount, values }) => (
        <Form className="awa-form form-request" data-testid="collaboration-permissions-form">
          <fieldset>
            <legend>{_('collaborators.form_modal.permissions_title')}</legend>
            <h3 className="m-t-30 m-b-24">{_('collaborators.form_modal.permissions_legend')}</h3>
            <div className="dp-rowflex">
              {permissions.map((permission) => (
                <div className="col-sm-6 m-b-12" key={permission.idSection}>
                  <FieldGroup>
                    <CheckboxFieldItemAccessible
                      fieldName={fieldNames.permissions}
                      id={`permission-${permission.idSection}`}
                      label={getPermissionLabel(permission)}
                      value={`${permission.idSection}`}
                      withErrors={false}
                      withSubmitCount={false}
                    />
                  </FieldGroup>
                </div>
              ))}
            </div>
            {submitCount > 0 && errors[fieldNames.permissions] ? (
              <div className="dp-wrap-message dp-wrap-cancel m-b-12" role="alert">
                <span className="dp-message-icon" />
                <div className="dp-content-message">
                  <p>
                    <FormattedMessage id={errors[fieldNames.permissions]} />
                  </p>
                </div>
              </div>
            ) : null}
          </fieldset>
          <div className="container-buttons">
            <button
              type="button"
              className="dp-button button-medium secondary-green"
              onClick={() =>
                onBack(values[fieldNames.permissions].map((permissionId) => Number(permissionId)))
              }
            >
              {_('common.back')}
            </button>
            <SubmitButton className="dp-button button-medium primary-green">
              {_('common.next')}
            </SubmitButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};
