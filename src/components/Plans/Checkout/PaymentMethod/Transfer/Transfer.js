import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../../services/pure-di';
import { useIntl } from 'react-intl';
import {
  FieldGroup,
  FieldItem,
  SelectFieldItem,
  InputFieldItem,
  CuitFieldItem,
} from '../../../../form-helpers/form-helpers';
import { Loading } from '../../../../Loading/Loading';
import { actionPage } from '../../Checkout';
import { useFormikContext } from 'formik';
import { fieldNames, paymentType } from '../PaymentMethod';
import { validateCuit } from '../../../../../validations';
import { TransferColombia } from './Colombia';

export const finalConsumer = 'CF';
const COD_ISO_AR = 'ar';
const COD_ISO_CO = 'co';

export const identificationTypes = [
  { key: 'CF', value: 'DNI/CUIL' },
  { key: 'RI', value: 'CUIT' },
  { key: 'RNI', value: 'CUIT' },
  { key: 'MT', value: 'CUIT' },
  { key: 'EX', value: 'CUIT' },
  { key: 'NG', value: 'CUIT' },
  { key: 'NC', value: 'CUIT' },
  { key: 'RFC', value: 'RFC' },
];

export const TransferArgentina = ({ paymentMethod, consumerTypes }) => {
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

export const Transfer = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, staticDataClient },
    optionView,
    paymentMethod,
  }) => {
    const intl = useIntl();
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(true);
    const [consumerTypes, setConsumerTypes] = useState([]);

    useEffect(() => {
      const getConsumerTypesData = async (country, language) => {
        const data = await staticDataClient.getConsumerTypesData(country, language);
        const consumerTypes = data.success ? data.value : [];
        return consumerTypes;
      };

      const fetchData = async () => {
        const billingInformationResult =
          await dopplerBillingUserApiClient.getBillingInformationData();

        setCountry(billingInformationResult.value.country);

        if (billingInformationResult.value.country === COD_ISO_AR) {
          const _consumerTypes = await getConsumerTypesData(
            billingInformationResult.value.country,
            intl.locale,
          );
          setConsumerTypes(_consumerTypes);
        }

        setLoading(false);
      };

      fetchData();
    }, [dopplerBillingUserApiClient, dopplerAccountPlansApiClient, staticDataClient, intl.locale]);

    const selectedConsumerType = consumerTypes.find(
      (ct) => ct.key === paymentMethod?.idConsumerType,
    );
    const identificationType = identificationTypes.find(
      (it) => it.key === paymentMethod?.idConsumerType,
    );
    const readOnly = optionView === actionPage.READONLY;

    return (
      <>
        {loading ? (
          <Loading page />
        ) : (
          <FieldGroup>
            {country === COD_ISO_AR ? (
              readOnly ? (
                <li aria-label="resume data" className="field-item field-item--70 dp-p-r">
                  <label>
                    {selectedConsumerType?.value}, {identificationType?.value}:{' '}
                    {paymentMethod?.identificationNumber}
                    {identificationType.key !== finalConsumer
                      ? `, ${paymentMethod?.razonSocial}`
                      : ''}
                  </label>
                </li>
              ) : (
                <TransferArgentina
                  consumerTypes={consumerTypes}
                  paymentMethod={paymentMethod}
                ></TransferArgentina>
              )
            ) : country === COD_ISO_CO ? (
              <TransferColombia
                paymentMethod={paymentMethod}
                readOnly={readOnly}
              ></TransferColombia>
            ) : null}
          </FieldGroup>
        )}
      </>
    );
  },
);
