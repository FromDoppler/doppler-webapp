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
import { getCountries, getFormInitialValues } from '../../../../utils';
import { Loading } from '../../../Loading/Loading';

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

export const ContactInformation = InjectAppServices(
  ({
    dependencies: { dopplerUserApiClient, staticDataClient },
    handleSaveAndContinue,
    showTitle,
  }) => {
    const [state, setState] = useState({ loading: true });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [states, setStates] = useState([]);
    const createTimeout = useTimeout();
    const intl = useIntl();

    useEffect(() => {
      const getIndustries = async (language) => {
        const data = await staticDataClient.getIndustriesData(language);
        const industries = data.success
          ? Object.keys(data.value).map((key) => ({ key: key, value: data.value[key] }))
          : [];

        return industries.sort((a, b) =>
          a.value.localeCompare(b.value, undefined, { sensitivity: 'base' }),
        );
      };

      const fetchData = async () => {
        const contactInformationResult = await dopplerUserApiClient.getContactInformationData();
        const industries = await getIndustries(intl.locale);
        const result = await staticDataClient.getStatesData(
          contactInformationResult.success ? contactInformationResult.value.country : 'ar',
          intl.locale,
        );

        setStates(result.success ? result.value : []);

        setState({
          contactInformation: contactInformationResult.success
            ? contactInformationResult.value
            : null,
          success: contactInformationResult.success,
          industries,
          loading: false,
        });
      };
      fetchData();
    }, [dopplerUserApiClient, staticDataClient, intl.locale]);

    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const defaultOption = { key: '', value: _('checkoutProcessForm.empty_option_select') };
    const language = intl.locale;

    const _getFormInitialValues = () => {
      let initialValues = getFormInitialValues(fieldNames);

      if (state.contactInformation) {
        initialValues = { ...state.contactInformation };
      }

      return initialValues;
    };

    const changeCountry = async (e, setFieldValue) => {
      const country = e.target.value;
      setFieldValue(fieldNames.country, country);
      const result = await staticDataClient.getStatesData(country, language);
      setStates(result.success ? result.value : []);
    };

    const submitContactInformationForm = async (values) => {
      setFormSubmitted(false);

      const result = await dopplerUserApiClient.updateContactInformation(values);
      if (result.success) {
        setFormSubmitted(true);
        createTimeout(() => {
          setFormSubmitted(false);
          handleSaveAndContinue();
        }, 3000);
      }
    };

    return (
      <>
        {showTitle ? (
          <div className="dp-accordion-thumb">
            {_('checkoutProcessForm.contact_information_title')}
          </div>
        ) : null}
        {state.loading ? (
          <Loading />
        ) : (
          <Formik onSubmit={submitContactInformationForm} initialValues={_getFormInitialValues()}>
            {({ setFieldValue }) => (
              <Form className="dp-form-payment-process">
                <legend>{_('checkoutProcessForm.contact_information_title')}</legend>
                <fieldset>
                  <FieldGroup>
                    <FieldItem className="field-item">
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
                    </FieldItem>
                    <FieldItem className="field-item">
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
                    </FieldItem>
                    <FieldItem className="field-item">
                      <FieldGroup>
                        <SelectFieldItem
                          fieldName={fieldNames.province}
                          id="province"
                          label={`*${_('checkoutProcessForm.contact_information_province')}`}
                          defaultOption={defaultOption}
                          values={states}
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
                          onChange={(e) => {
                            changeCountry(e, setFieldValue);
                          }}
                        />
                      </FieldGroup>
                    </FieldItem>
                    <FieldItem className="field-item">
                      <FieldGroup>
                        <InputFieldItem
                          type="text"
                          fieldName={fieldNames.zipCode}
                          id="zipCode"
                          label={`${_('checkoutProcessForm.contact_information_zip_code')}`}
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
                    </FieldItem>
                    <FieldItem className="field-item">
                      <FieldGroup>
                        <InputFieldItem
                          type="text"
                          fieldName={fieldNames.company}
                          id="company"
                          label={`${_('checkoutProcessForm.contact_information_company')}`}
                          className="field-item--50"
                        />
                        <SelectFieldItem
                          fieldName={fieldNames.industry}
                          id="industry"
                          label={`*${_('checkoutProcessForm.contact_information_industry')}`}
                          defaultOption={defaultOption}
                          values={state.industries}
                          required
                          className="field-item--50"
                          //onChange={(e) => {console.log(e.target.value)}}
                        />
                      </FieldGroup>
                    </FieldItem>
                    <FieldItem className="field-item">
                      {formSubmitted ? (
                        <div className="dp-wrap-message dp-wrap-success m-b-12">
                          <span className="dp-message-icon"></span>
                          <div className="dp-content-message">
                            <p>{_('checkoutProcessForm.success_msg')}</p>
                          </div>
                        </div>
                      ) : null}
                      <div className="dp-buttons-actions">
                        <SubmitButton className="dp-button button-medium primary-green">
                          {_('checkoutProcessForm.save_continue')}
                        </SubmitButton>
                      </div>
                    </FieldItem>
                  </FieldGroup>
                </fieldset>
              </Form>
            )}
          </Formik>
        )}
      </>
    );
  },
);
