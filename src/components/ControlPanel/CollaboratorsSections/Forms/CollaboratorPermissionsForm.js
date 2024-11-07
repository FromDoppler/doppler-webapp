import { Formik, Form } from 'formik';
import { useIntl } from 'react-intl';
import {
  CheckboxFieldItemAccessible,
  FieldGroup,
  FormMessages,
  SubmitButton,
} from '../../../form-helpers/form-helpers';
import { InjectAppServices } from '../../../../services/pure-di';
import { getFormInitialValues } from '../../../../utils';

const fieldNames = {
  campaigns: 'campaigns',
  lists: 'lists',
  reports: 'reports',
  automation: 'automation',
  templates: 'templates',
  integrations: 'integrations',
  control_panel: 'control_panel',
  dashboard: 'dashboard',
  download_center: 'download_center',
};

export const CollaboratorPermissionsForm = InjectAppServices(({ title, onSubmit, onBack }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const handleSubmit = (values) => {
    for (let key in values) {
      if (values[key] === '') {
        values[key] = false;
      }
    }
    onSubmit(values);
  };

  const formikConfig = {
    enableReinitialize: true,
    initialValues: getFormInitialValues(fieldNames),
    onSubmit: handleSubmit,
  };

  return (
    <>
      <Formik {...formikConfig}>
        <Form className="awa-form" data-testid="collaboration-permissions-form">
          <legend>{title}</legend>
          <fieldset>
            <FieldGroup>
              {Object.keys(fieldNames).map((field, index) => (
                <CheckboxFieldItemAccessible
                  fieldName={field}
                  label={_(`collaborators.form_modal.permissions.${field}`)}
                  className="field-item--50"
                  key={index}
                />
              ))}
            </FieldGroup>
            <FormMessages />
            <FieldGroup className="dp-group-buttons">
              <li data-testid="success-form">
                <button
                  type="button"
                  className="dp-button button-medium ctaTertiary"
                  onClick={() => onBack()}
                >
                  {_('common.back')}
                </button>
              </li>
              <SubmitButton className="dp-button button-medium primary-green">
                {_('common.next')}
              </SubmitButton>
            </FieldGroup>
          </fieldset>
        </Form>
      </Formik>
    </>
  );
});
