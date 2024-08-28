import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';
import { InjectAppServices } from '../../../services/pure-di';
import { getPlanTypeFromUrlSegment } from '../../../utils';
import { PaymentFrequency } from '../PaymentFrequency';
import { ItemCart } from './ItemCart';
import { usePaymentMethodData } from '../../../hooks/usePaymentMethodData';
import {
  getBuyButton,
  mapItemFromLandingPackages,
  mapItemFromMarketingPlan,
  mapItemFromPlanChat,
} from './utils';
import {
  BUY_CHAT_PLAN,
  BUY_LANDING_PACK,
  BUY_MARKETING_PLAN,
  PLAN_TYPE,
  PaymentMethodType,
  SUBSCRIBERS_LIMIT_EXCLUSIVE_DISCOUNT_ARGENTINA,
} from '../../../doppler-types';
import { Promocode } from './Promocode';
import { NextInvoices } from './NextInvoices';

const numberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const ShoppingCart = InjectAppServices(
  ({
    discountConfig,
    selectedMarketingPlan,
    landingPacks,
    selectedPlanChat,
    isEqualPlan = true,
    canBuy = true,
    selectedPaymentMethod,
    isArgentina,
    hidePromocode = false,
    buyType = BUY_MARKETING_PLAN,
    handleLandingPagesDowngrade,
    handleRemovePlanChat,
    disabledLandingsBuy,
    landingPagesRemoved,
    cancelLandings,
    canChatPlanRemove = true,
    hasChatActive,
    disabledPromocode = false,
    addMarketingPlan = true,
    dependencies: { appSessionRef, dopplerAccountPlansApiClient, dopplerBillingUserApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [amountDetailsData, setAmountDetailsData] = useState(null);
    const [amountDetailsLandingPacksData, setAmountDetailsLandingPacksData] = useState(null);
    const [amountDetailsPlanChatData, setAmountDetailsPlanChatData] = useState(null);
    useState(null);
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
    const sessionPlan = appSessionRef.current.userData.user;
    const { isFreeAccount } = sessionPlan.plan;
    const sessionPlanType = sessionPlan.plan.planType;
    const isExclusiveDiscountArgentina =
      isArgentina &&
      isFreeAccount &&
      selectedMarketingPlan?.type === PLAN_TYPE.byContact &&
      (selectedMarketingPlan?.subscriberLimit <= SUBSCRIBERS_LIMIT_EXCLUSIVE_DISCOUNT_ARGENTINA ||
        selectedMarketingPlan?.subscribersQty <= SUBSCRIBERS_LIMIT_EXCLUSIVE_DISCOUNT_ARGENTINA);
    const amountDetailsLandingPacksDataRef = useRef(null);
    const initialAmountDetailsLandingPacksDataRef = useRef(null);
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
        if (!initialAmountDetailsLandingPacksDataRef.current) {
          initialAmountDetailsLandingPacksDataRef.current = _amountDetailsLandingPacksData;
        }
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

    useEffect(() => {
      const total = amountDetailsLandingPacksData?.value?.currentMonthTotal;
      if (buyType === BUY_LANDING_PACK) {
        handleLandingPagesDowngrade &&
          handleLandingPagesDowngrade(
            total === 0 && amountDetailsLandingPacksData?.value?.positiveBalance < 0,
          );
      }
    }, [amountDetailsLandingPacksData, buyType, handleLandingPagesDowngrade]);

    useEffect(() => {
      const fetchData = async () => {
        const paymentFrequencyId = discountConfig?.selectedPaymentFrequency?.id;
        const _amountDetailsPlanChatData =
          await dopplerAccountPlansApiClient.getPlanChatBillingDetailsData(
            selectedPlanChat?.planId,
            paymentFrequencyId
              ? paymentFrequencyId
              : discountConfig.paymentFrequenciesList.at(-1)
                ? discountConfig.paymentFrequenciesList.at(-1).id
                : 0,
          );

        console.log('_amountDetailsPlanChatData', _amountDetailsPlanChatData);

        setAmountDetailsPlanChatData(_amountDetailsPlanChatData);
      };

      if (selectedPlanChat?.planId) {
        fetchData();
      } else {
        setAmountDetailsPlanChatData(null);
      }
    }, [
      dopplerAccountPlansApiClient,
      selectedPlanChat,
      discountConfig?.selectedPaymentFrequency,
      discountConfig.paymentFrequenciesList,
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
      addMarketingPlan &&
      items.push(
        mapItemFromMarketingPlan({
          marketingPlan: selectedMarketingPlan,
          selectedPaymentFrequency: discountConfig?.selectedPaymentFrequency,
          amountDetailsData,
          promocodeApplied,
          removePromocodeApplied,
          disabledPromocode,
          intl,
          isExclusiveDiscountArgentina:
            isArgentina &&
            isFreeAccount &&
            selectedMarketingPlan?.type === PLAN_TYPE.byContact &&
            promocodeApplied?.promocode === process.env.REACT_APP_PROMOCODE_ARGENTINA,
        }),
      );

    landingPacks?.length > 0 &&
      items.push(
        mapItemFromLandingPackages({
          landingPacks,
          selectedPaymentFrequency: discountConfig?.selectedPaymentFrequency,
          amountDetailsData: amountDetailsLandingPacksData,
          sessionPlan: appSessionRef.current.userData.user.plan,
        }),
      );

    selectedPlanChat &&
      items.push(
        mapItemFromPlanChat({
          planChat: selectedPlanChat,
          intl,
          selectedPaymentFrequency: discountConfig?.selectedPaymentFrequency,
          amountDetailsData: amountDetailsPlanChatData,
          planType: selectedMarketingPlan?.type,
          handleRemove: () => {
            handleRemovePlanChat();
          },
          canChatPlanRemove: canChatPlanRemove,
        }),
      );
    const total =
      (addMarketingPlan ? amountDetailsData?.value?.currentMonthTotal ?? 0 : 0) +
      (amountDetailsLandingPacksData?.value?.currentMonthTotal ?? 0) +
      (amountDetailsPlanChatData?.value?.currentMonthTotal ?? 0);

    const nextMonthTotal =
      (addMarketingPlan ? amountDetailsData?.value?.nextMonthTotal ?? 0 : 0) +
      (amountDetailsLandingPacksData?.value?.nextMonthTotal ?? 0) +
      (amountDetailsPlanChatData?.value?.nextMonthTotal ?? 0);

    const checkoutLandingPackButtonEnabled = landingPagesRemoved && landingPacks?.length === 0;
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
      disabledLandingsBuy,
      checkoutLandingPackButtonEnabled,
      cancelLandings,
      selectedPlanChat: {
        planChat: selectedPlanChat,
        total: amountDetailsPlanChatData?.value?.currentMonthTotal ?? 0,
      },
      hasChatActive,
    });

    const paymentFrequencyProps = {
      ...discountConfig,
      disabled: discountConfig.disabled,
      isExclusiveDiscountArgentina,
      promocodeApplied,
    };

    const isLandingPagesDowngrade =
      buyType === BUY_LANDING_PACK &&
      total === 0 &&
      amountDetailsLandingPacksData?.value?.positiveBalance < 0;

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
              isArgentina={isArgentina}
              disabledPromocode={disabledPromocode}
            />
          )}
        <section>
          <h4>{_('buy_process.subscriptions_title')}</h4>
          {items.map((item, index) => (
            <ItemCart key={`item-${index}`} {...item} />
          ))}
          <hr className="m-t-24 m-b-24" />
          <h3 className="dp-total-purchase">
            {isLandingPagesDowngrade ? (
              <>
                Total
                <span>
                  US$ <FormattedNumber value={0} {...numberFormatOptions} />
                  {isTransfer ? '*' : ''}
                </span>
              </>
            ) : (
              <>
                Total
                <span>
                  US${' '}
                  <FormattedNumber value={(total < 0 ? 0 : total) || 0} {...numberFormatOptions} />
                  {isTransfer ? '*' : ''}
                </span>
              </>
            )}
          </h3>
          {buyButton}
          {checkoutLandingPackButtonEnabled && (
            <p className="dp-reminder">
              {_('landing_selection.user_messages.legend_after_remove')}
            </p>
          )}
        </section>
        {selectedPlanType !== PLAN_TYPE.byCredit &&
          (amountDetailsData?.value?.nextMonthDate ||
            amountDetailsLandingPacksData?.value?.nextMonthDate) && (
            <NextInvoices
              pathname={pathname}
              search={search}
              nextMonthDate={
                amountDetailsData?.value?.nextMonthDate ??
                amountDetailsLandingPacksData?.value?.nextMonthDate
              }
              nextMonthTotal={nextMonthTotal}
              subtitleBuyId={
                buyType === BUY_LANDING_PACK
                  ? 'buy_process.upcoming_bills.landing_pack_subtitle'
                  : addMarketingPlan
                    ? buyType === BUY_CHAT_PLAN && amountDetailsPlanChatData !== null
                      ? 'buy_process.upcoming_bills.marketing_and_chat_plan_subtitle'
                      : 'buy_process.upcoming_bills.marketing_plan_subtitle'
                    : 'buy_process.upcoming_bills.chat_plan_subtitle'
              }
            />
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
