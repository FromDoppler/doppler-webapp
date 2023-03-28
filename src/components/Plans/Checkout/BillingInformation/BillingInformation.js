import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl } from 'react-intl';
import {
  FieldGroup,
  FieldItem,
  InputFieldItem,
  PhoneFieldItem,
  SelectFieldItem,
  CheckboxFieldItem,
  SubmitButton,
} from '../../../form-helpers/form-helpers';
import { Form, Formik } from 'formik';
import { getCountries, getFormInitialValues } from '../../../../utils';
import { Loading } from '../../../Loading/Loading';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { InvoiceRecipients } from './InvoiceRecipients';

const fieldNames = {
  sameAddressAsContact: 'sameAddressAsContact',
  firstname: 'firstname',
  lastname: 'lastname',
  address: 'address',
  city: 'city',
  province: 'province',
  country: 'country',
  zipCode: 'zipCode',
  phone: 'phone',
};

const getBillingInformation = (contactInformation) => {
  return {
    firstname: contactInformation.firstname,
    lastname: contactInformation.lastname,
    address: contactInformation.address,
    city: contactInformation.city,
    province: contactInformation.province,
    country: contactInformation.country,
    zipCode: contactInformation.zipCode,
    phone: contactInformation.phone,
    sameAddressAsContact: true,
  };
};

