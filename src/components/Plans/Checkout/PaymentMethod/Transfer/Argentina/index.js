import React, { useEffect } from 'react';
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
  const { setValues, values } = useFormikContext();
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    setValues({
      [fieldNames.consumerType]: paymentMethod.idConsumerType ?? '',
      [fieldNames.identificationNumber]: paymentMethod.identificationNumber ?? '',
      [fieldNames.businessName]: paymentMethod.razonSocial ?? '',
      [fieldNames.paymentMethodName]: paymentType.transfer,
    });
  }, [
    paymentMethod.idConsumerType,
    paymentMethod.identificationNumber,
    paymentMethod.razonSocial,
    setValues,
  ]);

  if (readOnly) {
    return (
      <li aria-label="resume data" className="field-item field-item--70 dp-p-r">
        <label>
          {identificationTypes.find((ct) => ct.key === values[fieldNames.consumerType])?.value}:{' '}
          {values[fieldNames.identificationNumber]},{' '}
          {_('checkoutProcessForm.payment_method.business_name')}: {values[fieldNames.businessName]}
        </label>
      </li>
    );
  }

  const isFinalConsumer = values[fieldNames.consumerType] === finalConsumer;

  return (
    <div role="tabpanel" aria-label="transfer argentina fields">
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
          {values[fieldNames.consumerType] && (
            <CuitFieldItem
              type="text"
              aria-label="identificationNumber"
              fieldName={fieldNames.identificationNumber}
              id={fieldNames.identificationNumber}
              label={`*${
                identificationTypes.find((ct) => ct.key === values[fieldNames.consumerType]).value
              }:`}
              required
              validate={true}
              className="field-item field-item--30"
              maxLength={isFinalConsumer ? 8 : null}
              validateIdentificationNumber={!isFinalConsumer ? validateCuit : null}
            />
          )}
        </FieldGroup>
      </FieldItem>
      {values[fieldNames.consumerType] && (
        <FieldItem className="field-item">
          <FieldGroup>
            <InputFieldItem
              type="text"
              aria-label="rason social"
              fieldName={fieldNames.businessName}
              id={fieldNames.businessName}
              label={`*${_('checkoutProcessForm.payment_method.business_name')}`}
              withNameValidation
              required
              className="field-item field-item--70 dp-p-r"
            />
          </FieldGroup>
        </FieldItem>
      )}
    </div>
  );
};
