import React, { useEffect, useState } from 'react';
import { InjectAppServices } from '../../../../../services/pure-di';
import { useIntl } from 'react-intl';
import { Loading } from '../../../../Loading/Loading';
import { actionPage } from '../../Checkout';
import { TransferColombia } from './Colombia';
import { TransferArgentina } from './Argentina';
import { TransferMexico } from './Mexico';

export const finalConsumer = 'CF';
export const identificationTypes = [
  { key: 'CF', value: 'DNI' },
  { key: 'RI', value: 'CUIT' },
  { key: 'RNI', value: 'CUIT' },
  { key: 'MT', value: 'CUIT' },
  { key: 'EX', value: 'CUIT' },
  { key: 'NG', value: 'CUIT' },
  { key: 'NC', value: 'CUIT' },
  { key: 'RFC', value: 'RFC' },
];
const COD_ISO_AR = 'ar';
const COD_ISO_CO = 'co';
const COD_ISO_MX = 'mx';

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

        if ([COD_ISO_AR, COD_ISO_MX].includes(billingInformationResult.value.country)) {
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

    const readOnly = optionView === actionPage.READONLY;

    if (loading) {
      return <Loading page />;
    }

    // Transfer Colombia
    if (country === COD_ISO_CO) {
      return <TransferColombia paymentMethod={paymentMethod} readOnly={readOnly} />;
    }

    // Transfer Mexico
    if (country === COD_ISO_MX) {
      return (
        <TransferMexico
          paymentMethod={paymentMethod}
          readOnly={readOnly}
          consumerTypes={consumerTypes}
        />
      );
    }

    // Default: Transfer Argentina
    return (
      <TransferArgentina
        consumerTypes={consumerTypes}
        paymentMethod={paymentMethod}
        readOnly={readOnly}
      />
    );
  },
);