export const BillingInformation = InjectAppServices(
  ({
    dependencies: { dopplerUserApiClient, dopplerBillingUserApiClient, staticDataClient },
    handleSaveAndContinue,
    showTitle,
  }) => {
    const [state, setState] = useState({ loading: true });
    const [states, setStates] = useState([]);
    const [sameAddressInformation, setSameAddressInformation] = useState(false);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const defaultOption = { key: '', value: _('checkoutProcessForm.empty_option_select') };
    const language = intl.locale;
    const query = useQueryParams();
    const selectedPlan = query.get('selected-plan') ?? 0;

    useEffect(() => {
      const fetchData = async () => {
        const contactInformationResult = await dopplerUserApiClient.getContactInformationData();
        const billingInformationResult =
          await dopplerBillingUserApiClient.getBillingInformationData();
        const statesResult = await staticDataClient.getStatesData(
          billingInformationResult.success && billingInformationResult.value.country !== ''
            ? billingInformationResult.value.country
            : contactInformationResult.value.country,
          intl.locale,
        );

        setStates(statesResult.success ? statesResult.value : []);

        let billingInformation = billingInformationResult.success
          ? billingInformationResult.value
          : { sameAddressAsContact: true };
        if (billingInformation?.sameAddressAsContact) {
          billingInformation = {
            ...getBillingInformation(contactInformationResult.value),
          };
        }

        setState({
          billingInformation,
          success: billingInformationResult.success,
          loading: false,
          contactInformation: contactInformationResult.value,
        });

        setSameAddressInformation(billingInformation && billingInformation.sameAddressAsContact);
      };
      fetchData();
    }, [dopplerUserApiClient, dopplerBillingUserApiClient, staticDataClient, intl.locale]);

    const _getFormInitialValues = () => {
      let initialValues = getFormInitialValues(fieldNames);

      if (state.billingInformation) {
        initialValues = { ...state.billingInformation };
      }

      return initialValues;
    };

    const handleSameAddressChange = async (e, setFieldValue) => {
      const sameAddress = !sameAddressInformation;
      setSameAddressInformation(sameAddress);

      if (sameAddress && state.contactInformation) {
        let _fieldNames = { ...fieldNames };
        delete _fieldNames.sameAddressAsContact;
        Object.keys(fieldNames).forEach((key) =>
          setFieldValue(fieldNames[key], state.contactInformation[key]),
        );
      }
    };

    const changeCountry = async (e, setFieldValue) => {
      const country = e.target.value;
      setFieldValue(fieldNames.country, country);
      const result = await staticDataClient.getStatesData(country, language);
      setStates(result.success ? result.value : []);
      setFieldValue(fieldNames.province, '');
    };

    const submitBillingInformationForm = async (values) => {
      const result = await dopplerBillingUserApiClient.updateBillingInformation(values);
      if (result.success) {
        handleSaveAndContinue();
      }
    };

    return (
      <>
        {showTitle ? (
          <div className="dp-accordion-thumb">
            {_('checkoutProcessForm.billing_information_title')}
          </div>
        ) : null}
        {state.loading ? (
          <Loading page />
        ) : (
          <>
            <Formik
              onSubmit={submitBillingInformationForm}
              initialValues={_getFormInitialValues()}
              validateOnMount={true}
            >
              {({ setFieldValue, isSubmitting, isValid, dirty }) => (
                <Form className="dp-form-billing-information">
                  <legend>{_('checkoutProcessForm.billing_information_title')}</legend>
                  <fieldset>
                    <FieldGroup>
                      <FieldItem className="field-item">
                        <fieldset>
                          <FieldGroup>
                            <CheckboxFieldItem
                              fieldName="sameAddressAsContact"
                              key="sameAddressAsContact"
                              label={_('checkoutProcessForm.billing_information_same_address')}
                              id="sameAddressAsContact"
                              onChange={(e) => {
                                handleSameAddressChange(e, setFieldValue);
                              }}
                            />
                          </FieldGroup>
                        </fieldset>
                      </FieldItem>
                      <FieldItem className="field-item">
                        <FieldGroup>
                          <InputFieldItem
                            type="text"
                            fieldName={fieldNames.firstname}
                            id="firstname"
                            label={`*${_('checkoutProcessForm.billing_information_firstname')}`}
                            withNameValidation
                            required
                            className="field-item--50 dp-p-r"
                            disabled={sameAddressInformation}
                          />
                          <InputFieldItem
                            type="text"
                            label={`*${_('checkoutProcessForm.billing_information_lastname')}`}
                            fieldName={fieldNames.lastname}
                            id="lastname"
                            withNameValidation
                            required
                            className="field-item--50"
                            disabled={sameAddressInformation}
                          />
                        </FieldGroup>
                      </FieldItem>
                      <FieldItem className="field-item">
                        <FieldGroup>
                          <InputFieldItem
                            type="text"
                            fieldName={fieldNames.address}
                            id="address"
                            label={`*${_('checkoutProcessForm.billing_information_address')}`}
                            withNameValidation
                            required
                            className="field-item--50 dp-p-r"
                            disabled={sameAddressInformation}
                          />
                          <InputFieldItem
                            type="text"
                            label={`*${_('checkoutProcessForm.billing_information_city')}`}
                            fieldName={fieldNames.city}
                            id="city"
                            withNameValidation
                            required
                            className="field-item--50"
                            disabled={sameAddressInformation}
                          />
                        </FieldGroup>
                      </FieldItem>
                      <FieldItem className="field-item">
                        <FieldGroup>
                          <SelectFieldItem
                            fieldName={fieldNames.province}
                            id="province"
                            label={`*${_('checkoutProcessForm.billing_information_province')}`}
                            defaultOption={defaultOption}
                            values={states}
                            required
                            className="field-item--50 dp-p-r"
                            disabled={sameAddressInformation}
                          />
                          <SelectFieldItem
                            fieldName={fieldNames.country}
                            id="country"
                            label={`*${_('checkoutProcessForm.billing_information_country')}`}
                            defaultOption={defaultOption}
                            values={getCountries(language)}
                            required
                            className="field-item--50"
                            onChange={(e) => {
                              changeCountry(e, setFieldValue);
                            }}
                            disabled={sameAddressInformation}
                          />
                        </FieldGroup>
                      </FieldItem>
                      <FieldItem className="field-item">
                        <FieldGroup>
                          <InputFieldItem
                            type="text"
                            fieldName={fieldNames.zipCode}
                            id="zipCode"
                            label={`${_('checkoutProcessForm.billing_information_zip_code')}`}
                            withNameValidation
                            className="field-item--50 dp-p-r"
                            disabled={sameAddressInformation}
                          />
                          <PhoneFieldItem
                            fieldName={fieldNames.phone}
                            id="phone"
                            label={`*${_('checkoutProcessForm.billing_information_phone')}`}
                            placeholder={_('forms.placeholder_phone')}
                            className={`field-item--50 ${
                              sameAddressInformation ? 'dp-flag-disabled' : ''
                            }`}
                            required
                            disabled={sameAddressInformation}
                          />
                        </FieldGroup>
                      </FieldItem>
                      <FieldItem className="field-item">
                        <InvoiceRecipients viewOnly={true} selectedPlan={selectedPlan} />
                      </FieldItem>
                      <FieldItem className="field-item">
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
          </>
        )}
      </>
    );
  },
);
