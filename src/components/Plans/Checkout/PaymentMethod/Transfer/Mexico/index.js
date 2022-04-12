import React, { useEffect, useState } from 'react';
import {
  FieldGroup,
  FieldItem,
  InputFieldItem,
  CuitFieldItem,
  SelectFieldItem,
} from '../../../../../form-helpers/form-helpers';
import { fieldNames, paymentType } from '../../PaymentMethod';
import { useFormikContext } from 'formik';
import { useIntl } from 'react-intl';
import { validateCuit } from '../../../../../../validations';
import { identificationTypes } from '../Transfer';
import { InjectAppServices } from '../../../../../../services/pure-di';

export const TransferMexico = InjectAppServices(
  ({ dependencies: { staticDataClient }, paymentMethod, readOnly, consumerTypes }) => {
    const { values, setValues } = useFormikContext();
    const [cfdis, setFdis] = useState([]);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [paymentways, setPaymentWays] = useState([]);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    useEffect(() => {
      setValues({
        [fieldNames.consumerType]: paymentMethod.idConsumerType ?? '',
        [fieldNames.identificationNumber]: paymentMethod.identificationNumber,
        [fieldNames.businessName]: paymentMethod.razonSocial,
        [fieldNames.cfdi]: paymentMethod.useCFDI,
        [fieldNames.paymentType]: paymentMethod.paymentType,
        [fieldNames.paymentWay]: paymentMethod.paymentWay,
        [fieldNames.bankName]: paymentMethod.bankName,
        [fieldNames.bankAccount]: paymentMethod.bankAccount,
        [fieldNames.paymentMethodName]: paymentType.transfer,
      });
    }, [paymentMethod, paymentType]);

    useEffect(() => {
      const fetchData = async () => {
        const language = intl.locale;

        // cfdi values
        const cfdiResponse = await staticDataClient.getUseCfdiData(language);
        const cfdiMapped = cfdiResponse.success
          ? Object.keys(cfdiResponse.value).map((key) => ({ key, value: cfdiResponse.value[key] }))
          : [];
        setFdis(cfdiMapped);

        // payment types values
        const paymentTypesResponse = await staticDataClient.getPaymentTypesData(language);
        const paymentTypesMapped = paymentTypesResponse.success
          ? Object.keys(paymentTypesResponse.value).map((key) => ({
              key,
              value: paymentTypesResponse.value[key],
            }))
          : [];
        setPaymentTypes(paymentTypesMapped);

        // payment ways values
        const paymentWaysResponse = await staticDataClient.getPaymentWaysData(language);
        const paymentWaysMapped = paymentWaysResponse.success
          ? Object.keys(paymentWaysResponse.value).map((key) => ({
              key,
              value: paymentWaysResponse.value[key],
            }))
          : [];
        setPaymentWays(paymentWaysMapped);
      };

      if (!readOnly) {
        fetchData();
      }
    }, [intl, staticDataClient, readOnly]);

    if (readOnly) {
      return (
        <li aria-label="resume data" className="field-item field-item--70 dp-p-r">
          <label>
            {identificationTypes.find((ct) => ct.key === values[fieldNames.consumerType])?.value}:{' '}
            {values[fieldNames.identificationNumber]},{' '}
            {_('checkoutProcessForm.payment_method.business_name')}:{' '}
            {values[fieldNames.businessName]}
          </label>
        </li>
      );
    }

    return (
      <div role="none" aria-label="transfer mexico fields">
        <FieldItem className="field-item">
          <FieldGroup>
            <SelectFieldItem
              fieldName={fieldNames.consumerType}
              id={fieldNames.consumerType}
              label={`*${_('checkoutProcessForm.payment_method.consumer_type')}`}
              defaultOption={{ key: '', value: _('checkoutProcessForm.empty_option_select') }}
              values={consumerTypes}
              required
              className="field-item field-item--70 dp-p-r"
            />
            {values.consumerType && (
              <CuitFieldItem
                type="text"
                aria-label="identificationNumber"
                fieldName={fieldNames.identificationNumber}
                id={fieldNames.identificationNumber}
                label={`*${
                  identificationTypes.find((ct) => ct.key === values.consumerType).value
                }:`}
                maxLength={11}
                required
                validate={false}
                className="field-item field-item--30"
                validateIdentificationNumber={validateCuit}
              />
            )}
          </FieldGroup>
        </FieldItem>
        {values[fieldNames.consumerType] && (
          <>
            <FieldItem className="field-item">
              <FieldGroup>
                <InputFieldItem
                  type="text"
                  fieldName={fieldNames.businessName}
                  id={fieldNames.businessName}
                  label={`*${_('checkoutProcessForm.payment_method.business_name')}`}
                  withNameValidation
                  required
                  className="field-item field-item--50 dp-p-r"
                />
                <SelectFieldItem
                  fieldName={fieldNames.cfdi}
                  id={fieldNames.cfdi}
                  label={`*${_('checkoutProcessForm.payment_method.cfdi')}`}
                  defaultOption={{ key: '', value: _('checkoutProcessForm.empty_option_select') }}
                  values={cfdis}
                  required
                  className="field-item field-item--50"
                />
              </FieldGroup>
            </FieldItem>
            <FieldItem className="field-item">
              <FieldGroup>
                <SelectFieldItem
                  fieldName={fieldNames.paymentType}
                  id={fieldNames.paymentType}
                  label={`*${_('checkoutProcessForm.payment_method.title')}`}
                  defaultOption={{ key: '', value: _('checkoutProcessForm.empty_option_select') }}
                  values={paymentTypes}
                  required
                  className="field-item field-item--50 dp-p-r"
                />
                <SelectFieldItem
                  fieldName={fieldNames.paymentWay}
                  id={fieldNames.paymentWay}
                  label={`*${_('checkoutProcessForm.payment_method.payment_way')}`}
                  defaultOption={{ key: '', value: _('checkoutProcessForm.empty_option_select') }}
                  values={paymentways}
                  required
                  className="field-item field-item--50"
                />
              </FieldGroup>
            </FieldItem>
            {values[fieldNames.paymentWay] === 'TRANSFER' && (
              <FieldItem className="field-item">
                <FieldGroup>
                  <InputFieldItem
                    type="text"
                    fieldName={fieldNames.bankName}
                    id={fieldNames.bankName}
                    label={`*${_('checkoutProcessForm.payment_method.bank_name')}`}
                    withNameValidation
                    required
                    className="field-item field-item--50 dp-p-r"
                  />
                  <InputFieldItem
                    type="text"
                    fieldName={fieldNames.bankAccount}
                    id={fieldNames.bankAccount}
                    label={`*${_('checkoutProcessForm.payment_method.bank_account')}`}
                    minLength={4}
                    maxLength={4}
                    required
                    className="field-item field-item--50 dp-p-r"
                  />
                </FieldGroup>
              </FieldItem>
            )}
          </>
        )}
      </div>
    );
  },
);
