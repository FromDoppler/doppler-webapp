import { useCallback, useEffect, useRef, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { useIntl } from 'react-intl';
import { ContactInformation } from './ContactInformation/ContactInformation';
import { BillingInformation } from './BillingInformation/BillingInformation';
import { PaymentMethod } from './PaymentMethod/PaymentMethod';
import { Step } from './Step/Step';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  AddOnType,
  BUY_LANDING_PACK,
  BUY_MARKETING_PLAN,
  BUY_ONSITE_PLAN,
  BUY_PUSH_NOTIFICATION_PLAN,
  PLAN_TYPE,
  PaymentMethodType,
  URL_PLAN_TYPE,
} from '../../../doppler-types';
import {
  getMonthsByCycle,
  getQueryParamsWithAccountType,
  orderPaymentFrequencies,
} from '../../../utils';
import { ShoppingCart } from '../../BuyProcess/ShoppingCart';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { useFetchLandingPacks } from '../../../hooks/useFetchtLandingPacks';
import { paymentFrequenciesListForLandingPacks } from '../../BuyProcess/LandingPacksSelection';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';

const checkoutSteps = {
  contactInformation: 'contact-information',
  billingInformation: 'billing-information',
  paymentInformation: 'payment-information',
};

export const actionPage = {
  READONLY: 'readOnly',
  UPDATE: 'update',
};

const getPlanTypeFromLegacyPlanType = (planType) =>
  Object.keys(URL_PLAN_TYPE).includes(planType)
    ? URL_PLAN_TYPE[planType]
    : URL_PLAN_TYPE[PLAN_TYPE.byContact];

