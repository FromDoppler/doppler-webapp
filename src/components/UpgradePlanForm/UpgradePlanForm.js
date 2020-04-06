import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../../components/Loading/Loading';
import { SubmitButton } from '../form-helpers/form-helpers';

const fieldNames = {
  selectedPlanId: 'selectedPlanId',
  message: 'message',
};
/** @type { import('../../services/doppler-legacy-client').DopplerLegacyClient } */
const UpgradePlanForm = ({ handleClose, isSubscriber, dependencies: { dopplerLegacyClient } }) => {
  const [state, setState] = useState({
    availablePlans: null,
    formIsValid: false,
    isLoading: true,
  });
  const intl = useIntl();

  useEffect(() => {
    const fetchData = async () => {
      const availablePlans = await dopplerLegacyClient.getUpgradePlanData(isSubscriber);
      setState({
        availablePlans: availablePlans,
        isLoading: false,
        firstPlanId: availablePlans && availablePlans.length && availablePlans[0].IdUserTypePlan,
      });
      // TODO: what happens when availablePlans is an empty array?
    };
    fetchData();
  }, [isSubscriber, dopplerLegacyClient]);

  const onSubmit = async (values, { setSubmitting }) => {
    await dopplerLegacyClient.sendEmailUpgradePlan({
      IdClientTypePlanSelected: values[fieldNames.selectedPlanId],
      Detail: values[fieldNames.message],
    });
    setSubmitting(false);
    handleClose();
  };

  const validate = (values) => {
    const errors = {};
    if (!values[fieldNames.message]) {
      errors[fieldNames.message] = 'validation_messages.error_required_field';
    }
    return errors;
  };

  return !state.isLoading ? (
    <>
      <h2 className="modal-title">
        <FormattedMessage id="upgradePlanForm.title" />
      </h2>
      <Formik
        initialValues={{ [fieldNames.selectedPlanId]: state.firstPlanId, [fieldNames.message]: '' }}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ errors, touched, submitCount }) => (
          <Form className="form-request">
            <fieldset>
              <ul className="field-group">
                <li className="field-item">
                  <label htmlFor={fieldNames.selectedPlanId}>
                    <FormattedMessage id="upgradePlanForm.plan_select" />
                  </label>
                  <span className="dropdown-arrow" />
                  <Field
                    autoFocus
                    component="select"
                    name={fieldNames.selectedPlanId}
                    id={fieldNames.selectedPlanId}
                  >
                    {state.availablePlans.map((item, index) => (
                      <option key={index} value={item.IdUserTypePlan}>
                        {item.Description}
                      </option>
                    ))}
                  </Field>
                </li>
                <li
                  className={
                    'field-item' +
                    (submitCount && touched[fieldNames.message] && errors[fieldNames.message]
                      ? ' error'
                      : '')
                  }
                >
                  <label htmlFor={fieldNames.message}>
                    <FormattedMessage id="common.message" />
                  </label>
                  <FormattedMessage id="upgradePlanForm.message_placeholder">
                    {(placeholderText) => (
                      <Field
                        component="textarea"
                        name={fieldNames.message}
                        id={fieldNames.message}
                        placeholder={placeholderText}
                      />
                    )}
                  </FormattedMessage>
                  <ErrorMessage name={fieldNames.message}>
                    {(err) => (
                      <div className="wrapper-errors">
                        <p className="error-message">{intl.formatMessage({ id: err })}</p>
                      </div>
                    )}
                  </ErrorMessage>
                </li>
              </ul>
            </fieldset>
            <div className="container-buttons">
              <button className="dp-button button-medium primary-grey" onClick={handleClose}>
                <FormattedMessage id="common.cancel" />
              </button>
              <SubmitButton>
                <FormattedMessage id="common.send" />
              </SubmitButton>
            </div>
          </Form>
        )}
      </Formik>
    </>
  ) : (
    <Loading />
  );
};
export default InjectAppServices(UpgradePlanForm);
