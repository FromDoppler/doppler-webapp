import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';
import { InjectAppServices } from '../../../services/pure-di';
import { getPlanTypeFromUrlSegment } from '../../../utils';
import { PaymentFrequency } from '../PaymentFrequency';
import { ItemCart } from './ItemCart';
import { usePaymentMethodData } from '../../../hooks/usePaymentMethodData';
import { PLAN_TYPE, PaymentMethodType } from '../../../doppler-types';
import { getBuyButton, mapItemFromMarketingPlan } from './utils';
import { Promocode } from './Promocode';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const ShoppingCart = InjectAppServices(
  ({
    discountConfig,
    selectedMarketingPlan,
    isEqualPlan = true,
    canBuy = true,
    selectedPaymentMethod,
    dependencies: { appSessionRef, dopplerAccountPlansApiClient, dopplerBillingUserApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [amountDetailsData, setAmountDetailsData] = useState(null);
    const [promocodeApplied, setPromocodeApplied] = useState('');
    const { planType: planTypeUrlSegment } = useParams();
    const { pathname } = useLocation();
    const paymentMethodName = usePaymentMethodData({
      dopplerBillingUserApiClient,
      selectedPaymentMethod,
    });
    const selectedPlanType = useMemo(
      () => getPlanTypeFromUrlSegment(planTypeUrlSegment),
      [planTypeUrlSegment],
    );

    useEffect(() => {
      const fetchData = async () => {
        const paymentFrequencyId = discountConfig?.selectedPaymentFrequency?.id;
        const _amountDetailsData = await dopplerAccountPlansApiClient.getPlanBillingDetailsData(
          selectedMarketingPlan?.id,
          'Marketing',
          paymentFrequencyId
            ? paymentFrequencyId
            : discountConfig.paymentFrequenciesList.at(-1)
              ? discountConfig.paymentFrequenciesList.at(-1).id
              : 0,
          promocodeApplied.promocode || '',
        );
        console.log('_amountDetailsData', _amountDetailsData);
        setAmountDetailsData(_amountDetailsData);
      };

      if (selectedMarketingPlan?.id && paymentMethodName) {
        fetchData();
      }
    }, [
      dopplerAccountPlansApiClient,
      selectedMarketingPlan,
      discountConfig?.selectedPaymentFrequency,
      discountConfig.paymentFrequenciesList,
      promocodeApplied,
      paymentMethodName,
    ]);

    const handlePromocodeApplied = useCallback((value) => {
      setPromocodeApplied(value);
    }, []);

    const removePromocodeApplied = () => {
      setPromocodeApplied('');
      setAmountDetailsData({
        ...amountDetailsData,
        value: {
          ...amountDetailsData?.value,
          discountPromocode: null,
        },
      });
    };

    const items = [];
    const isTransfer = paymentMethodName === PaymentMethodType.transfer;
    selectedMarketingPlan &&
      items.push(
        mapItemFromMarketingPlan({
          marketingPlan: selectedMarketingPlan,
          selectedPaymentFrequency: discountConfig?.selectedPaymentFrequency,
          amountDetailsData,
          promocodeApplied,
          removePromocodeApplied,
          isTransfer,
          intl,
        }),
      );
    const total = amountDetailsData?.value?.currentMonthTotal;

    const sessionPlan = appSessionRef.current.userData.user;
    const { isFreeAccount } = sessionPlan.plan;
    const sessionPlanType = sessionPlan.plan.planType;

    const buyButton = getBuyButton({
      pathname,
      isEqualPlan,
      sessionPlanType,
      selectedMarketingPlan,
      canBuy,
      selectedDiscount: discountConfig?.selectedPaymentFrequency,
      promotion: promocodeApplied,
      paymentMethodName,
      total,
    });

    const paymentFrequencyProps = {
      ...discountConfig,
      disabled: discountConfig.disabled || !!promocodeApplied,
    };

    return (
      <div className="dp-shopping-card">
        <header>
          <h3 className="dp-second-order-title">Resumen de compra</h3>
        </header>

        <PaymentFrequency {...paymentFrequencyProps} />

        {(isFreeAccount || selectedMarketingPlan?.type === PLAN_TYPE.byCredit) && (
          <Promocode
            allowPromocode={
              !discountConfig?.selectedPaymentFrequency?.id ||
              discountConfig?.selectedPaymentFrequency?.applyPromo
            }
            selectedMarketingPlan={selectedMarketingPlan}
            amountDetailsData={amountDetailsData}
            selectedPaymentFrequency={discountConfig?.selectedPaymentFrequency}
            callback={handlePromocodeApplied}
            hasPromocodeAppliedItem={!!promocodeApplied}
            selectedPlanType={selectedPlanType}
          />
        )}
        <section>
          <h4>{_('buy_process.subscriptions_title')}</h4>
          {items.map((item, index) => (
            <ItemCart key={`item-${index}`} {...item} />
          ))}
          <hr className="m-t-24 m-b-24" />
          <h3 className="dp-total-purchase">
            Total
            <span>
              US$ <FormattedNumber value={total || 0} {...numberFormatOptions} />
              {isTransfer ? '*' : ''}
            </span>
          </h3>
          {buyButton}
        </section>
        <footer>
          <ul>
            <li>Suscripción con renovación automática, puedes cancelarla cuando lo desees.</li>
            <li>
              *El precio no incluye impuestos.
              <a href="/plan-selection">Cuáles son los impuestos por pais?</a>
            </li>
          </ul>
        </footer>
      </div>
    );
  },
);

ShoppingCart.propTypes = {
  selectedMarketingPlan: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.PropTypes.string,
  }),
  isEqualPlan: PropTypes.bool,
  canBuy: PropTypes.bool,
  selectedPaymentMethod: PropTypes.object,
};
