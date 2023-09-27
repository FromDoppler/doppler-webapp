import { InjectAppServices } from '../../../../../../services/pure-di';
import {
  FieldGroup,
  FieldItem,
  SelectFieldItem,
  InputFieldItem,
  CuitFieldItem,
  CheckboxFieldItemAccessible,
  CbuFieldItem,
} from '../../../../../form-helpers/form-helpers';
import { useIntl } from 'react-intl';
import { fieldNames, paymentType } from '../../PaymentMethod';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';
import { validateCuit, validateDni, validateCbu } from '../../../../../../validations';
import { finalConsumer, identificationTypes } from '../../Transfer/Transfer';

export const AutomaticDebitArgentina = InjectAppServices(
  ({ paymentMethod, consumerTypes, readOnly }) => {
    const { setValues, values } = useFormikContext();
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    const isFinalConsumer = values[fieldNames.consumerType] === finalConsumer;

    useEffect(() => {
      setValues({
        [fieldNames.consumerType]: paymentMethod.idConsumerType ?? '',
        [fieldNames.identificationNumber]: paymentMethod.identificationNumber ?? '',
        [fieldNames.businessName]: paymentMethod.razonSocial ?? '',
        [fieldNames.paymentMethodName]: paymentType.automaticDebit,
        [fieldNames.cbu]: paymentMethod.cbu ?? '',
        [fieldNames.withHoldingAgent]: paymentMethod.withHoldingAgent ?? '',
      });
    }, [
      paymentMethod.idConsumerType,
      paymentMethod.identificationNumber,
      paymentMethod.razonSocial,
      paymentMethod.cbu,
      paymentMethod.withHoldingAgent,
      setValues,
    ]);

    const handleIsWithholdingAgentCheckbox = (checkboxStatus) => {
      if (!checkboxStatus) {
        return 'validation_messages.error_is_withholding_agent';
      }
    };

    if (readOnly) {
      return (
        <li aria-label="resume data" className="field-item field-item--70 dp-p-r">
          <label>
            {identificationTypes.find((ct) => ct.key === values[fieldNames.consumerType])?.value}:{' '}
            {values[fieldNames.identificationNumber]},{' '}
            {_(
              isFinalConsumer
                ? 'checkoutProcessForm.payment_method.first_last_name'
                : 'checkoutProcessForm.payment_method.business_name',
            )}
            : {values[fieldNames.businessName]}
          </label>
        </li>
      );
    }

    return (
      <div role="tabpanel" aria-label="automatic debit argentina fields">
        <FieldItem className="field-item">
          <FieldGroup className="dp-items-accept">
            <CheckboxFieldItemAccessible
              validate={handleIsWithholdingAgentCheckbox}
              fieldName={fieldNames.withHoldingAgent}
              id={fieldNames.withHoldingAgent}
              className={'label--policy field-item field-item--70 dp-p-r'}
              label={_('checkoutProcessForm.payment_method.withholding_agent')}
              checkRequired
              withSubmitCount={false}
            />
          </FieldGroup>
        </FieldItem>
        {values[fieldNames.withHoldingAgent] && (
          <>
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
                    type={isFinalConsumer ? 'number' : 'text'}
                    aria-label="identificationNumber"
                    fieldName={fieldNames.identificationNumber}
                    id={fieldNames.identificationNumber}
                    label={`*${
                      identificationTypes.find((ct) => ct.key === values[fieldNames.consumerType])
                        .value
                    }:`}
                    required
                    validate={true}
                    className="field-item field-item--30"
                    maxLength={isFinalConsumer ? 8 : null}
                    validateIdentificationNumber={isFinalConsumer ? validateDni : validateCuit}
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
                    label={`*${_(
                      isFinalConsumer
                        ? 'checkoutProcessForm.payment_method.first_last_name'
                        : 'checkoutProcessForm.payment_method.business_name',
                    )}`}
                    withNameValidation
                    required
                    className="field-item--50 dp-p-r"
                  />
                  <CbuFieldItem
                    aria-label="cbu"
                    fieldName={fieldNames.cbu}
                    id={fieldNames.cbu}
                    label={`*${_('checkoutProcessForm.payment_method.cbu')}`}
                    required
                    className="field-item--50"
                    validate={true}
                    validateIdentificationNumber={validateCbu}
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
