import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import { InjectAppServices } from '../../services/pure-di';

const fieldNames = {
  selectedPlanId: 'selectedPlanId',
  message: 'message',
};

class UpgradePlanForm extends React.Component {
  constructor({ dependencies: { dopplerLegacyClient } }) {
    super();

    /** @type { import('../../services/doppler-legacy-client').DopplerLegacyClient } */
    this.dopplerLegacyClient = dopplerLegacyClient;

    this.state = {
      availablePlans: null,
      formIsValid: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  async componentWillMount() {
    const availablePlans = await this.dopplerLegacyClient.getUpgradePlanData(
      this.props.isSubscriber,
    );
    this.setState({ availablePlans: availablePlans });
  }

  async onSubmit(values, { setSubmitting }) {
    await this.dopplerLegacyClient.sendEmailUpgradePlan({
      IdClientTypePlanSelected: values[fieldNames.selectedPlanId],
      Detail: values[fieldNames.message],
    });
    setSubmitting(false);
    this.props.handleClose();
  }

  validate(values) {
    const errors = {};
    if (!values[fieldNames.message]) {
      // TODO: translate it, here or in the markup
      errors[fieldNames.message] = 'Required';
    }
    return errors;
  }

  render() {
    const {
      onSubmit,
      validate,
      state: { availablePlans },
      props: { handleClose },
    } = this;
    const isUserDataLoaded = !!availablePlans;

    if (isUserDataLoaded) {
      return (
        <>
          <h2 className="modal-title">
            <FormattedMessage id="upgradePlanForm.title" />
          </h2>
          <Formik
            initialValues={{ [fieldNames.selectedPlanId]: -1, [fieldNames.message]: '' }}
            validate={validate}
            onSubmit={onSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form className="form-request" onSubmit={handleSubmit}>
                <fieldset>
                  <ul>
                    <li>
                      <label htmlFor={fieldNames.selectedPlanId}>
                        <FormattedMessage id="upgradePlanForm.plan_select" />
                      </label>
                      <span className="dropdown-arrow" />
                      <select
                        value={values[fieldNames.selectedPlanId]}
                        name={fieldNames.selectedPlanId}
                        id={fieldNames.selectedPlanId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {availablePlans.map((item, index) => (
                          <option key={index} value={item.IdUserTypePlan}>
                            {item.Description}
                          </option>
                        ))}
                      </select>
                    </li>
                    <li>
                      <label htmlFor={fieldNames.message}>
                        <FormattedMessage id="common.message" />
                      </label>
                      <FormattedMessage id="upgradePlanForm.message_placeholder">
                        {(placeholderText) => (
                          <textarea
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values[fieldNames.message]}
                            name={fieldNames.message}
                            id={fieldNames.message}
                            placeholder={placeholderText}
                          />
                        )}
                      </FormattedMessage>
                      {/* TODO: Add the right styles */}
                      {touched[fieldNames.message] && errors[fieldNames.message]}
                    </li>
                  </ul>
                </fieldset>
                <fieldset className="fieldset-cta">
                  <button className="dp-button button-medium primary-grey" onClick={handleClose}>
                    <FormattedMessage id="common.cancel" />
                  </button>
                  <button
                    type="submit"
                    className="dp-button button-medium primary-green"
                    disabled={isSubmitting}
                  >
                    <FormattedMessage id="common.send" />
                  </button>
                </fieldset>
              </form>
            )}
          </Formik>
        </>
      );
    } else {
      return (
        <div>
          <FormattedMessage id="loading" />
        </div>
      );
    }
  }
}

export default InjectAppServices(UpgradePlanForm);