const Checkout = InjectAppServices(
  ({
    dependencies: { dopplerBillingUserApiClient, appSessionRef, dopplerAccountPlansApiClient },
  }) => {
    const [activeStep, setActiveStep] = useState(checkoutSteps.contactInformation);
    const [completeContactInformationStep, setCompleteContactInformationStep] = useState(true);
    const [completeBillingInformationStep, setCompleteBillingInformationStep] = useState(false);
    const [paymentInformationAction, setPaymentInformationAction] = useState(actionPage.READONLY);
    const [, setSelectedDiscountId] = useState(0);
    const [, setSelectedMonthPlan] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
      PaymentMethodType.creditCard,
    );
    const [selectedFullPlan, setSelectedFullPlan] = useState(null);
    const [appliedPromocode] = useState(false);
    const [paymentFrequenciesList, setPaymentFrequenciesList] = useState([]);
    const [selectedPaymentFrequency, setSelectedPaymentFrequency] = useState(null);
    const [selectedChatPlan, setSelectedChatPlan] = useState(null);
    const [selectedAddOnPlan, setSelectedAddOnPlan] = useState(null);

    const intl = useIntl();
    const { pathType, planType } = useParams();
    const query = useQueryParams();
    const selectedPlanId = query.get('selected-plan') ?? 0;
    const selectedChatPlanId = query.get('chatPlanId') ?? 0;
    const selectedAddOnPlanId = query.get('addOnPlanId') ?? 0;
    const monthPlan = query.get('monthPlan') ?? 0;
    const landingIdsStr = query.get('landing-ids') ?? '';
    const landingsQtyStr = query.get('landing-packs') ?? '';
    const buyType = parseInt(query.get('buyType') ?? '1');
    const { search } = useLocation();
    const sessionPlan = appSessionRef.current.userData.user;
    const chat = appSessionRef.current.userData.user.chat;
    const { locationCountry } = sessionPlan;
    const isArgentina = locationCountry === 'ar';
    const { isFreeAccount } = sessionPlan.plan;
    const queryParams = getQueryParamsWithAccountType({ search, isFreeAccount });
    const { landingPacks } = useFetchLandingPacks(dopplerAccountPlansApiClient);
    const skipStepsEnabledRef = useRef(true);

    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    const setNextCheckoutStep = async () => {
      let nextStep = activeStep;

      switch (activeStep) {
        case checkoutSteps.contactInformation:
          nextStep = checkoutSteps.billingInformation;
          break;
        case checkoutSteps.billingInformation:
          nextStep = checkoutSteps.paymentInformation;
          break;
        case checkoutSteps.paymentInformation:
          nextStep = checkoutSteps.paymentInformation;
          break;
        default:
          nextStep = checkoutSteps.contactInformation;
          break;
      }

      setActiveStep(() => nextStep);
    };

    const handleContactInformation = useCallback(() => {
      setActiveStep(() => checkoutSteps.billingInformation);
      setCompleteContactInformationStep(true);
    }, []);

    const handleBillingInformation = useCallback(() => {
      setActiveStep(() => checkoutSteps.paymentInformation);
      setCompleteBillingInformationStep(true);
    }, []);

    useEffect(() => {
      dopplerBillingUserApiClient.updatePurchaseIntention();
    });

    useEffect(() => {
      const fetchPlanData = async () => {
        const planData = await dopplerAccountPlansApiClient.getPlanData(selectedPlanId, 1);
        setSelectedFullPlan({ ...planData.value, type: planType, id: selectedPlanId });
      };

      fetchPlanData();
    }, [dopplerAccountPlansApiClient, selectedPlanId, planType]);

    useEffect(() => {
      const fetchPlanData = async () => {
        const planData = await dopplerAccountPlansApiClient.getPlanData(selectedChatPlanId, 2);

        if (planData.success) {
          setSelectedChatPlan({
            planId: selectedChatPlanId,
            conversationsQty: planData.value.chatPlanConversationQty,
            fee: planData.value.chatPlanFee,
            type: planType,
            id: selectedChatPlanId,
          });
        }
      };

      if (selectedChatPlanId !== 0) {
        fetchPlanData();
      }
    }, [dopplerAccountPlansApiClient, selectedChatPlanId, planType]);

    useEffect(() => {
      const fetchPlanData = async () => {
        const planData = await dopplerAccountPlansApiClient.getAddOnPlanData(
          selectedAddOnPlanId,
          buyType === BUY_ONSITE_PLAN
            ? AddOnType.OnSite
            : buyType === BUY_PUSH_NOTIFICATION_PLAN
              ? AddOnType.PushNotifications
              : 0,
        );

        if (planData.success) {
          setSelectedAddOnPlan({
            planId: planData.value.planId,
            quantity: planData.value.quantity,
            fee: planData.value.fee,
            addOnType: planData.value.addOnType,
            id: selectedAddOnPlanId,
          });
        }
      };

      fetchPlanData();
    }, [dopplerAccountPlansApiClient, selectedAddOnPlanId, planType, buyType]);

    useEffect(() => {
      const fetchPaymentFrequency = async () => {
        let paymentFrequencies = [];
        let selectedPaymentFrequencyByDefault = null;

        const paymentFrequenciesData = await dopplerAccountPlansApiClient.getDiscountsData(
          selectedPlanId,
          ['NONE', ''].includes(selectedPaymentMethod)
            ? PaymentMethodType.creditCard
            : selectedPaymentMethod,
        );

        paymentFrequencies = paymentFrequenciesData.success ? paymentFrequenciesData.value : [];
        paymentFrequencies = paymentFrequencies
          .map((pf) => ({
            id: pf.id,
            subscriptionType: pf.description,
            numberMonths: getMonthsByCycle(pf.description),
            discountPercentage: pf.discountPercentage,
            applyPromo: pf.applyPromo,
          }))
          .sort(orderPaymentFrequencies);
        selectedPaymentFrequencyByDefault = paymentFrequenciesData.success
          ? paymentFrequencies.find((pf) => pf.numberMonths.toString() === monthPlan)
          : null;

        setPaymentFrequenciesList(paymentFrequencies);
        setSelectedPaymentFrequency(selectedPaymentFrequencyByDefault ?? paymentFrequencies.at(-1));
      };

      if (planType === PLAN_TYPE.byContact) {
        fetchPaymentFrequency();
      }
    }, [dopplerAccountPlansApiClient, selectedPaymentMethod, planType, selectedPlanId, monthPlan]);

    const handleChangeDiscount = useCallback((discount) => {
      setSelectedDiscountId(discount?.selectedPaymentFrequency?.id);
      setSelectedMonthPlan(discount?.selectedPaymentFrequency?.monthsAmmount);
      setSelectedPaymentFrequency(discount?.selectedPaymentFrequency);
    }, []);

    const isMonthlySubscription = appSessionRef.current.userData.user.plan.planSubscription === 1;
    const isEqualPlan = sessionPlan.plan.idPlan === selectedPlanId;
    const isPlanByContacts = planType === PLAN_TYPE.byContact;

    const landingIds = landingIdsStr?.split(',') ?? [];
    const landingsQty = landingsQtyStr?.split(',') ?? [];
    const selectedLandings = landingPacks
      ?.filter((lp) => landingIds.includes(lp.planId?.toString()))
      ?.map((lp, index) => ({
        ...lp,
        packagesQty: Number(landingsQty[index]),
      }));

    const isBuyLandingPacks = selectedLandings?.length > 0;
    const isBuyAddOnPlan =
      parseInt(buyType) === BUY_ONSITE_PLAN || parseInt(buyType) === BUY_PUSH_NOTIFICATION_PLAN;

    return (
      <>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h2 className="dp-first-order-title">{_('checkoutProcessForm.title')}</h2>
          </div>
        </HeaderSection>
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-md-12 col-lg-8 m-b-24">
              <div className="dp-wrapper-payment-process">
                <ul className="dp-accordion">
                  <Step
                    active={activeStep === checkoutSteps.contactInformation}
                    title={_('checkoutProcessForm.contact_information_title')}
                    complete={completeContactInformationStep}
                    stepNumber={1}
                    onActivate={() => {
                      if (skipStepsEnabledRef?.current) {
                        skipStepsEnabledRef.current = false;
                      }
                      setActiveStep(checkoutSteps.contactInformation);
                    }}
                  >
                    <ContactInformation
                      handleSaveAndContinue={handleContactInformation}
                      skipStepsEnabledRef={skipStepsEnabledRef}
                    />
                  </Step>
                  <Step
                    active={activeStep === checkoutSteps.billingInformation}
                    title={_('checkoutProcessForm.billing_information_title')}
                    complete={completeBillingInformationStep}
                    stepNumber={2}
                    onActivate={() => {
                      if (skipStepsEnabledRef?.current) {
                        skipStepsEnabledRef.current = false;
                      }
                      setActiveStep(checkoutSteps.billingInformation);
                    }}
                  >
                    <BillingInformation
                      handleSaveAndContinue={handleBillingInformation}
                      skipStepsEnabledRef={skipStepsEnabledRef}
                    />
                  </Step>
                  <Step
                    active={activeStep === checkoutSteps.paymentInformation}
                    title={_('checkoutProcessForm.payment_method.title')}
                    complete={
                      paymentInformationAction === actionPage.READONLY &&
                      completeContactInformationStep &&
                      completeBillingInformationStep
                    }
                    stepNumber={3}
                    onActivate={() => {
                      setPaymentInformationAction(actionPage.UPDATE);
                      setActiveStep(checkoutSteps.paymentInformation);
                    }}
                    lastStep={true}
                  >
                    <PaymentMethod
                      optionView={paymentInformationAction}
                      appliedPromocode={appliedPromocode}
                      handleChangeView={(view) => {
                        setPaymentInformationAction(view);
                      }}
                      handleSaveAndContinue={() => {
                        setNextCheckoutStep(activeStep);
                        setPaymentInformationAction(actionPage.READONLY);
                      }}
                      handleChangeDiscount={handleChangeDiscount}
                      handleChangePaymentMethod={(paymentMethod) => {
                        setSelectedPaymentMethod(paymentMethod);
                      }}
                    />
                  </Step>
                </ul>
              </div>
            </div>
            <div className="dp-space-l24"></div>
            <div className="col-lg-4 col-sm-12">
              {isBuyLandingPacks ? (
                <ShoppingCart
                  canBuy={
                    paymentInformationAction === actionPage.READONLY &&
                    completeContactInformationStep &&
                    completeBillingInformationStep
                  }
                  discountConfig={{
                    paymentFrequenciesList: paymentFrequenciesListForLandingPacks,
                    selectedPaymentFrequency: paymentFrequenciesListForLandingPacks.find(
                      (pf) => pf.numberMonths === sessionPlan.plan.planSubscription,
                    ),
                    onSelectPaymentFrequency: () => null,
                    disabled: true,
                    showBanner: false,
                    currentSubscriptionUser: sessionPlan.plan.planSubscription,
                  }}
                  isMonthlySubscription={isMonthlySubscription}
                  landingPacks={selectedLandings}
                  isEqualPlan={false}
                  hidePromocode={true}
                  buyType={BUY_LANDING_PACK}
                />
              ) : isBuyAddOnPlan ? (
                <ShoppingCart
                  canBuy={
                    paymentInformationAction === actionPage.READONLY &&
                    completeContactInformationStep &&
                    completeBillingInformationStep
                  }
                  discountConfig={{
                    paymentFrequenciesList: paymentFrequenciesList,
                    selectedPaymentFrequency: selectedPaymentFrequency,
                    onSelectPaymentFrequency: handleChangeDiscount,
                    disabled: !isPlanByContacts || isEqualPlan || !isFreeAccount,
                    currentSubscriptionUser: sessionPlan.plan.planSubscription,
                  }}
                  isMonthlySubscription={isMonthlySubscription}
                  selectedMarketingPlan={selectedFullPlan}
                  isEqualPlan={false}
                  hidePromocode={true}
                  buyType={buyType}
                  selectedAddOnPlan={selectedAddOnPlan}
                  canAddOnPlanRemove={false}
                  addMarketingPlan={parseInt(buyType) === BUY_MARKETING_PLAN}
                />
              ) : (
                <ShoppingCart
                  canBuy={
                    paymentInformationAction === actionPage.READONLY &&
                    completeContactInformationStep &&
                    completeBillingInformationStep
                  }
                  discountConfig={{
                    paymentFrequenciesList: paymentFrequenciesList,
                    selectedPaymentFrequency: selectedPaymentFrequency,
                    onSelectPaymentFrequency: handleChangeDiscount,
                    disabled: !isPlanByContacts || isEqualPlan || !isFreeAccount,
                    currentSubscriptionUser: sessionPlan.plan.planSubscription,
                  }}
                  isMonthlySubscription={isMonthlySubscription}
                  selectedMarketingPlan={selectedFullPlan}
                  //items={[selectedFullPlan, {...selectedChatPlan, isRemovible: false}]}
                  isEqualPlan={false}
                  isArgentina={isArgentina}
                  selectedPlanChat={selectedChatPlan}
                  canChatPlanRemove={false}
                  buyType={parseInt(buyType)}
                  addMarketingPlan={parseInt(buyType) === BUY_MARKETING_PLAN}
                  hasChatActive={chat && chat.active}
                />
              )}
            </div>
          </div>
          <div className="dp-rowflex">
            <div className="col-lg-12 col-md-6 col-sm-12 m-b-24"></div>
            <div className="col-sm-12 m-b-24">
              <hr className="dp-h-divider" />
              {isBuyLandingPacks ? (
                <Link
                  to={`/landing-packages?buyType=${BUY_LANDING_PACK}`}
                  className="dp-button button-medium primary-grey m-t-30 m-r-24"
                >
                  {_('checkoutProcessForm.button_back')}
                </Link>
              ) : isBuyAddOnPlan ? (
                <Link
                  to={`${
                    buyType === BUY_ONSITE_PLAN
                      ? '/buy-onsite-plans'
                      : '/buy-push-notification-plans'
                  }?buyType=${buyType}`}
                  className="dp-button button-medium primary-grey m-t-30 m-r-24"
                >
                  {_('checkoutProcessForm.button_back')}
                </Link>
              ) : (
                <Link
                  to={`/${
                    chat && chat.active ? `plan-chat` : `plan-selection`
                  }/${pathType}/${getPlanTypeFromLegacyPlanType(planType)}${
                    queryParams ? `?${queryParams}` : ''
                  }`}
                  className="dp-button button-medium primary-grey m-t-30 m-r-24"
                >
                  {_('checkoutProcessForm.button_back')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </>
    );
  },
);

export default InjectAppServices(Checkout);
