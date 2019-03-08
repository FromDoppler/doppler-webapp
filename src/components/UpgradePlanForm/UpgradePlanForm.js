import React from 'react';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';

class UpgradePlanForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userPlanModel: null,
      formIsValid: false,
    };

    this.submitForm = this.submitForm.bind(this);
  }

  async componentDidMount() {
    const idUserType = this.props.isSubscriber ? 4 : 2;
    const response = await axios.get(
      process.env.REACT_APP_API_URL +
        '/SendUpgradePlanContactEmail/GetUpgradePlanData?idUserType=' +
        idUserType,
      {
        withCredentials: true,
      },
    );
    this.setState({ userPlanModel: response.data.data });
  }

  async submitForm() {
    // TODO: research why axios is cancelling the requests

    await fetch(
      process.env.REACT_APP_API_URL + '/SendUpgradePlanContactEmail/SendEmailUpgradePlan',
      {
        method: 'post',
        crossDomain: true,
        body: JSON.stringify(this.state.userPlanModel),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
      },
    );

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
    if (!this.state.userPlanModel) {
      return (
        <div>
          <FormattedMessage id="loading" />
        </div>
      );
    }

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
  }
}

export default UpgradePlanForm;
