import React, { useCallback, useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { FieldGroup, FieldItem } from '../../../../form-helpers/form-helpers';
import { Form, Formik } from 'formik';
import { validateEmail } from '../../../../../validations';
import { CloudTagField } from '../../../../form-helpers/CloudTagField';
import { InjectAppServices } from '../../../../../services/pure-di';

const fieldNames = {
  editRecipients: 'editRecipients',
};

export const InvoiceRecipients = InjectAppServices(
  ({ dependencies: { dopplerBillingUserApiClient, appSessionRef }, viewOnly, selectedPlan }) => {
    const [recipients, setRecipients] = useState([]);
    const [edit, setEdit] = useState(!viewOnly);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    const updateInvoiceRecipients = useCallback(
      (recipients) => {
        const update = async () => {
          const userEmail = appSessionRef.current.userData.user.email;
          const recipientsToSend = recipients.length > 0 ? recipients : [userEmail];
          const response = await dopplerBillingUserApiClient.updateInvoiceRecipients(
            recipientsToSend,
            selectedPlan,
          );
          if (response.success) {
            setRecipients(recipientsToSend);
          }
          // TODO: define action to take when update fails
        };
        update();
      },
      [selectedPlan, dopplerBillingUserApiClient, appSessionRef],
    );

    const submitEditRecipients = useCallback(
      (values) => {
        updateInvoiceRecipients(values[fieldNames.editRecipients]);
        setEdit(false);
      },
      [updateInvoiceRecipients],
    );

    useEffect(() => {
      const fetchData = async () => {
        const userEmail = appSessionRef.current.userData.user.email;
        const { success, value } = await dopplerBillingUserApiClient.getInvoiceRecipientsData();
        if (success && value.recipients?.length > 0) {
          setRecipients(value.recipients);
        } else if (success) {
          submitEditRecipients({
            [fieldNames.editRecipients]: [userEmail],
          });
        } else {
          // TODO: define action to take when update fails
          setRecipients([userEmail]);
        }
      };

      fetchData();
    }, [appSessionRef, dopplerBillingUserApiClient, submitEditRecipients]);

    const _validateEmail = (value) => {
      const errorKey = validateEmail(value);
      return errorKey ? <FormattedMessage id={errorKey} /> : null;
    };

    const formikConfig = {
      enableReinitialize: true,
      initialValues: { [fieldNames.editRecipients]: recipients },
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: submitEditRecipients,
    };

    return (
      <>
        <p className="m-b-12">
          {_('checkoutProcessForm.purchase_summary.send_invoice_email_message')}
        </p>
        {!edit ? (
          <>
            <p className="m-b-12">
              <strong>{recipients?.join(', ')}</strong>
            </p>
            <button className="dp-button link-green" onClick={() => setEdit(true)}>
              {_('checkoutProcessForm.purchase_summary.edit_add_recipients_button')}
            </button>
          </>
        ) : (
          <Formik {...formikConfig}>
            {({ values, isSubmitting }) => (
              <Form className="dp-add-tags" aria-label="form" noValidate>
                <legend>{_('checkoutProcessForm.purchase_summary.header')}</legend>
                <fieldset>
                  <FieldGroup className="m-b-24">
                    <CloudTagField
                      fieldName={fieldNames.editRecipients}
                      validateTag={_validateEmail}
                      render={({ value, onChange, onKeyDown }) => (
                        <input
                          type="email"
                          placeholder={_(
                            'checkoutProcessForm.purchase_summary.add_recipient_placeholder',
                          )}
                          value={value}
                          onChange={onChange}
                          onKeyDown={onKeyDown}
                          className="dp--dashed"
                        />
                      )}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <FieldItem className="field-item">
                      <div className="dp-buttons-actions">
                        <button
                          type="button"
                          className={`dp-button button-medium primary-green ${
                            isSubmitting ? 'button--loading' : ''
                          }`}
                          disabled={isSubmitting}
                          onClick={() => submitEditRecipients(values)}
                        >
                          {_(
                            'checkoutProcessForm.purchase_summary.edit_add_recipients_confirmation_button',
                          )}
                        </button>
                      </div>
                    </FieldItem>
                  </FieldGroup>
                </fieldset>
              </Form>
            )}
          </Formik>
        )}
      </>
    );
  },
);
