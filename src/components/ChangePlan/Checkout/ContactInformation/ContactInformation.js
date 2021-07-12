import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl } from 'react-intl';
import useTimeout from '../../../../hooks/useTimeout';
import {
  FieldGroup,
  FieldItem,
  InputFieldItem,
  PhoneFieldItem,
  SelectFieldItem,
  SubmitButton,
} from '../../../form-helpers/form-helpers';
import { Form, Formik } from 'formik';
import { getCountries } from '../../../../utils';
import { Loading } from '../../../Loading/Loading';

export const ContactInformation = InjectAppServices(
  ({ dependencies: { dopplerUserApiClient }, handleSaveAndContinue, onComplete }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const defaultOption = { key: '', value: _('checkoutProcessForm.empty_option_select') };
    const language = intl.locale;
    const [state, setState] = useState({ loading: true });

    const fieldNames = {
      firstname: 'firstname',
      lastname: 'lastname',
      address: 'address',
      city: 'city',
      province: 'province',
      country: 'country',
      zipCode: 'zipCode',
      phone: 'phone',
      company: 'company',
      industry: 'industry',
    };

    useEffect(() => {
      const fetchData = async () => {
        const contactInformationResult = await dopplerUserApiClient.getContactInformationData();

        if (contactInformationResult.success) {
          onComplete(contactInformationResult.value.completed);
        }

        setState({
          contactInformation: contactInformationResult.success
            ? contactInformationResult.value
            : null,
          success: contactInformationResult.success,
          loading: false,
        });
      };
      fetchData();
    }, [dopplerUserApiClient]);

    const getFormInitialValues = () => {
      let initialValues = Object.keys(fieldNames).reduce(
        (accumulator, currentValue) => ({
          ...accumulator,
          [currentValue]: '',
        }),
        {},
      );

      if (state.contactInformation) {
        initialValues = { ...state.contactInformation };
      }

      return initialValues;
    };

    const [formSubmitted, setFormSubmitted] = useState(false);
    const createTimeout = useTimeout();

    const submitContactInformationForm = async (values, { setSubmitting }) => {
      setFormSubmitted(false);

      const result = await dopplerUserApiClient.createOrUpdateContactInformation(values);
      if (result.success) {
        setFormSubmitted(true);
        createTimeout(() => {
          setFormSubmitted(false);
          handleSaveAndContinue();
        }, 3000);
      }
    };

    /* TODO: These styles will be removed with the correct classes. Currently Gus is working with the layout. */
    const containerStyle = {
      paddingLeft: '20px',
      paddingTop: '20px',
      paddingRight: '20px',
      border: '2px solid #eaeaea',
      borderRadius: '3px',
    };
    const containerMessageSucces = { padding: '0px' };
    const flextStartSyle = { justifyContent: 'flex-start' };
    const displaFlexAndjustifyContentSpaceBetweenStyle = {
      display: 'flex',
      justifyContent: 'space-between',
    };

    return (
      <>
        {state.loading ? (
          <Loading />
        ) : (
          <div className="dp-wrapper-form-plans contact-information" style={containerStyle}>
            <div style={displaFlexAndjustifyContentSpaceBetweenStyle}>
              <h3>{_('checkoutProcessForm.contact_information_title')}</h3>
            </div>
            <Formik onSubmit={submitContactInformationForm} initialValues={getFormInitialValues()}>
              <Form>
                <fieldset>
                  <FieldGroup>
                    <FieldItem className="field-item">
                      <fieldset>
                        <FieldGroup>
                          <InputFieldItem
                            type="text"
                            fieldName={fieldNames.firstname}
                            id="firstname"
                            label={`*${_('checkoutProcessForm.contact_information_firstname')}`}
                            withNameValidation
                            required
                            className="field-item--50"
                          />
                          <InputFieldItem
                            type="text"
                            label={`*${_('checkoutProcessForm.contact_information_lastname')}`}
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
                          <InputFieldItem
                            type="text"
                            fieldName={fieldNames.address}
                            id="address"
                            label={`*${_('checkoutProcessForm.contact_information_address')}`}
                            withNameValidation
                            required
                            className="field-item--50"
                          />
                          <InputFieldItem
                            type="text"
                            label={`*${_('checkoutProcessForm.contact_information_city')}`}
                            fieldName={fieldNames.city}
                            id="city"
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
                          <InputFieldItem
                            type="text"
                            fieldName={fieldNames.province}
                            id="province"
                            label={`*${_('checkoutProcessForm.contact_information_province')}`}
                            withNameValidation
                            required
                            className="field-item--50"
                          />
                          <SelectFieldItem
                            fieldName={fieldNames.country}
                            id="country"
                            label={`*${_('checkoutProcessForm.contact_information_country')}`}
                            defaultOption={defaultOption}
                            values={getCountries(language)}
                            required
                            className="field-item--50"
                          />
                        </FieldGroup>
                      </fieldset>
                    </FieldItem>
                    <FieldItem className="field-item">
                      <fieldset>
                        <FieldGroup>
                          <InputFieldItem
                            type="text"
                            fieldName={fieldNames.zipCode}
                            id="zipCode"
                            label={`*${_('checkoutProcessForm.contact_information_zip_code')}`}
                            withNameValidation
                            className="field-item--50"
                          />
                          <PhoneFieldItem
                            fieldName={fieldNames.phone}
                            id="phone"
                            label={`*${_('checkoutProcessForm.contact_information_phone')}`}
                            placeholder={_('forms.placeholder_phone')}
                            className="field-item--50"
                            required
                          />
                        </FieldGroup>
                      </fieldset>
                    </FieldItem>
                    <FieldItem className="field-item">
                      <fieldset>
                        <FieldGroup>
                          <InputFieldItem
                            type="text"
                            fieldName={fieldNames.company}
                            id="company"
                            label={`${_('checkoutProcessForm.contact_information_company')}`}
                            className="field-item--50"
                          />
                          <InputFieldItem
                            type="text"
                            label={`${_('checkoutProcessForm.contact_information_industry')}`}
                            fieldName={fieldNames.industry}
                            required
                            id="industry"
                            className="field-item--50"
                          />
                        </FieldGroup>
                      </fieldset>
                    </FieldItem>
                  </FieldGroup>
                  {formSubmitted ? (
                    <div className="dp-wrap-confirmation" style={containerMessageSucces}>
                      <div className="dp-msj-confirmation bounceIn" style={flextStartSyle}>
                        <p>{_('checkoutProcessForm.success_msg')}</p>
                      </div>
                    </div>
                  ) : null}
                  <div className="dp-footer-form" style={flextStartSyle}>
                    <div className="dp-action">
                      <SubmitButton className="dp-button button-medium primary-green">
                        {_('checkoutProcessForm.save_continue')}
                      </SubmitButton>
                    </div>
                  </div>
                </fieldset>
              </Form>
            </Formik>
          </div>
        )}
      </>
    );
  },
);
