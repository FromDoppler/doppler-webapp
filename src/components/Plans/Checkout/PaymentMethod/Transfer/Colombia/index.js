import React, { useEffect } from 'react';
import {
  FieldGroup,
  FieldItem,
  InputFieldItem,
  CuitFieldItem,
} from '../../../../../form-helpers/form-helpers';
import { fieldNames, paymentType } from '../../PaymentMethod';
import { useFormikContext, Field } from 'formik';
import { useIntl } from 'react-intl';

export const TransferColombia = ({ paymentMethod, readOnly }) => {
  const { setValues } = useFormikContext();
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    if (!readOnly) {
      setValues({
        [fieldNames.identificationNumber]: paymentMethod.identificationNumber,
        [fieldNames.businessName]: paymentMethod.razonSocial,
        [fieldNames.responsableIVA]: paymentMethod.responsableIVA ?? false,
        [fieldNames.paymentMethodName]: paymentType.transfer,
      });
    }
  }, [
    paymentMethod.identificationNumber,
    paymentMethod.razonSocial,
    paymentMethod.responsableIVA,
    setValues,
    readOnly,
  ]);

  return (
    <>
      {readOnly ? (
        <li aria-label="resume data" className="field-item field-item--70 dp-p-r">
          <label>
            {`NIT: ${paymentMethod?.identificationNumber}`}
            {`, ${paymentMethod?.razonSocial}`}
            {`${
              paymentMethod.responsableIVA === '1'
                ? `, ${_('checkoutProcessForm.payment_method.responsable_iva')}`
                : ''
            }`}
          </label>
        </li>
      ) : (
        <>
          <FieldItem className="field-item">
            <FieldGroup>
              <InputFieldItem
                type="text"
                fieldName={fieldNames.businessName}
                id="businessName"
                label={`*${_('checkoutProcessForm.payment_method.business_name')}`}
                withNameValidation
                required
                className="field-item field-item--70 dp-p-r"
              />
              <CuitFieldItem
                type="text"
                aria-label="identificationNumber"
                fieldName={fieldNames.identificationNumber}
                id="identificationNumber"
                label={`*${_('checkoutProcessForm.payment_method.identification_type_colombia')}:`}
                maxLength={10}
                required
                className="field-item field-item--30"
              />
            </FieldGroup>
          </FieldItem>
          <FieldItem className="field-item">
            <label>{`*${_('checkoutProcessForm.payment_method.responsable_iva')}:`}</label>
            <Field name="responsableIVA">
              {({ field }) => (
                <ul role="group" aria-labelledby="checkbox-group" className="dp-radio-input">
                  <li className="field-item--30">
                    <div className="dp-volume-option">
                      <label>
                        <input
                          aria-label={'checkoutProcessForm.payment_method.responsable_iva_no'}
                          id={'checkoutProcessForm.payment_method.responsable_iva_no'}
                          type="radio"
                          name={fieldNames.responsableIVA}
                          {...field}
                          value={'0'}
                          checked={field.value === '0'}
                        />
                        <span>{_('checkoutProcessForm.payment_method.responsable_iva_no')}</span>
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="dp-volume-option">
                      <label>
                        <input
                          aria-label={'checkoutProcessForm.payment_method.responsable_iva_yes'}
                          id={'checkoutProcessForm.payment_method.responsable_iva_yes'}
                          type="radio"
                          name={fieldNames.responsableIVA}
                          {...field}
                          value={'1'}
                          checked={field.value === '1'}
                        />
                        <span>{_('checkoutProcessForm.payment_method.responsable_iva_yes')}</span>
                      </label>
                    </div>
                  </li>
                </ul>
              )}
            </Field>
          </FieldItem>
        </>
      )}
    </>
  );
};
