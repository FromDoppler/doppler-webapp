import { InjectAppServices } from '../../../../../services/pure-di';
import { useState, useEffect } from 'react';
import { actionPage } from '../../Checkout';
import { AutomaticDebitArgentina } from './Argentina';
import { useIntl } from 'react-intl';
import { Loading } from '../../../../Loading/Loading';

const COD_ISO_AR = 'ar';

export const AutomaticDebit = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, staticDataClient },
    optionView,
    paymentMethod,
  }) => {
    const intl = useIntl();
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

        if ([COD_ISO_AR].includes(billingInformationResult.value.country)) {
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

    // Default: DA Argentina
    return (
      <AutomaticDebitArgentina
        paymentMethod={paymentMethod}
        consumerTypes={consumerTypes}
        readOnly={readOnly}
      />
    );
  },
);
