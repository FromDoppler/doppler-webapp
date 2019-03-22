import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { InjectAppServices } from '../../services/pure-di';
import Loading from '../../components/Loading/Loading';

const fieldNames = {
  selectedPlanId: 'selectedPlanId',
  message: 'message',
};

class UpgradePlanForm extends React.Component {
  constructor({ dependencies: { dopplerLegacyClient }, intl }) {
    super();

    /** @type { import('../../services/doppler-legacy-client').DopplerLegacyClient } */
    this.dopplerLegacyClient = dopplerLegacyClient;
    this.intl = intl;

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
      errors[fieldNames.message] = this.intl.formatMessage({
        id: 'validation_messages.error_required_field',
      });
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
    // TODO: what happens when availablePlans is an empty array?
    const firstPlanId = availablePlans && availablePlans.length && availablePlans[0].IdUserTypePlan;

    if (isUserDataLoaded) {
      return (
        <>
          <h2 className="modal-title">
            <FormattedMessage id="upgradePlanForm.title" />
          </h2>
          <Formik
            initialValues={{ [fieldNames.selectedPlanId]: firstPlanId, [fieldNames.message]: '' }}
            validate={validate}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="form-request">
                <fieldset>
                  <ul className="field-group">
                    <li className="field-item">
                      <label htmlFor={fieldNames.selectedPlanId}>
                        <FormattedMessage id="upgradePlanForm.plan_select" />
                      </label>
                      <span className="dropdown-arrow" />
                      <Field
                        component="select"
                        name={fieldNames.selectedPlanId}
                        id={fieldNames.selectedPlanId}
                      >
                        {availablePlans.map((item, index) => (
                          <option key={index} value={item.IdUserTypePlan}>
                            {item.Description}
                          </option>
                        ))}
                      </Field>
                    </li>
                    <li
                      className={
                        'field-item' +
                        (touched[fieldNames.message] && errors[fieldNames.message] ? ' error' : '')
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
                        {(msg) => (
                          <div className="wrapper-errors">
                            <p className="error-message">{msg}</p>
                          </div>
                        )}
                      </ErrorMessage>
                    </li>
                  </ul>
                </fieldset>
                <fieldset className="fieldset-cta">
                  <button className="dp-button button-medium primary-grey" onClick={handleClose}>
                    <FormattedMessage id="common.cancel" />
                  </button>
                  <button
                    type="submit"
                    className={
                      'dp-button button-medium primary-green' +
                      ((isSubmitting && ' button--loading') || '')
                    }
                    disabled={isSubmitting}
                  >
                    <FormattedMessage id="common.send" />
                  </button>
                </fieldset>
              </Form>
            )}
          </Formik>
        </>
      );
    } else {
      return <Loading />;
    }
  }
}

export default InjectAppServices(injectIntl(UpgradePlanForm));
