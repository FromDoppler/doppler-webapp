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
  mapItemFromAddOnPlan,
} from './utils';
import {
  AddOnType,
  BUY_CHAT_PLAN,
  BUY_LANDING_PACK,
  BUY_MARKETING_PLAN,
  BUY_ONSITE_PLAN,
  BUY_PUSH_NOTIFICATION_PLAN,
  PLAN_TYPE,
  PaymentMethodType,
  SUBSCRIBERS_LIMIT_EXCLUSIVE_DISCOUNT_ARGENTINA,
  URL_PLAN_TYPE,
} from '../../../doppler-types';
import { Promocode } from './Promocode';
import { NextInvoices } from './NextInvoices';
import { useQueryParams } from '../../../hooks/useQueryParams';

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
    selectedAddOnPlan,
    handleRemoveAddOnPlan,
    canAddOnPlanRemove,
    dependencies: { appSessionRef, dopplerAccountPlansApiClient, dopplerBillingUserApiClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const query = useQueryParams();
    const promocodeFromUrl = query.get('promo-code') ?? query.get('PromoCode') ?? '';

    const [amountDetailsData, setAmountDetailsData] = useState(null);
    const [amountDetailsLandingPacksData, setAmountDetailsLandingPacksData] = useState(null);
    const [amountDetailsPlanChatData, setAmountDetailsPlanChatData] = useState(null);
    const [amountDetailsAddOnPlanData, setAmountDetailsAddOnPlanData] = useState(null);
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

    const isByCredits =
      planTypeUrlSegment === PLAN_TYPE.byCredit ||
      planTypeUrlSegment === URL_PLAN_TYPE[PLAN_TYPE.byCredit];

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
          promocodeApplied.promocode || promocodeFromUrl,
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
      promocodeFromUrl,
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
            promocodeFromUrl,
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
      promocodeFromUrl,
    ]);

    useEffect(() => {
      const fetchData = async () => {
        const paymentFrequencyId = discountConfig?.selectedPaymentFrequency?.id;
        const _amountDetailsAddOnPlanData =
          await dopplerAccountPlansApiClient.getAddOnPlanBillingDetailsData(
            selectedAddOnPlan?.planId,
            buyType === BUY_ONSITE_PLAN ? 4 : buyType === BUY_PUSH_NOTIFICATION_PLAN ? 5 : 0,
            paymentFrequencyId
              ? paymentFrequencyId
              : discountConfig.paymentFrequenciesList.at(-1)
                ? discountConfig.paymentFrequenciesList.at(-1).id
                : 0,
          );

        setAmountDetailsAddOnPlanData(_amountDetailsAddOnPlanData);
      };

      if (selectedAddOnPlan?.planId) {
        fetchData();
      } else {
        setAmountDetailsAddOnPlanData(null);
      }
    }, [
      dopplerAccountPlansApiClient,
      selectedAddOnPlan,
      buyType,
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
          intl,
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

    selectedAddOnPlan &&
      items.push(
        mapItemFromAddOnPlan({
          addOnPlan: selectedAddOnPlan,
          addOnType:
            buyType === BUY_ONSITE_PLAN
              ? AddOnType.OnSite
              : buyType === BUY_PUSH_NOTIFICATION_PLAN
                ? AddOnType.PushNotifications
                : 0,
          intl,
          selectedPaymentFrequency: discountConfig?.selectedPaymentFrequency,
          amountDetailsData: amountDetailsAddOnPlanData,
          planType: sessionPlanType,
          handleRemove: () => {
            handleRemoveAddOnPlan();
          },
          canAddOnPlanRemove: canAddOnPlanRemove,
        }),
      );

    const total =
      (addMarketingPlan ? amountDetailsData?.value?.currentMonthTotal ?? 0 : 0) +
      (amountDetailsLandingPacksData?.value?.currentMonthTotal ?? 0) +
      (amountDetailsPlanChatData?.value?.currentMonthTotal ?? 0) +
      (amountDetailsAddOnPlanData?.value?.currentMonthTotal ?? 0);

    const nextMonthTotal =
      (addMarketingPlan ? amountDetailsData?.value?.nextMonthTotal ?? 0 : 0) +
      (amountDetailsLandingPacksData?.value?.nextMonthTotal ?? 0) +
      (amountDetailsPlanChatData?.value?.nextMonthTotal ?? 0) +
      (amountDetailsAddOnPlanData?.value?.nextMonthTotal ?? 0);

    const checkoutLandingPackButtonEnabled = landingPagesRemoved && landingPacks?.length === 0;
    const buyButton = getBuyButton({
      pathname,
      isEqualPlan,
      sessionPlanType,
      selectedMarketingPlan,
      canBuy,
      selectedDiscount: discountConfig?.selectedPaymentFrequency,
      promotion: promocodeApplied || { promocode: promocodeFromUrl },
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
      selectedAddOnPlan: {
        addOnPlan: selectedAddOnPlan,
        total: amountDetailsAddOnPlanData?.value?.currentMonthTotal ?? 0,
      },
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

        {buyType === BUY_MARKETING_PLAN && !hidePromocode && (
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
        {(!isByCredits ||
          (isByCredits && buyType === BUY_CHAT_PLAN && amountDetailsPlanChatData !== null) ||
          (isByCredits && buyType === BUY_LANDING_PACK && amountDetailsLandingPacksData !== null) ||
          (isByCredits && buyType === BUY_ONSITE_PLAN && amountDetailsAddOnPlanData !== null) ||
          (isByCredits &&
            buyType === BUY_PUSH_NOTIFICATION_PLAN &&
            amountDetailsAddOnPlanData !== null)) &&
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
                  : buyType === BUY_ONSITE_PLAN
                    ? 'buy_process.upcoming_bills.onsite_plan_subtitle'
                    : buyType === BUY_PUSH_NOTIFICATION_PLAN
                      ? 'buy_process.upcoming_bills.push_notification_plan_subtitle'
                      : addMarketingPlan
                        ? buyType === BUY_CHAT_PLAN && amountDetailsPlanChatData !== null
                          ? !isByCredits
                            ? 'buy_process.upcoming_bills.marketing_and_chat_plan_subtitle'
                            : 'buy_process.upcoming_bills.chat_plan_subtitle'
                          : 'buy_process.upcoming_bills.marketing_plan_subtitle'
                        : 'buy_process.upcoming_bills.chat_plan_subtitle'
              }
            />
          )}
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
