import React from 'react';
import { FormattedMessage } from 'react-intl';
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
      formData: {},
      availablePlans: null,
      formIsValid: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentWillMount() {
    const { ClientTypePlans } = await this.dopplerLegacyClient.getUpgradePlanData(
      this.props.isSubscriber,
    );
    this.setState({ availablePlans: ClientTypePlans });
  }

  async handleSubmit(event) {
    event.preventDefault();
    await this.dopplerLegacyClient.sendEmailUpgradePlan({
      IdClientTypePlanSelected: this.state.formData[fieldNames.selectedPlanId],
      Detail: this.state.formData[fieldNames.message],
    });
    this.props.handleClose();
  }

  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));

    this.setState((prevState) => ({
      formIsValid: !!prevState.formData[fieldNames.message],
    }));
  };

  render() {
    const {
      changeHandler,
      handleSubmit,
      state: { availablePlans, formIsValid, formData },
      props: { handleClose },
    } = this;
    const isUserDataLoaded = !!availablePlans;

    if (isUserDataLoaded) {
      return (
        <>
          <h2 className="modal-title">
            <FormattedMessage id="upgradePlanForm.title" />
          </h2>
          <form className="form-request" onSubmit={handleSubmit}>
            <fieldset>
              <ul>
                <li>
                  <label htmlFor={fieldNames.selectedPlanId}>
                    <FormattedMessage id="upgradePlanForm.plan_select" />
                  </label>
                  <span className="dropdown-arrow" />
                  <select
                    value={formData[fieldNames.selectedPlanId] || -1}
                    name={fieldNames.selectedPlanId}
                    id={fieldNames.selectedPlanId}
                    onChange={changeHandler}
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
                        onChange={changeHandler}
                        value={formData[fieldNames.message] || ''}
                        name={fieldNames.message}
                        id={fieldNames.message}
                        placeholder={placeholderText}
                      />
                    )}
                  </FormattedMessage>
                </li>
              </ul>
            </fieldset>
            <fieldset className="fieldset-cta">
              <button className="dp-button primary-brown button-small" onClick={handleClose}>
                <FormattedMessage id="common.cancel" />
              </button>
              <button
                type="submit"
                className="dp-button primary-green button-small"
                disabled={!formIsValid}
              >
                <FormattedMessage id="common.send" />
              </button>
            </fieldset>
          </form>
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
