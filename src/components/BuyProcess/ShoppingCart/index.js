import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';
import { InjectAppServices } from '../../../services/pure-di';
import { getPlanTypeFromUrlSegment } from '../../../utils';
import { PaymentFrequency } from '../PaymentFrequency';
import { ItemCart } from './ItemCart';
import { usePaymentMethodData } from '../../../hooks/usePaymentMethodData';
import { PLAN_TYPE, PaymentMethodType } from '../../../doppler-types';
import { getBuyButton, mapItemFromLandingPackages, mapItemFromMarketingPlan } from './utils';
import { Promocode } from './Promocode';
import { NextInvoices } from './NextInvoices';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const BUY_MARKETING_PLAN = 1;
export const BUY_LANDING_PACK = 2;

export const ShoppingCart = InjectAppServices(
  ({
    discountConfig,
    selectedMarketingPlan,
    landingPacks,
    isEqualPlan = true,
    canBuy = true,
    selectedPaymentMethod,
    handleRemoveLandingPacks,
    hidePromocode = false,
    buyType = BUY_MARKETING_PLAN,
    dependencies: { appSessionRef, dopplerAccountPlansApiClient, dopplerBillingUserApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [amountDetailsData, setAmountDetailsData] = useState(null);
    const [amountDetailsLandingPacksData, setAmountDetailsLandingPacksData] = useState(null);
    const [promocodeApplied, setPromocodeApplied] = useState('');
    const { planType: planTypeUrlSegment } = useParams();
    const { pathname, search } = useLocation();
    const paymentMethodName = usePaymentMethodData({
      dopplerBillingUserApiClient,
      selectedPaymentMethod,
    });
    const selectedPlanType = useMemo(
      () => getPlanTypeFromUrlSegment(planTypeUrlSegment),
      [planTypeUrlSegment],
    );
    const amountDetailsLandingPacksDataRef = useRef(null);
    amountDetailsLandingPacksDataRef.current = amountDetailsLandingPacksData;

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

    useEffect(() => {
      const fetchData = async () => {
        const _amountDetailsLandingPacksData =
          await dopplerAccountPlansApiClient.getPlanBillingDetailsLandingPacksData(
            landingPacks.map((item) => item.planId).toString(),
            landingPacks.map((item) => item.packagesQty).toString(),
          );

        console.log('_amountDetailsLandingPacksData', _amountDetailsLandingPacksData);

        setAmountDetailsLandingPacksData(_amountDetailsLandingPacksData);
      };

      if (landingPacks?.length > 0) {
        fetchData();
      } else if (amountDetailsLandingPacksDataRef.current) {
        setAmountDetailsLandingPacksData(null);
      }
    }, [
      dopplerAccountPlansApiClient,
      discountConfig?.selectedPaymentFrequency,
      discountConfig.paymentFrequenciesList,
      landingPacks,
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

    landingPacks?.length > 0 &&
      items.push(
        mapItemFromLandingPackages({
          landingPacks,
          selectedPaymentFrequency: discountConfig?.selectedPaymentFrequency,
          handleRemoveLandingPacks,
          amountDetailsData: amountDetailsLandingPacksData,
          sessionPlan: appSessionRef.current.userData.user.plan,
        }),
      );
    const total =
      amountDetailsData?.value?.currentMonthTotal ||
      amountDetailsLandingPacksData?.value?.currentMonthTotal;
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
      landingPacks,
      buyType,
    });

    const paymentFrequencyProps = {
      ...discountConfig,
      disabled: discountConfig.disabled,
    };

    return (
      <div className="dp-shopping-card">
        <header>
          <h3 className="dp-second-order-title">{_('buy_process.shopping_cart.title')}</h3>
        </header>

        <PaymentFrequency {...paymentFrequencyProps} />

        {(isFreeAccount || selectedMarketingPlan?.type === PLAN_TYPE.byCredit) &&
          !hidePromocode && (
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
        {selectedPlanType !== PLAN_TYPE.byCredit && amountDetailsData?.value?.nextMonthDate && (
          <NextInvoices pathname={pathname} search={search} amountDetailsData={amountDetailsData} />
        )}
        <footer>
          <ul>
            <li>{_('buy_process.shopping_cart.renewal_description')}</li>
            <li>{_('buy_process.shopping_cart.price_without_taxes')}</li>
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
