import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../../components/Loading/Loading';
import { SubmitButton } from '../form-helpers/form-helpers';
import useTimeout from '../../hooks/useTimeout';

const fieldNames = {
  selectedPlanId: 'selectedPlanId',
  message: 'message',
};

const getAvailablePlans = (userPlan, availablePlans) =>
  availablePlans.filter((p) =>
    userPlan.isSubscribers
      ? p.SubscribersQty > userPlan.maxSubscribers
      : p.EmailQty > userPlan.maxSubscribers,
  );

/** @type { import('../../services/doppler-legacy-client').DopplerLegacyClient } */
const UpgradePlanForm = ({
  handleClose,
  isSubscriber,
  dependencies: { dopplerLegacyClient, appSessionRef },
}) => {
  const [state, setState] = useState({
    availablePlans: null,
    formIsValid: false,
    isLoading: true,
  });
  const intl = useIntl();
  const createTimeout = useTimeout();

  useEffect(() => {
    const fetchData = async () => {
      const availablePlans = await dopplerLegacyClient.getUpgradePlanData(isSubscriber);
      const userPlan = appSessionRef.current.userData.user.plan;
      const availablePlanMajors = getAvailablePlans(userPlan, availablePlans);
      setState({
        availablePlans: availablePlanMajors,
        isLoading: false,
        isLastPlan: availablePlanMajors.length === 0,
        firstPlanId: availablePlanMajors[0]?.IdUserTypePlan,
      });
      // TODO: what happens when availablePlans is an empty array?
    };
    fetchData();
  }, [isSubscriber, dopplerLegacyClient, appSessionRef]);

  const [sentEmail, setSentEmail] = useState(false);

  const onSubmit = async (values, { setSubmitting }) => {
    await dopplerLegacyClient.upgradePlan({
      IdClientTypePlanSelected: values[fieldNames.selectedPlanId],
      Detail: values[fieldNames.message],
    });

    setSubmitting(false);
    if (values[fieldNames.selectedPlanId] > 0) {
      setSentEmail(false);
      handleClose();
      // TODO: Show a new popup
    } else {
      setSentEmail(true);
      appSessionRef.current.userData.user.isLastPlanRequested = true;
      createTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values[fieldNames.message] && values[fieldNames.selectedPlanId] === null) {
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
                {!state.isLastPlan ? (
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
                ) : null}
                {state.isLastPlan ? (
                  <li
                    className={
                      'field-item' +
                      (submitCount && touched[fieldNames.message] && errors[fieldNames.message]
                        ? ' error'
                        : '')
                    }
                  >
                    <label htmlFor={fieldNames.message}>
                      <FormattedMessage id="common.message_last_plan" />
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
                ) : null}
              </ul>
            </fieldset>
            {!sentEmail ? (
              <div className="container-buttons">
                <button className="dp-button button-medium primary-grey" onClick={handleClose}>
                  <FormattedMessage id="common.cancel" />
                </button>
                <SubmitButton>
                  <FormattedMessage id="common.send" />
                </SubmitButton>
              </div>
            ) : (
              <div className="dp-wrap-message dp-wrap-success">
                <span className="dp-message-icon"></span>
                <div className="dp-content-message">
                  <label htmlFor={fieldNames.message}>
                    <FormattedMessage id="common.message_success" />
                  </label>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  ) : (
    <Loading />
  );
};
export default InjectAppServices(UpgradePlanForm);
