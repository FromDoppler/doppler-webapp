import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { PlanInformation } from './PlanInformation';
import { ShoppingCart } from '../ShoppingCart';
import { AddOnType, BUY_ECO_IA_PLAN, PaymentMethodType, PLAN_TYPE } from '../../../doppler-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAddOnPlans } from '../../../hooks/useFetchAddOnPlans';
import { getMonthsByCycle, orderPaymentFrequencies } from '../../../utils';
import { getPromotionInformationMessage } from '../utils';
import { Packs } from './Packs';
import { Loading } from '../../Loading/Loading';
import { Navigate } from 'react-router-dom';
import RedirectToExternalUrl from '../../RedirectToExternalUrl';

export const EcoAIPlanSelection = InjectAppServices(
  ({ dependencies: { dopplerAccountPlansApiClient, appSessionRef } }) => {
    const selectedPaymentMethod = PaymentMethodType.creditCard;
    const [paymentFrequenciesList, setPaymentFrequenciesList] = useState([]);
    const [selectedPaymentFrequency, setSelectedPaymentFrequency] = useState(null);
    const [selectedMarketingPlan, setSelectedMarketingPlan] = useState(null);
    const [packsFormValues, setPacksFormValues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPromotionInformation, setShowPromotionInformation] = useState(false);
    const [item, setItem] = useState(null);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [{ addOnPlans, selectedPlan, selectedPlanIndex }] = useAddOnPlans(
      AddOnType.EcoAI,
      dopplerAccountPlansApiClient,
      appSessionRef,
    );

    const ecoIA = appSessionRef.current.userData.user.addOnPlans?.filter(
      (aop) => aop.plan?.addOnTypeId === AddOnType.EcoAI,
    )[0];

    const canBuyEcoIAPlan = appSessionRef?.current?.userData?.features?.ecoIAEnabled;

    const itemRef = useRef(null);
    itemRef.current = item;

    const addItem = useCallback((item) => setItem(item), []);
    const removeItem = () => {
      handleRemove();
    };

    const plan = appSessionRef.current.userData.user.plan;
    const selectedPlanId = appSessionRef.current.userData.user.plan.idPlan;
    const planType = appSessionRef.current.userData.user.plan.planType;
    const monthPlan = appSessionRef.current.userData.user.plan.planSubscription;

    const iaAgentPromotions = useMemo(
      () =>
        appSessionRef.current.userData.user.addOnPromotions !== undefined
          ? appSessionRef.current.userData.user.addOnPromotions.filter(
              (aop) => aop.idAddOnType === AddOnType.EcoAI,
            )
          : [],
      [appSessionRef],
    );

    useEffect(() => {
      itemRef.current = selectedPlanIndex >= 1 ? selectedPlan : null;
      if (item === null) {
        if (itemRef.current) {
          const iaAgentPromotion = iaAgentPromotions.filter(
            (pn) => pn?.idAddOnPlan !== undefined && pn?.idAddOnPlan !== selectedPlan.planId,
          )[0];
          setShowPromotionInformation(iaAgentPromotion && !selectedPlan.active);
          addItem(selectedPlan);
        }
      }
    }, [selectedPlan, selectedPlanIndex, item, addItem, iaAgentPromotions]);

    useEffect(() => {
      const plans = addOnPlans
        ?.filter((ap) => ap.planId > 0)
        .map((ap) => ({ ...ap, packagesQty: 1 }));
      setPacksFormValues(plans);
      setItem(plans[0]);
    }, [addOnPlans]);

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
          ? paymentFrequencies.find((pf) => pf.numberMonths.toString() === monthPlan.toString())
          : null;

        setPaymentFrequenciesList(paymentFrequencies);
        setSelectedPaymentFrequency(selectedPaymentFrequencyByDefault ?? paymentFrequencies.at(-1));
      };

      if (planType === PLAN_TYPE.byContact) {
        fetchPaymentFrequency();
      }
    }, [dopplerAccountPlansApiClient, selectedPaymentMethod, planType, selectedPlanId, monthPlan]);

    useEffect(() => {
      if (!canBuyEcoIAPlan || plan.isFreeAccount) {
        return;
      }

      const fetchPlanData = async () => {
        const planData = await dopplerAccountPlansApiClient.getPlanData(selectedPlanId, 1);
        setSelectedMarketingPlan({ ...planData.value, type: planType, id: selectedPlanId });
        setLoading(false);
      };

      fetchPlanData();
    }, [
      canBuyEcoIAPlan,
      dopplerAccountPlansApiClient,
      plan.isFreeAccount,
      selectedPlanId,
      planType,
    ]);

    const handleRemove = () => {
      const resetForm = async () => {
        var packs = packsFormValues?.map((p) => ({ ...p, packagesQty: 0 }));
        setPacksFormValues(packs);
        setItem(null);
      };

      resetForm();
    };

    if (!canBuyEcoIAPlan) {
      return <Navigate to="/dashboard" />;
    }

    if (plan.isFreeAccount) {
      return <RedirectToExternalUrl to={plan.buttonUrl} />;
    }

    if (loading) {
      return <Loading page />;
    }

    const canAddOnPlanContinueBuy = ecoIA.plan.planId === 0;

    return (
      <>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h2 className="dp-first-order-title">
              {_('eco_ai_selection.title')} <span className="dpicon icon-sparkle-ia" />
            </h2>
          </div>
        </HeaderSection>
        <div className="dp-container p-b-48">
          <div className="dp-rowflex">
            <div className="col-md-12 col-lg-8 m-b-24">
              <div className="p-b-48">
                <PlanInformation />
              </div>
              <Packs
                packs={packsFormValues}
                handleRemove={handleRemove}
                hasPlan={ecoIA?.active === true}
              />
              {showPromotionInformation && (
                <section>
                  <div className="dp-wrap-message dp-wrap-info">
                    <span className="dp-message-icon"></span>
                    <div className="dp-content-message dp-content-full">
                      <p>
                        {getPromotionInformationMessage(
                          'eco_ai_selection',
                          appSessionRef.current.userData.user,
                          iaAgentPromotions,
                        )}
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>
            <div className="col-lg-4 col-sm-12">
              <ShoppingCart
                discountConfig={{
                  onSelectPaymentFrequency: () => null,
                  paymentFrequenciesList: paymentFrequenciesList,
                  selectedPaymentFrequency: selectedPaymentFrequency,
                  disabled: true,
                  currentSubscriptionUser: monthPlan,
                }}
                isMonthlySubscription={monthPlan === 1}
                selectedMarketingPlan={selectedMarketingPlan}
                selectedAddOnPlan={item}
                handleRemoveAddOnPlan={removeItem}
                isEqualPlan={false}
                buyType={BUY_ECO_IA_PLAN}
                disabledPromocode={true}
                addMarketingPlan={false}
                canAddOnPlanRemove={false}
                canAddOnPlanContinueBuy={canAddOnPlanContinueBuy}
              ></ShoppingCart>
            </div>
          </div>
        </div>
      </>
    );
  },
);
