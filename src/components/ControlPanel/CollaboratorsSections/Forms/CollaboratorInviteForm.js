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
  ({
    title,
    initialEmail = '',
    existingInvitations = [],
    onSubmit,
    onCancel,
    dependencies: { appSessionRef },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const userEmail = appSessionRef.current.userData.user.email;
    const fieldNames = {
      email: 'Email',
    };

    const handleSubmit = (values) => {
      onSubmit(values[fieldNames.email]);
    };

    const validate = (values) => {
      const errors = {};
      const normalizedEmail = values[fieldNames.email]?.trim().toLowerCase();
      const hasApprovedInvitation = existingInvitations.some(
        ({ email, invitationStatus }) =>
          invitationStatus === 'APPROVED' && email?.trim().toLowerCase() === normalizedEmail,
      );

      if (normalizedEmail === userEmail?.trim().toLowerCase()) {
        errors[fieldNames.email] = 'validation_messages.error_invalid_collaborator_email';
      } else if (hasApprovedInvitation) {
        errors[fieldNames.email] = 'validation_messages.error_collaborator_invitation_approved';
      }
      return errors;
    };

    const formikConfig = {
      enableReinitialize: true,
      initialValues: {
        [fieldNames.email]: initialEmail,
      },
      validateOnChange: true,
      validateOnBlur: false,
      validate: validate,
      onSubmit: handleSubmit,
    };

    return (
      <>
        <Formik {...formikConfig}>
          <Form className="awa-form form-request" data-testid="collaboration-invite-form">
            <legend>{title}</legend>
            <fieldset>
              <FieldGroup>
                <EmailFieldItemAccessible
                  autoFocus
                  fieldName={fieldNames.email}
                  label={_('collaborators.form_modal.email')}
                  required
                  placeholder={_('collaborators.form_modal.email_placeholder')}
                />
              </FieldGroup>
              <FormMessages />
            </fieldset>
            <div className="container-buttons">
              <button
                type="button"
                className="dp-button button-medium secondary-green"
                onClick={onCancel}
              >
                {_('common.cancel')}
              </button>
              <SubmitButton className="dp-button button-medium primary-green">
                {_('common.next')}
              </SubmitButton>
            </div>
          </Form>
        </Formik>
      </>
    );
  },
);
