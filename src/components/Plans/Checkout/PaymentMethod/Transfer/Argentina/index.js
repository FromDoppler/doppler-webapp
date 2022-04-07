import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  FieldGroup,
  FieldItem,
  SelectFieldItem,
  InputFieldItem,
  CuitFieldItem,
} from '../../../../../form-helpers/form-helpers';
import { useFormikContext } from 'formik';
import { fieldNames, paymentType } from '../../PaymentMethod';
import { validateCuit } from '../../../../../../validations';
import { finalConsumer, identificationTypes } from '../Transfer';

export const TransferArgentina = ({ paymentMethod, consumerTypes, readOnly }) => {
  const { setFieldValue, setValues } = useFormikContext();
  const [consumerType, setConsumerType] = useState('');
  const [identificationType, setIdentificationType] = useState('');
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const defaultOption = { key: '', value: _('checkoutProcessForm.empty_option_select') };

  useEffect(() => {
    setValues({
      [fieldNames.identificationNumber]: paymentMethod.identificationNumber,
      [fieldNames.businessName]: paymentMethod.razonSocial,
      [fieldNames.consumerType]: paymentMethod.idConsumerType ?? '',
      [fieldNames.paymentMethodName]: paymentType.transfer,
    });

    setConsumerType(paymentMethod.idConsumerType ?? '');
    const type = identificationTypes.filter((ct) => ct.key === paymentMethod.idConsumerType)[0]
      ?.value;
    setIdentificationType(type ?? '');
  }, [
    paymentMethod.idConsumerType,
    paymentMethod.identificationNumber,
    paymentMethod.razonSocial,
    setValues,
  ]);

  const changeConsumerType = (e) => {
    const { value } = e.target;
    setFieldValue(fieldNames.consumerType, value);
    const type = identificationTypes.filter((ct) => ct.key === value)[0]?.value;
    setConsumerType(value);
    setIdentificationType(type);
    initializeDefaultValues(value);
  };

  const initializeDefaultValues = (consumerType) => {
    setValues({
      [fieldNames.identificationNumber]: '',
      [fieldNames.businessName]: '',
      [fieldNames.consumerType]: consumerType,
      [fieldNames.paymentMethodName]: paymentType.transfer,
    });
  };

  if (readOnly) {
    const selectedConsumerType = consumerTypes.find(
      (ct) => ct.key === paymentMethod?.idConsumerType,
    );
    const identificationType = identificationTypes.find(
      (it) => it.key === paymentMethod?.idConsumerType,
    );

    return (
      <li aria-label="resume data" className="field-item field-item--70 dp-p-r">
        <label>
          {selectedConsumerType?.value}, {identificationType?.value}:{' '}
          {paymentMethod?.identificationNumber}
          {identificationType.key !== finalConsumer ? `, ${paymentMethod?.razonSocial}` : ''}
        </label>
      </li>
    );
  }

  return (
    <FieldItem className="field-item">
      <FieldGroup>
        <SelectFieldItem
          fieldName={fieldNames.consumerType}
          id="consumerType"
          label={`*${_('checkoutProcessForm.payment_method.consumer_type')}`}
          defaultOption={defaultOption}
          values={consumerTypes}
          required
          className="field-item field-item--70 dp-p-r"
          onChange={(e) => {
            changeConsumerType(e);
          }}
        />
        {consumerType !== '' ? (
          <CuitFieldItem
            type="text"
            aria-label="identificationNumber"
            fieldName={fieldNames.identificationNumber}
            id="identificationNumber"
            label={`*${identificationType}:`}
            maxLength={11}
            required
            validate={consumerType !== finalConsumer}
            className="field-item field-item--30"
            validateIdentificationNumber={validateCuit}
          />
        ) : null}
        {consumerType !== '' && consumerType !== finalConsumer ? (
          <InputFieldItem
            type="text"
            fieldName={fieldNames.businessName}
            id="businessName"
            label={`*${_('checkoutProcessForm.payment_method.business_name')}`}
            withNameValidation
            required
            className="field-item field-item--70 dp-p-r"
          />
        ) : null}
      </FieldGroup>
    </FieldItem>
  );
};
