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
  CheckboxFieldItem,
} from '../form-helpers/form-helpers';
import { useIntl } from 'react-intl';
import * as S from './ExclusiveForm.styles';

const ExclusiveForm = ({ dependencies: { dopplerLegacyClient, appSessionRef } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [showMessageBox, setShowMessageBox] = useState();

  const featureOptions = [
    {
      id: 'features1',
      value: _('exclusive_form.custom_onboarding'),
      name: 'features',
    },
    {
      id: 'features2',
      value: _('exclusive_form.strategic_accompaniment'),
      name: 'features',
    },
    {
      id: 'features3',
      value: _('exclusive_form.design_layout_emails'),
      name: 'features',
    },
  ];

  const featureOptionsPart2 = [
    {
      id: 'features4',
      value: _('exclusive_form.custom_reports'),
      name: 'features',
    },
    {
      id: 'features5',
      value: _('exclusive_form.development_custom_features'),
      name: 'features',
    },
    {
      id: 'features6',
      value: _('exclusive_form.dedicated_ip'),
      name: 'features',
    },
  ];

  const fieldNames = {
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    phone: 'phone',
    range_time: 'range_time',
    features: 'features',
    message: 'message',
  };

  const volumeOptions = [
    {
      id: 'lessThan500k',
      value: 'Menos de 500',
      description: _('agencies.volume_0'),
    },
    {
      id: 'between500kAnd1m',
      value: 'Entre 500k y 1m',
      description: _('agencies.volume_500'),
    },
    {
      id: 'between1mAnd10m',
      value: 'Entre 1m y 10m',
      description: _('agencies.volume_1m'),
    },
    {
      id: 'moreThan10m',
      value: 'Más de 10m',
      description: _('agencies.volume_10m'),
    },
    {
      id: 'iDoNotKnow',
      value: 'No lo sé',
      description: _('agencies.volume_do_not_know'),
    },
  ];

  const getFormInitialValues = () => {
    const initialValues = Object.keys(fieldNames).reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: '',
      }),
      {},
    );

    initialValues[fieldNames.email] = appSessionRef.current.userData.user.email;
    initialValues[fieldNames.features] = [];
    initialValues[fieldNames.volume] = '';

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

  const handleOthersFeaturesChange = () => {
    setShowMessageBox(document.getElementById('features7').checked);
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
                  <S.RadiosContainer className="dp-wrapper-volume-options" id="checkbox-group">
                    <h4>{_('agencies.label_volume')}</h4>
                    <Field name="volume">
                      {({ field }) => (
                        <ul
                          role="group"
                          aria-labelledby="checkbox-group"
                          className="dp-volume-per-month"
                        >
                          {volumeOptions.map((volumenOption) => (
                            <li key={volumenOption.id}>
                              <div className="dp-volume-option">
                                <label>
                                  <input
                                    id={volumenOption.id}
                                    type="radio"
                                    name="volumeAmount"
                                    {...field}
                                    value={volumenOption.value}
                                    checked={field.value === volumenOption.value}
                                    required
                                  />
                                  <span>{volumenOption.description}</span>
                                </label>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Field>
                  </S.RadiosContainer>
                  <div className="dp-wrapper-exclusive-features">
                    <h4>{_('exclusive_form.form_features')}</h4>
                    <div className="dp-bg-ghostwhite dp-container">
                      <div className="dp-rowflex">
                        <div className="col-sm-12 col-md-6">
                          <Field name="features">
                            {({ field }) => (
                              <ul className="dp-exclusive-features-list field-group">
                                <>
                                  {featureOptions.map((featureOption) => (
                                    <CheckboxFieldItem
                                      fieldName={featureOption.name}
                                      key={featureOption.id}
                                      label={featureOption.value}
                                      id={featureOption.id}
                                      value={featureOption.value}
                                    />
                                  ))}
                                  <CheckboxFieldItem
                                    fieldName="features"
                                    key="features7"
                                    label={_('exclusive_form.others')}
                                    id="features7"
                                    value={_('exclusive_form.others')}
                                    onChange={handleOthersFeaturesChange}
                                  />
                                </>
                              </ul>
                            )}
                          </Field>
                        </div>
                        <div className="col-sm-12 col-md-6">
                          <Field name="features">
                            {({ field }) => (
                              <ul className="dp-exclusive-features-list field-group">
                                {featureOptionsPart2.map((featureOption) => (
                                  <CheckboxFieldItem
                                    fieldName={featureOption.name}
                                    label={featureOption.value}
                                    id={featureOption.id}
                                    key={featureOption.id}
                                    value={featureOption.value}
                                  />
                                ))}
                              </ul>
                            )}
                          </Field>
                        </div>
                        {showMessageBox ? (
                          <div className="col-sm-12 col-md-8">
                            <Field
                              component="textarea"
                              name={fieldNames.message}
                              id={fieldNames.message}
                              placeholder={_('exclusive_form.message')}
                            />
                          </div>
                        ) : null}
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
