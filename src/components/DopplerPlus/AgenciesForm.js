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
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Breadcrumb, BreadcrumbItem } from '../shared/Breadcrumb/Breadcrumb';

const AgenciesForm = ({ dependencies: { dopplerLegacyClient, appSessionRef } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

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
    initialValues[fieldNames.volume] = '';

    return initialValues;
  };

  const [formSubmitted, setFormSubmitted] = useState(false);

  const validate = () => {
    setFormSubmitted(false);
  };

  const submitAgenciesForm = async (values, { setSubmitting }) => {
    setFormSubmitted(false);
    try {
      const result = await dopplerLegacyClient.requestAgenciesDemo(values);
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
        <title>{'Agencies'}</title>
        <meta name="description" content={'Agencies'} />
      </Helmet>
      <HeaderSection>
        <div className="col-sm-12 col-md-12 col-lg-12">
          <Breadcrumb>
            <BreadcrumbItem href={_('agencies.breadcrumb_url')} text={_('agencies.breadcrumb')} />
            <BreadcrumbItem text={_('agencies.title')} />
          </Breadcrumb>
          <h2>{_('agencies.title')}</h2>
          {<FormattedMessageMarkdown id="agencies.subtitle_MD" />}
        </div>
      </HeaderSection>

      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-lg-8 col-md-12 m-b-24">
            <div className="dp-wrapper-form-plans">
              <h3>{_('agencies.form_legend')}</h3>
              <FormWithCaptcha
                onSubmit={submitAgenciesForm}
                initialValues={getFormInitialValues()}
                validate={validate}
              >
                <legend>{_('agencies.form_legend')}</legend>
                <fieldset>
                  <FieldGroup>
                    <EmailFieldItem
                      autoFocus
                      type="email"
                      fieldName={fieldNames.email}
                      label={`*${_('forms.label_email')}`}
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
                            label={`*${_('forms.label_firstname')}`}
                            withNameValidation
                            required
                            className="field-item--50"
                          />
                          <InputFieldItem
                            type="text"
                            label={`*${_('forms.label_lastname')}`}
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
                            label={`*${_('forms.label_phone')}`}
                            placeholder={_('forms.placeholder_phone')}
                            className="field-item--50"
                            required
                          />
                          <InputFieldItem
                            fieldName={fieldNames.range_time}
                            type="text"
                            label={_('forms.label_contact_schedule')}
                            id="range_time"
                            className="field-item--50"
                          />
                        </FieldGroup>
                      </fieldset>
                    </FieldItem>
                  </FieldGroup>
                  <div className="dp-wrapper-volume-options">
                    <h4>{_('agencies.label_volume')}</h4>
                    <Field name="volume">
                      {({ field }) => (
                        <ul className="dp-volume-per-month">
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
                                  />
                                  <span>{volumenOption.description}</span>
                                </label>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Field>
                  </div>
                  <div className="dp-container">
                    <div className="dp-rowflex">
                      <div className="dp-footer-form">
                        {formSubmitted ? (
                          <>
                            <div className="dp-wrap-confirmation">
                              <div className="dp-msj-confirmation bounceIn">
                                <p>{_('agencies.success_msg')}</p>
                              </div>
                            </div>
                            <div className="dp-action">
                              <a
                                href={_('common.draft_url')}
                                className="dp-button button-medium primary-green"
                              >
                                {_('agencies.submitted')}
                              </a>
                            </div>
                          </>
                        ) : (
                          <div className="dp-action">
                            <SubmitButton className="dp-button button-medium primary-green">
                              {_('agencies.submit')}
                            </SubmitButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </fieldset>
              </FormWithCaptcha>
            </div>
          </div>
          <div className="col-lg-3 col-sm-12">
            <div className="dp-plans-feature">
              <h4>{_('agencies.features_title')}</h4>
              <ul className="dp-feature-list">
                <li>
                  <span>
                    <span className="dp-icodot">.</span>
                    <span>{_('agencies.feature_1')}</span>
                  </span>
                </li>
                <li>
                  <span>
                    <span className="dp-icodot">.</span>
                    <span>{_('agencies.feature_2')}</span>
                  </span>
                </li>
                <li>
                  <span className="dp-icodot">.</span>
                  <span>{_('agencies.feature_3')}</span>
                </li>
                <li>
                  <span className="dp-icodot">.</span>
                  <span>{_('agencies.feature_4')}</span>
                </li>
                <li>
                  <span className="dp-icodot">.</span>
                  <span>{_('agencies.feature_5')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(AgenciesForm);
