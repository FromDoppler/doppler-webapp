import { useEffect, useState } from 'react';
import { PaymentMethodType } from '../../doppler-types';

export const usePaymentMethodData = ({ dopplerBillingUserApiClient, selectedPaymentMethod }) => {
  const [defaultPaymentMethodName, setDefaultPaymentMethodName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();
      const defaultPaymentMethodName = paymentMethodData.success
        ? paymentMethodData.value.paymentMethodName !== 'NONE'
          ? paymentMethodData.value.paymentMethodName
          : PaymentMethodType.creditCard
        : PaymentMethodType.creditCard;
      setDefaultPaymentMethodName(defaultPaymentMethodName);
    };

    if (!selectedPaymentMethod && !defaultPaymentMethodName) {
      fetchData();
    }
  }, [dopplerBillingUserApiClient, defaultPaymentMethodName, selectedPaymentMethod]);

  return selectedPaymentMethod ?? defaultPaymentMethodName;
};
