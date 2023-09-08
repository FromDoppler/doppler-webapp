import { useEffect, useState } from 'react';
import { PaymentMethodType } from '../../doppler-types';

export const usePaymentMethodData = ({ dopplerBillingUserApiClient, selectedPaymentMethod }) => {
  const [paymentMethodName, setPaymentMethodName] = useState(selectedPaymentMethod);

  useEffect(() => {
    const fetchData = async () => {
      const paymentMethodData = await dopplerBillingUserApiClient.getPaymentMethodData();
      const defaultPaymentMethodName = paymentMethodData.success
        ? paymentMethodData.value.paymentMethodName !== 'NONE'
          ? paymentMethodData.value.paymentMethodName
          : PaymentMethodType.creditCard
        : PaymentMethodType.creditCard;
      setPaymentMethodName(defaultPaymentMethodName);
    };

    if (!selectedPaymentMethod) {
      if (!paymentMethodName) {
        fetchData();
      }
    } else if (paymentMethodName !== selectedPaymentMethod) {
      setPaymentMethodName(selectedPaymentMethod);
    }
  }, [dopplerBillingUserApiClient, paymentMethodName, selectedPaymentMethod]);

  return paymentMethodName;
};
