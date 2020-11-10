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

  // TODO: apply content
  // TODO: add check to accept privacy policies

  const volumeOptions = [
    {
      id: 'lessThan500k',
      value: 'Menos de 500',
      description: 'Menos de 500',
    },
    {
      id: 'between500kAnd1m',
      value: 'Entre 500k y 1m',
      description: 'Entre 500k y 1m',
    },
    {
      id: 'between1mAnd10m',
      value: 'Entre 1m y 10m',
      description: 'Entre 1m y 10m',
    },
    {
      id: 'moreThan10m',
      value: 'Más de 10m',
      description: 'Más de 10m',
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
    initialValues[fieldNames.volume] = volumeOptions[0].value;

    return initialValues;
  };

  const [formSubmitted, setFormSubmitted] = useState(false);

  const validate = () => {
    setFormSubmitted(false);
  };

  const onSubmit = async (values, { setSubmitting }) => {
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
          <h2>Plan para agencias</h2>
          <p>Gestiona y monitorea las cuentas de todos tus clientes desde un mismo lugar.</p>
        </div>
      </HeaderSection>

      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-lg-8 col-md-12 m-b-24">
            <div className="dp-wrapper-form-plans">
              <h3>Completa el siguiente formulario y te contactaremos a la brevedad</h3>
              <FormWithCaptcha
                onSubmit={onSubmit}
                initialValues={getFormInitialValues()}
                validate={validate}
              >
                <legend>Completa el siguiente formulario de planes</legend>
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
                            label="¿En que horario podemos contactarte?"
                            id="range_time"
                            className="field-item--50"
                          />
                        </FieldGroup>
                      </fieldset>
                    </FieldItem>
                  </FieldGroup>
                  <div className="dp-wrapper-volume-options">
                    <h4>Volumen de envíos por mes</h4>
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
                          <div className="dp-wrap-confirmation">
                            <div className="dp-msj-confirmation bounceIn">
                              <p>¡Excelente! Nos pondremos en contacto a la brevedad</p>
                            </div>
                          </div>
                        ) : null}
                        <div className="dp-action">
                          <SubmitButton className="dp-button button-medium primary-green">
                            Solicitar una demo
                          </SubmitButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </FormWithCaptcha>
            </div>
            <div className="dp-content-legal">
              <FormattedMessageMarkdown linkTarget={'_blank'} id="signup.legal_MD" />
            </div>
          </div>
          <div className="col-lg-3 col-sm-12">
            <div className="dp-plans-feature">
              <h4>¿Qué contempla el plan para agencias?:</h4>
              <ul className="dp-feature-list">
                <li>
                  <span className="dp-icostar"></span>
                  <span>
                    <strong>Acompañamiento Estratégico.</strong>
                  </span>
                </li>
                <li>
                  <span className="dp-icostar"></span>
                  <span>
                    <strong>Asesoría y Consultoría.</strong>
                    <span className="dp-new">Nueva</span>
                  </span>
                </li>
                <li>
                  <span className="dp-icodot">.</span>
                  <span>Lorem ipsum dolor sit amet</span>
                </li>
                <li>
                  <span className="dp-icodot">.</span>
                  <span>Campañas Test A/B</span>
                </li>
                <li>
                  <span className="dp-icodot">.</span>
                  <span>Lorem ipsum dolor sit amet</span>
                </li>
                <li>
                  <span className="dp-icodot">.</span>
                  <span>
                    Lorem ipsum dolor sit <span className="dp-new">Nueva</span>
                  </span>
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
