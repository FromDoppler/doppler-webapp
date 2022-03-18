import React, { useEffect } from 'react';
import {
  FieldGroup,
  FieldItem,
  InputFieldItem,
  CuitFieldItem,
} from '../../../../../form-helpers/form-helpers';
import { fieldNames, paymentType } from '../../PaymentMethod';
import { useFormikContext } from 'formik';
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
        [fieldNames.paymentMethodName]: paymentType.transfer,
      });
    }
  }, [paymentMethod.identificationNumber, paymentMethod.razonSocial, setValues, readOnly]);

  return (
    <>
      {readOnly ? (
        <li aria-label="resume data" className="field-item field-item--70 dp-p-r">
          <label>
            {`NIT: ${paymentMethod?.identificationNumber}`}
            {`, ${paymentMethod?.razonSocial}`}
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
        </>
      )}
    </>
  );
};
