import { useCallback, useEffect, useRef, useState } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { AddOnType, BUY_ONSITE_PLAN, PLAN_TYPE, PaymentMethodType } from '../../../doppler-types';
import { getMonthsByCycle, orderPaymentFrequencies } from '../../../utils';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { useIntl } from 'react-intl';
import { OnSitePlanInformation } from './OnSitePlanInformation';
import { Loading } from '../../Loading/Loading';
import { UnexpectedError } from '../UnexpectedError';
import { Slider } from '../Slider';
import { SelectedOnSitePlan } from './SelectedOnSitePlan';
import { GoBackButton } from '../PlanSelection/GoBackButton';
import { ShoppingCart } from '../ShoppingCart';
import * as S from './styles';
import { BannerUpgrade } from '../BannerUpgrade';
import { useAddOnPlans } from '../../../hooks/useFetchAddOnPlans';

export const OnSitePlansSelection = InjectAppServices(
  ({ dependencies: { dopplerAccountPlansApiClient, appSessionRef } }) => {
    const selectedPaymentMethod = PaymentMethodType.creditCard;
    const [paymentFrequenciesList, setPaymentFrequenciesList] = useState([]);
    const [selectedPaymentFrequency, setSelectedPaymentFrequency] = useState(null);
    const [selectedMarketingPlan, setSelectedMarketingPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState(null);
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [
      {
        addOnPlansValues,
        loading: loadingAddOnPlans,
        hasError: hasErrorAddOnPlans,
        selectedPlan,
        selectedPlanIndex,
        customAddOnPlans,
      },
      handleSliderValue,
    ] = useAddOnPlans(AddOnType.OnSite, dopplerAccountPlansApiClient, appSessionRef);

    const itemRef = useRef(null);
    itemRef.current = item;

    const addItem = useCallback((item) => setItem(item), []);
    const removeItem = () => {
      setItem(null);
      handleSliderChange({ target: { value: 0 } });
    };

    const selectedPlanId = appSessionRef.current.userData.user.plan.idPlan;
    const planType = appSessionRef.current.userData.user.plan.planType;
    const monthPlan = appSessionRef.current.userData.user.plan.planSubscription;

    useEffect(() => {
      itemRef.current = selectedPlanIndex >= 1 ? selectedPlan : null;
      if (item === null) {
        if (itemRef.current) {
          addItem(selectedPlan);
        }
      }
    }, [selectedPlan, selectedPlanIndex, item, addItem]);

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
      const fetchPlanData = async () => {
        const planData = await dopplerAccountPlansApiClient.getPlanData(selectedPlanId, 1);
        setSelectedMarketingPlan({ ...planData.value, type: planType, id: selectedPlanId });
        setLoading(false);
      };

      fetchPlanData();
    }, [dopplerAccountPlansApiClient, selectedPlanId, planType]);

    const handleSliderChange = (e) => {
      const { value } = e.target;
      const _selectedPlanIndex = parseInt(value);
      handleSliderValue(_selectedPlanIndex);
    };

    const handleSliderClick = () => {
      if (itemRef.current) {
        addItem(selectedPlan);
      } else {
        setItem(null);
      }
    };

    if (loadingAddOnPlans || loading) {
      return <Loading page />;
    }

    if (hasErrorAddOnPlans) {
      return <UnexpectedError />;
    }

    return (
      <>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h2 className="dp-first-order-title">
              {_('onsite_selection.title')} <span className="dpicon iconapp-online-clothing" />
            </h2>
          </div>
        </HeaderSection>
        <div className="dp-container p-b-48">
          <div className="dp-rowflex">
            <div className="col-md-12 col-lg-8 m-b-24">
              <OnSitePlanInformation />
              <section className="m-t-42">
                <div className="dp-rowflex">
                  <h3 className="dp-second-order-title">
                    {_('onsite_selection.how_many_prints_need_message')}
                  </h3>
                  <S.TooltipPanel>
                    <div className="dp-tooltip-container onsite-tooltip-container">
                      <span className="ms-icon icon-header-help"></span>
                      <div className="dp-tooltip-top">
                        <span>{_('onsite_selection.info_tooltip')}</span>
                      </div>
                    </div>
                  </S.TooltipPanel>
                </div>

                <Slider
                  items={addOnPlansValues}
                  selectedItemIndex={selectedPlanIndex}
                  handleChange={handleSliderChange}
                  moreOptionTickmark={{ label: _('chat_selection.more_option_tickmark_message') }}
                  handleOnClick={handleSliderClick}
                />
                <BannerUpgrade
                  currentPlan={selectedPlan}
                  messageId={'onsite_selection.banner_for_prints'}
                />
              </section>
              <section>
                <SelectedOnSitePlan
                  selectedPlan={selectedPlan}
                  item={item}
                  addItem={addItem}
                  removeItem={removeItem}
                  customPlan={customAddOnPlans[0]}
                />
                <span className="dp-reminder">
                  {_('onsite_selection.expiration_free_plan_message')}
                </span>
              </section>
              <hr className="dp-separator" />
              <div className="m-t-18 m-b-18">
                <GoBackButton />
              </div>
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
                buyType={BUY_ONSITE_PLAN}
                disabledPromocode={true}
                addMarketingPlan={false}
                canAddOnPlanRemove={true}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);
