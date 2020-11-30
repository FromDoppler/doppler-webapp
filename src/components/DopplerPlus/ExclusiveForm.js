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
import { useIntl } from 'react-intl';

const ExclusiveForm = ({ dependencies: { dopplerLegacyClient, appSessionRef } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  // TODO: apply content

  const featureOptions = [
    {
      id: 'CustomOnboarding',
      value: 'CustomOnboarding',
      description: _('exclusive_form.custom_onboarding'),
    },
    {
      id: 'StrategicAdvisory',
      value: 'StrategicAdvisory',
      description: _('exclusive_form.strategic_accompaniment'),
    },
    {
      id: 'DesignLayoutEmails',
      value: 'DesignLayoutEmails',
      description: _('exclusive_form.design_layout_emails'),
    },
  ];

  const featureOptionsPart2 = [
    {
      id: 'CustomReports',
      value: 'CustomReports',
      description: _('exclusive_form.custom_reports'),
    },
    {
      id: 'DevelopmentCustomFeatures',
      value: 'DevelopmentCustomFeatures',
      description: _('exclusive_form.development_custom_features'),
    },
    {
      id: 'DedicatedIps',
      value: 'DedicatedIps',
      description: _('exclusive_form.dedicated_ip'),
    },
  ];

  const fieldNames = {
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    phone: 'phone',
    range_time: 'range_time',
    volume: 'volume',
  };

  const getFormInitialValues = () => {
    const initialValues = Object.keys(fieldNames).reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: '',
      }),
      {},
    );

    initialValues[fieldNames.email] = appSessionRef.current.userData.user.email;
    initialValues[fieldNames.features] = featureOptions[0].value;

    return initialValues;
  };

  const [formSubmitted, setFormSubmitted] = useState(false);

  const validate = () => {
    setFormSubmitted(false);
  };

  const onSubmit = async (values, { setSubmitting }) => {
    setFormSubmitted(false);
    try {
      const result = await dopplerLegacyClient.requestExclusiveFeaturesDemo(values);
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
        <title>{_('exclusive_form.title')}</title>
        <meta name="description" content={_('exclusive_form.meta_description')} />
      </Helmet>
      <HeaderSection>
        <div className="col-sm-12 col-md-12 col-lg-12">
          <nav className="dp-breadcrumb">
            <ul>
              <li>
                <a href={_('exclusive_form.breadcrumb_url')}>{_('exclusive_form.breadcrumb')}</a>
              </li>
              <li>{_('exclusive_form.title')}</li>
            </ul>
          </nav>
          <h2>{_('exclusive_form.title')}</h2>
          <p>{_('exclusive_form.description')}</p>
        </div>
      </HeaderSection>

      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-lg-8 col-md-12 m-b-24">
            <div className="dp-wrapper-form-plans">
              <h3>{_('exclusive_form.form_title')}</h3>
              <FormWithCaptcha
                onSubmit={onSubmit}
                initialValues={getFormInitialValues()}
                validate={validate}
              >
                <legend>{_('exclusive_form.form_legend')}</legend>
                <fieldset>
                  <FieldGroup>
                    <EmailFieldItem
                      autoFocus
                      type="email"
                      fieldName={fieldNames.email}
                      label="Email:"
                      id="email"
                      required
                    />
                    <FieldItem className="field-item">
                      <fieldset>
                        <FieldGroup>
                          <InputFieldItem
                            type="text"
                            fieldName={fieldNames.firstname}
                            id="name"
                            label={_('signup.label_firstname')}
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
                      </fieldset>
                    </FieldItem>
                    <FieldItem className="field-item">
                      <fieldset>
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
                            label={_('exclusive_form.form_hour_contact')}
                            id="range_time"
                            className="field-item--50"
                          />
                        </FieldGroup>
                      </fieldset>
                    </FieldItem>
                  </FieldGroup>
                  <div className="dp-wrapper-exclusive-features">
                    <h4>{_('exclusive_form.form_features')}</h4>
                    <div className="dp-bg-ghostwhite dp-container">
                      <div className="dp-rowflex">
                        <div className="col-sm-12 col-md-6">
                          <Field name="features">
                            {({ field }) => (
                              <ul className="dp-exclusive-features-list field-group">
                                {featureOptions.map((featureOption) => (
                                  <li
                                    key={featureOption.id}
                                    className="field-item field-item__checkbox"
                                  >
                                    <input
                                      id={featureOption.id}
                                      type="checkbox"
                                      name="featuresAmount"
                                      {...field}
                                      value={featureOption.value}
                                      checked={field.value === featureOption.value}
                                    />
                                    <span class="checkmark"></span>
                                    <label for="Acompanamiento_estrategico">
                                      {featureOption.description}
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </Field>
                        </div>
                        <div className="col-sm-12 col-md-6">
                          <Field name="features">
                            {({ field }) => (
                              <ul className="dp-exclusive-features-list field-group">
                                {featureOptionsPart2.map((featureOption) => (
                                  <li
                                    key={featureOption.id}
                                    className="field-item field-item__checkbox"
                                  >
                                    <input
                                      id={featureOption.id}
                                      type="checkbox"
                                      name="featuresAmount"
                                      {...field}
                                      value={featureOption.value}
                                      checked={field.value === featureOption.value}
                                    />
                                    <span class="checkmark"></span>
                                    <label for="Acompanamiento_estrategico">
                                      {featureOption.description}
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dp-container">
                    <div className="dp-rowflex">
                      <div className="dp-footer-form">
                        {formSubmitted ? (
                          <div className="dp-wrap-confirmation">
                            <div className="dp-msj-confirmation bounceIn">
                              <p>{_('exclusive_form.success')}</p>
                            </div>
                          </div>
                        ) : null}
                        <div className="dp-action">
                          <SubmitButton className="dp-button button-medium primary-green">
                            {_('exclusive_form.demo')}
                          </SubmitButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </FormWithCaptcha>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(ExclusiveForm);
