import { Formik, Form } from 'formik';
import { useIntl } from 'react-intl';
import {
  EmailFieldItemAccessible,
  FieldGroup,
  FormMessages,
  SubmitButton,
} from '../../../form-helpers/form-helpers';

export const CollaboratorInviteForm = ({ title, onSubmit }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const handleSubmit = (values) => {
    onSubmit(values.Email);
  };

  const formikConfig = {
    enableReinitialize: true,
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: handleSubmit,
  };

  return (
    <>
      <Formik {...formikConfig}>
        <Form className="awa-form" data-testid="collaboration-invite-form">
          <legend>{title}</legend>
          <fieldset>
            <FieldGroup>
              <EmailFieldItemAccessible
                autoFocus
                fieldName={_('collaborators.form_modal.email')}
                label={_('collaborators.form_modal.email')}
                required
                placeholder={_('collaborators.form_modal.email_placeholder')}
              />
            </FieldGroup>
            <FormMessages />
            <SubmitButton>{_('common.next')}</SubmitButton>
          </fieldset>
        </Form>
      </Formik>
    </>
  );
};
