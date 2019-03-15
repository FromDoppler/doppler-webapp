import React from 'react';
import { FormattedMessage } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';

class UpgradePlanForm extends React.Component {
  constructor({ dependencies: { dopplerLegacyClient } }) {
    super();

    /** @type { import('../../services/doppler-legacy-client').DopplerLegacyClient } */
    this.dopplerLegacyClient = dopplerLegacyClient;

    this.state = {
      userPlanModel: null,
      formIsValid: false,
    };

    this.submitForm = this.submitForm.bind(this);
  }

  async componentWillMount() {
    const result = await this.dopplerLegacyClient.getUpgradePlanData(this.props.isSubscriber);
    this.setState({ userPlanModel: result });
  }

  async submitForm() {
    await this.dopplerLegacyClient.sendEmailUpgradePlan(this.state.userPlanModel);
    this.props.handleClose();
  }

  changeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState((prevState) => ({
      userPlanModel: {
        ...prevState.userPlanModel,
        [name]: value,
      },
      formIsValid: !!this.state.userPlanModel.Detail,
    }));
  };

  render() {
    const isUserDataLoaded = !!this.state.userPlanModel;
    if (isUserDataLoaded) {
      return (
        <>
          <h2 className="modal-title">
            <FormattedMessage id="upgradePlanForm.title" />
          </h2>
          <form action="#" className="form-request">
            <fieldset>
              <ul>
                <li>
                  <label htmlFor="plan">
                    <FormattedMessage id="upgradePlanForm.plan_select" />
                  </label>
                  <span className="dropdown-arrow" />
                  <select
                    value={this.state.userPlanModel.IdClientTypePlanSelected || -1}
                    name="IdClientTypePlanSelected"
                    onChange={this.changeHandler}
                  >
                    {this.state.userPlanModel.ClientTypePlans.map((item, index) => (
                      <option key={index} value={item.IdUserTypePlan}>
                        {item.Description}
                      </option>
                    ))}
                  </select>
                </li>
                <li>
                  <label htmlFor="message">
                    <FormattedMessage id="common.message" />
                  </label>
                  <textarea
                    onChange={this.changeHandler}
                    value={this.state.userPlanModel.Detail || ''}
                    name="Detail"
                    placeholder="Tu mensage"
                  />
                </li>
              </ul>
            </fieldset>
            <fieldset className="fieldset-cta">
              <button
                className="dp-button primary-brown button-small"
                onClick={this.props.handleClose}
              >
                <FormattedMessage id="common.cancel" />
              </button>
              <button
                className="dp-button primary-green button-small"
                onClick={this.submitForm}
                disabled={!this.state.formIsValid}
              >
                <FormattedMessage id="common.send" />
              </button>
            </fieldset>
          </form>
        </>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

export default InjectAppServices(UpgradePlanForm);
