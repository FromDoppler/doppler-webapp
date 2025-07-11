import { FormattedMessage, useIntl } from 'react-intl';
import {
  CheckboxFieldItemAccessible,
  EmailFieldItem,
  FieldGroup,
  FormWithCaptcha,
  InputFieldItem,
  PhoneFieldItem,
  SubmitButton,
} from '../../../form-helpers/form-helpers';
import { getFormInitialValues } from '../../../../utils';
import { InjectAppServices } from '../../../../services/pure-di';
import * as S from './styles';
import { Field } from 'formik';
import { useState } from 'react';
import useTimeout from '../../../../hooks/useTimeout';
import { useQueryParams } from '../../../../hooks/useQueryParams';

const fieldNames = {
  email: 'email',
  firstname: 'firstname',
  lastname: 'lastname',
  phone: 'phone',
  range_time: 'range_time',
  features: 'features',
  accept_privacy_policies: 'accept_privacy_policies',
  volume: 'volume',
};

export const GoBackButton = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <button
      type="button"
      className="dp-button button-medium ctaTertiary m-r-18"
      onClick={() => window.history.back()}
    >
      {_('plan_calculator.button_back')}
    </button>
  );
};

export const DELAY_BEFORE_REDIRECT_TO_BACK = 3000;

export const AdditionalServicesForm = InjectAppServices(
  ({ dependencies: { appSessionRef, dopplerBillingUserApiClient } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const createTimeout = useTimeout();
    const query = useQueryParams();
    const selectedFeature = query.get('selected-feature') ?? '';

    const volumeOptions = [
      {
        id: 'lessThan500k',
        value: 'Menos de 500',
        description: _('my_plan.addtional_services.forms.volume_0'),
      },
      {
        id: 'between500kAnd1m',
        value: 'Entre 500k y 1m',
        description: _('my_plan.addtional_services.forms.volume_500'),
      },
      {
        id: 'between1mAnd10m',
        value: 'Entre 1m y 10m',
        description: _('my_plan.addtional_services.forms.volume_1m'),
      },
      {
        id: 'moreThan10m',
        value: 'Más de 10m',
        description: _('my_plan.addtional_services.forms.volume_10m'),
      },
    ];

    const featureOptions = [
      {
        id: 'features1',
        value: _('my_plan.addtional_services.forms.features.custom_onboarding'),
        name: 'features',
      },
      {
        id: 'features2',
        value: _('my_plan.addtional_services.forms.features.sms_sending_and_automation'),
        name: 'features',
      },
      {
        id: 'features3',
        value: _('my_plan.addtional_services.forms.features.transactional_emails'),
        name: 'features',
      },
      {
        id: 'features4',
        value: _('my_plan.addtional_services.forms.features.strategic_support'),
        name: 'features',
      },
      {
        id: 'features5',
        value: _('my_plan.addtional_services.forms.features.layout_service'),
        name: 'features',
      },
      {
        id: 'features6',
        value: _('my_plan.addtional_services.forms.features.landing_page_package'),
        name: 'features',
      },
      {
        id: 'features7',
        value: _('my_plan.addtional_services.forms.features.list_conditioning'),
        name: 'features',
      },
      {
        id: 'features8',
        value: _('my_plan.addtional_services.forms.features.dedicated_environment'),
        name: 'features',
      },
      {
        id: 'features9',
        value: _('my_plan.addtional_services.forms.features.conversations'),
        name: 'features',
      },
      {
        id: 'features10',
        value: _('my_plan.addtional_services.forms.features.custom_reports'),
        name: 'features',
      },
      {
        id: 'features11',
        value: _('my_plan.addtional_services.forms.features.dedicated_ip'),
        name: 'features',
      },
    ];

    const _getFormInitialValues = () => {
      const initialValues = getFormInitialValues(fieldNames);

      var feature = featureOptions.filter((f) => f.id === selectedFeature)[0];

      initialValues[fieldNames.email] = appSessionRef.current.userData.user.email;
      initialValues[fieldNames.features] = feature !== undefined ? [feature.value] : [];
      initialValues[fieldNames.volume] = 'Menos de 500';
      initialValues[fieldNames.accept_privacy_policies] = '';

      return initialValues;
    };

    const validate = (values) => {
      setFormSubmitted(false);
      const errors = {};
      if (!values[fieldNames.accept_privacy_policies]) {
        errors[fieldNames.accept_privacy_policies] = 'validation_messages.error_checkbox_policy';
      }
      return errors;
    };

    const mapAdditionalServicesRequestModel = (values) => {
      const selectedFeatures = values.features.map(function (item, i) {
        const filteredFeature = featureOptions.filter((fo) => fo.value === item)[0].id;
        return filteredFeature;
      });

      const data = {
        Email: values.email,
        Firstname: values.firstname,
        Lastname: values.lastname,
        Phone: values.phone,
        ContactSchedule: values.range_time,
        Features: selectedFeatures,
        SendingVolume: values.volume,
      };

      return data;
    };

    const onSubmit = async (values) => {
      setFormSubmitted(true);
      const result = await dopplerBillingUserApiClient.requestAdditionalServices(
        mapAdditionalServicesRequestModel(values),
      );
      if (result) {
        createTimeout(() => {
          window.history.back();
        }, DELAY_BEFORE_REDIRECT_TO_BACK);
      }
    };

    return (
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-lg-8 col-md-12 m-b-24">
            <div className="dp-wrapper-additional-services-form">
              <FormWithCaptcha
                onSubmit={onSubmit}
                initialValues={_getFormInitialValues()}
                validate={validate}
              >
                <fieldset>
                  <FieldGroup>
                    <EmailFieldItem
                      autoFocus
                      type="email"
                      fieldName={fieldNames.email}
                      label={_('my_plan.addtional_services.forms.label_email')}
                      id="email"
                      required
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <InputFieldItem
                      type="text"
                      fieldName={fieldNames.firstname}
                      id="firstname"
                      label={_('my_plan.addtional_services.forms.label_firstname')}
                      withNameValidation
                      required
                      className="field-item--50"
                    />
                    <InputFieldItem
                      type="text"
                      label={_('my_plan.addtional_services.forms.label_lastname')}
                      fieldName={fieldNames.lastname}
                      id="lastname"
                      withNameValidation
                      required
                      className="field-item--50"
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <PhoneFieldItem
                      fieldName={fieldNames.phone}
                      label={_('signup.label_phone')}
                      placeholder={_('my_plan.addtional_services.forms.placeholder_phone')}
                      className="field-item--50"
                      required
                    />
                    <InputFieldItem
                      fieldName={fieldNames.range_time}
                      type="text"
                      label={_('my_plan.addtional_services.forms.label_contact_schedule')}
                      id="range_time"
                      className="field-item--50"
                    />
                  </FieldGroup>
                  <S.RadiosContainer
                    className="dp-wrapper-additional-services-form-volume-options"
                    id="checkbox-group"
                  >
                    <label>{_('my_plan.addtional_services.forms.label_volume')}</label>
                    <Field name={fieldNames.volume}>
                      {({ field }) => (
                        <ul
                          role="group"
                          aria-labelledby="checkbox-group"
                          className="dp-additional-services-form-volume-per-month"
                        >
                          {volumeOptions.map((volumenOption) => (
                            <li key={volumenOption.id}>
                              <div className="dp-additional-services-form-volume-option">
                                <label>
                                  <input
                                    id={volumenOption.id}
                                    type="radio"
                                    name={fieldNames.volume}
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
                  <div className="dp-wrapper-additional-services-form-exclusive-features">
                    <label>{_('my_plan.addtional_services.forms.features.features_label')}</label>
                    <ul className="dp-additional-services-form-exclusive-features-list field-group">
                      <div className="dp-rowflex">
                        <Field name="features">
                          {({ field }) => (
                            <>
                              {featureOptions.map((featureOption) => (
                                <div className="col-sm-12 col-md-4" key={`div_${featureOption.id}`}>
                                  <FieldGroup className="dp-items-accept">
                                    <CheckboxFieldItemAccessible
                                      className={'label--policy'}
                                      fieldName={featureOption.name}
                                      key={featureOption.id}
                                      label={featureOption.value}
                                      id={featureOption.id}
                                      value={featureOption.value}
                                      checkRequired={true}
                                    />
                                  </FieldGroup>
                                </div>
                              ))}
                            </>
                          )}
                        </Field>
                      </div>
                    </ul>
                  </div>
                  <hr />
                  <div className="dp-wrapper-additional-services-content-accept-and-buttons">
                    <FieldGroup className="dp-items-accept">
                      <CheckboxFieldItemAccessible
                        fieldName={fieldNames.accept_privacy_policies}
                        className={'label--policy'}
                        label={
                          <FormattedMessage
                            values={{
                              Link: (chunk) => (
                                <a
                                  href={_(
                                    'my_plan.addtional_services.forms.privacy_policy_consent_url',
                                  )}
                                  target="_blank"
                                >
                                  {chunk}
                                </a>
                              ),
                            }}
                            id="my_plan.addtional_services.forms.privacy_policy_consent_MD"
                          />
                        }
                        checkRequired
                        withSubmitCount={false}
                      />
                    </FieldGroup>
                    {formSubmitted ? (
                      <div className="dp-wrap-confirmation">
                        <div className="dp-msj-confirmation bounceIn">
                          <p>{_('my_plan.addtional_services.forms.success_message')}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="dp-action">
                        <GoBackButton />
                        <SubmitButton>
                          {_('my_plan.addtional_services.forms.send_button')}
                        </SubmitButton>
                      </div>
                    )}
                  </div>
                </fieldset>
              </FormWithCaptcha>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
