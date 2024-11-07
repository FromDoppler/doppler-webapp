import { Formik, Form } from 'formik';
import { useIntl } from 'react-intl';
import {
  EmailFieldItemAccessible,
  FieldGroup,
  FormMessages,
  SubmitButton,
} from '../../../form-helpers/form-helpers';
import { InjectAppServices } from '../../../../services/pure-di';

export const CollaboratorInviteForm = InjectAppServices(
  ({ title, onSubmit, currentEmail, dependencies: { appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const userEmail = appSessionRef.current.userData.user.email;

    const handleSubmit = (values) => {
      onSubmit(values.Email);
    };

    const validate = (values) => {
      const errors = {};
      if (values.Email === userEmail) {
        errors['Email'] = 'validation_messages.error_invalid_collaborator_email';
      }
      return errors;
    };

    const formikConfig = {
      enableReinitialize: true,
      initialValues: currentEmail ? { Email: currentEmail } : { Email: '' },
      validateOnChange: false,
      validateOnBlur: false,
      validate: validate,
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
  },
);
