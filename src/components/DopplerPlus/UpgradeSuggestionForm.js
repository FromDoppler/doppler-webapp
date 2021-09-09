import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { InjectAppServices } from '../../services/pure-di';
import { Field } from 'formik';
import {
  EmailFieldItem,
  FieldGroup,
  FieldItem,
  FormWithCaptcha,
  InputFieldItem,
  PhoneFieldItem,
  SubmitButton,
} from '../form-helpers/form-helpers';
import { FormattedMessage, useIntl } from 'react-intl';
import { getFormInitialValues } from '../../utils';

const UpgradeSuggestionForm = ({ dependencies: { dopplerLegacyClient, appSessionRef } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const fieldNames = {
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    phone: 'phone',
    range_time: 'range_time',
    message: 'message',
  };

  const _getFormInitialValues = () => {
    const initialValues = getFormInitialValues(fieldNames);

    initialValues[fieldNames.email] = appSessionRef.current.userData.user.email;

    return initialValues;
  };

  const validate = () => {
    setFormSubmitted(false);
  };

  const onSubmit = async (values, { setSubmitting }) => {
    setFormSubmitted(false);
    try {
      const result = await dopplerLegacyClient.requestSuggestionUpgradeForm(values);
      if (result) {
        setFormSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{_('upgrade_suggestion_form.title')}</title>
        <meta name="description" content={_('upgrade_suggestion_form.meta_description')} />
      </Helmet>
      <HeaderSection>
        <div className="col-sm-12 col-md-12 col-lg-12">
          <nav className="dp-breadcrumb">
            <ul>
              <li>
                <a href={_('common.breadcrumb_plans_url')}>{_('common.breadcrumb_plans')}</a>
              </li>
              <li>{_('upgrade_suggestion_form.title')}</li>
            </ul>
          </nav>
          <h2>{_('upgrade_suggestion_form.title')}</h2>
          <p>{_('upgrade_suggestion_form.description')}</p>
        </div>
      </HeaderSection>

      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-lg-8 col-md-12 m-b-24">
            <div className="dp-wrapper-form-plans">
              <h3>{_('upgrade_suggestion_form.form_title')}</h3>
              <FormWithCaptcha
                onSubmit={onSubmit}
                initialValues={_getFormInitialValues()}
                validate={validate}
              >
                <legend>{_('upgrade_suggestion_form.form_legend')}</legend>
                <fieldset>
                  <FieldGroup>
                    <EmailFieldItem
                      autoFocus
                      type="email"
                      fieldName={fieldNames.email}
                      label={_('signup.label_email')}
                      id="email"
                      required
                    />
                    <FieldItem className="field-item">
                      <FieldGroup>
                        <InputFieldItem
                          type="text"
                          fieldName={fieldNames.firstname}
                          label={_('signup.label_firstname')}
                          id="firstname"
                          withNameValidation
                          required
                          className="field-item--50"
                        />
                        <InputFieldItem
                          type="text"
                          label={_('signup.label_lastname')}
                          fieldName={fieldNames.lastname}
                          id="lastname"
                          withNameValidation
                          required
                          className="field-item--50"
                        />
                      </FieldGroup>
                    </FieldItem>
                    <FieldItem className="field-item">
                      <FieldGroup>
                        <PhoneFieldItem
                          fieldName={fieldNames.phone}
                          label={_('signup.label_phone')}
                          placeholder={_('signup.placeholder_phone')}
                          className="field-item--50"
                          required
                        />
                        <InputFieldItem
                          fieldName={fieldNames.range_time}
                          type="text"
                          label={_('upgrade_suggestion_form.form_hour_contact')}
                          id="range_time"
                          className="field-item--50"
                        />
                      </FieldGroup>
                    </FieldItem>
                    <FieldItem className="field-item">
                      <label htmlFor={fieldNames.message}>
                        <FormattedMessage id="upgrade_suggestion_form.message" />
                      </label>
                      <Field
                        component="textarea"
                        name={fieldNames.message}
                        id={fieldNames.message}
                        placeholder={_('upgrade_suggestion_form.message_placeholder')}
                      />
                    </FieldItem>
                    <FieldItem className="field-item">
                      <div className="dp-container">
                        <div className="dp-rowflex">
                          <div className="dp-footer-form">
                            {formSubmitted ? (
                              <div className="dp-wrap-confirmation">
                                <div className="dp-msj-confirmation bounceIn">
                                  <p>{_('upgrade_suggestion_form.success')}</p>
                                </div>
                              </div>
                            ) : null}
                            <div className="dp-action">
                              <SubmitButton className="dp-button button-medium primary-green">
                                {_('upgrade_suggestion_form.submit_button')}
                              </SubmitButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </FieldItem>
                  </FieldGroup>
                </fieldset>
              </FormWithCaptcha>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default InjectAppServices(UpgradeSuggestionForm);
