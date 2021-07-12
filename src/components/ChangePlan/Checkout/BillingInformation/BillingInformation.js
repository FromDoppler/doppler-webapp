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
  CheckboxFieldItem,
} from '../../../form-helpers/form-helpers';
import { Form, Formik } from 'formik';
import { getCountries } from '../../../../utils';
import { Loading } from '../../../Loading/Loading';

export const BillingInformation = InjectAppServices(
  ({ dependencies: { dopplerUserApiClient }, handleSaveAndContinue, onComplete }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const defaultOption = { key: '', value: _('checkoutProcessForm.empty_option_select') };
    const language = intl.locale;
    const [state, setState] = useState({ loading: true });
    const [disabled, setDisabled] = useState(true);

    const fieldNames = {
      sameAddress: 'sameAddress',
      firstname: 'firstname',
      lastname: 'lastname',
      address: 'address',
      city: 'city',
      province: 'province',
      country: 'country',
      zipCode: 'zipCode',
      phone: 'phone',
      chooseQuestion: 'chooseQuestion',
      answerQuestion: 'answerQuestion',
    };

    useEffect(() => {
      const fetchData = async () => {
        const billingInformationResult = await dopplerUserApiClient.getBillingInformationData();
        const contactInformationResult = await dopplerUserApiClient.getContactInformationData();

        if (billingInformationResult.success) {
          onComplete(billingInformationResult.value.completed);
        }

        setState({
          billingInformation: billingInformationResult.success
            ? billingInformationResult.value
            : null,
          success: billingInformationResult.success,
          loading: false,
          securityQuestions: [],
          contactInformation: contactInformationResult.value
        });

        setDisabled(billingInformationResult.success && billingInformationResult.value.sameAddress);
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

      if (state.billingInformation) {
        initialValues = { ...state.billingInformation };
        //setDisabled(state.billingInformation.sameAddress);
      }

      return initialValues;
    };

    const handleSameAddressChange = async (e, setFieldValue) => {
      const sameAddress = !disabled;
      setDisabled(sameAddress);
      if (sameAddress) {
        if (state.contactInformation) {
          setFieldValue(fieldNames.firstname, state.contactInformation.firstname);
          setFieldValue(fieldNames.lastname, state.contactInformation.lastname);
          setFieldValue(fieldNames.address, state.contactInformation.address);
          setFieldValue(fieldNames.city, state.contactInformation.city);
          setFieldValue(fieldNames.province, state.contactInformation.province);
          setFieldValue(fieldNames.country, state.contactInformation.countryId);
          setFieldValue(fieldNames.zipcode, state.contactInformation.zipCode);
          setFieldValue(fieldNames.phone, state.contactInformation.phone);
        }
      }
    };

    const [formSubmitted, setFormSubmitted] = useState(false);
    const createTimeout = useTimeout();

    const submitBillingInformationForm = async (values) => {
      setFormSubmitted(false);

      const result = await dopplerUserApiClient.updateBillingInformation(values);
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
      marginTop: '20px',
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
            <Formik onSubmit={submitBillingInformationForm} initialValues={getFormInitialValues()}>
            {({ setFieldValue }) => (
              <Form>
                <fieldset>
                  <FieldGroup>
                    <FieldItem className="field-item">
                      <fieldset>
                        <FieldGroup>
                          <CheckboxFieldItem
                            fieldName="sameAddress"
                            key="sameAddress"
                            label={_('checkoutProcessForm.billing_information_same_address')}
                            id="features7"
                            //value={_('checkoutProcessForm.billing_information_same_address')}
                            onChange={(e) => {
                              handleSameAddressChange(e, setFieldValue);
                            }}
                          />
                        </FieldGroup>
                      </fieldset>
                    </FieldItem>
                    <FieldItem className="field-item">
                      <fieldset>
                        <FieldGroup>
                          <InputFieldItem
                            type="text"
                            fieldName={fieldNames.firstname}
                            id="firstname"
                            label={`*${_('checkoutProcessForm.billing_information_firstname')}`}
                            withNameValidation
                            required
                            className="field-item--50"
                            disabled={disabled}
                            style={{ background: ` ${disabled ? '#EAEAEA' : ''}` }}
                          />
                          <InputFieldItem
                            type="text"
                            label={`*${_('checkoutProcessForm.billing_information_lastname')}`}
                            fieldName={fieldNames.lastname}
                            id="lastname"
                            withNameValidation
                            required
                            className="field-item--50"
                            disabled={disabled}
                            style={{ background: ` ${disabled ? '#EAEAEA' : ''}` }}
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
                            label={`*${_('checkoutProcessForm.billing_information_address')}`}
                            withNameValidation
                            required
                            className="field-item--50"
                            disabled={disabled}
                            style={{ background: ` ${disabled ? '#EAEAEA' : ''}` }}
                          />
                          <InputFieldItem
                            type="text"
                            label={`*${_('checkoutProcessForm.billing_information_city')}`}
                            fieldName={fieldNames.city}
                            id="city"
                            withNameValidation
                            required
                            className="field-item--50"
                            disabled={disabled}
                            style={{ background: ` ${disabled ? '#EAEAEA' : ''}` }}
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
                            label={`*${_('checkoutProcessForm.billing_information_province')}`}
                            withNameValidation
                            required
                            className="field-item--50"
                            disabled={disabled}
                            style={{ background: ` ${disabled ? '#EAEAEA' : ''}` }}
                          />
                          <SelectFieldItem
                            fieldName={fieldNames.country}
                            id="country"
                            label={`*${_('checkoutProcessForm.billing_information_country')}`}
                            defaultOption={defaultOption}
                            values={getCountries(language)}
                            required
                            className="field-item--50"
                            disabled={disabled}
                            style={{ background: ` ${disabled ? '#EAEAEA' : ''}` }}
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
                            label={`${_('checkoutProcessForm.billing_information_zip_code')}`}
                            withNameValidation
                            className="field-item--50"
                            disabled={disabled}
                            style={{ background: ` ${disabled ? '#EAEAEA' : ''}` }}
                          />
                          <PhoneFieldItem
                            fieldName={fieldNames.phone}
                            id="phone"
                            label={`*${_('checkoutProcessForm.billing_information_phone')}`}
                            placeholder={_('forms.placeholder_phone')}
                            className="field-item--50"
                            required
                            disabled={disabled}
                            style={{ background: ` ${disabled ? '#EAEAEA' : ''}` }}
                          />
                        </FieldGroup>
                      </fieldset>
                    </FieldItem>
                    <FieldItem className="field-item">
                      <fieldset>
                        <FieldGroup>
                          <SelectFieldItem
                            fieldName={fieldNames.chooseQuestion}
                            id="chooseQuestion"
                            defaultOption={defaultOption}
                            label={`*${_(
                              'checkoutProcessForm.billing_information_choose_question',
                            )}`}
                            values={state.securityQuestions}
                            //required
                            className="field-item"
                          />
                        </FieldGroup>
                      </fieldset>
                    </FieldItem>
                    <FieldItem className="field-item">
                      <fieldset>
                        <FieldGroup>
                          <InputFieldItem
                            type="text"
                            label={`*${_(
                              'checkoutProcessForm.billing_information_answer_question',
                            )}`}
                            fieldName={fieldNames.answerQuestion}
                            id="answerQuestion"
                            className="field-item"
                            //required
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
              )}
            </Formik>
          </div>
        )}
      </>
    );
  },
);
