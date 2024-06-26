import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import { getMonthsByCycle, orderPaymentFrequencies, thousandSeparatorNumber } from '../../../utils';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { Slider } from '../Slider';
import { useConversationPlans } from '../../../hooks/useFetchConversationPlans';
import { Loading } from '../../Loading/Loading';
import { UnexpectedError } from '../UnexpectedError';
import { SelectedPlanChat } from './SelectedPlanChat';
import { PlanChatInfo } from './PlanChatInfo';
import { BUY_CHAT_PLAN, ShoppingCart } from '../ShoppingCart';
import { PLAN_TYPE, PaymentMethodType } from '../../../doppler-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PlanBenefits } from './PlanBenefits';
import { GoBackButton } from '../PlanSelection/GoBackButton';
import { useParams } from 'react-router-dom';
import { useQueryParams } from '../../../hooks/useQueryParams';

export const PlanChat = InjectAppServices(
  ({ dependencies: { dopplerAccountPlansApiClient, appSessionRef } }) => {
    const [item, setItem] = useState(null);

    const { planType } = useParams();
    const query = useQueryParams();
    const selectedPlanId = query.get('selected-plan') ?? 0;
    const monthPlan = query.get('monthPlan') ?? 0;
    const [selectedMarketingPlan, setSelectedMarketingPlan] = useState(null);

    const [paymentFrequenciesList, setPaymentFrequenciesList] = useState([]);
    const [selectedPaymentFrequency, setSelectedPaymentFrequency] = useState(null);
    const selectedPaymentMethod = PaymentMethodType.creditCard;

    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const [
      {
        conversationPlansValues,
        loading: loadingConversationPlans,
        hasError: hasErrorConversationPlans,
        selectedPlan,
        selectedPlanIndex,
      },
      handleSliderValue,
    ] = useConversationPlans(dopplerAccountPlansApiClient);
    const sessionPlan = appSessionRef.current.userData.user;
    const isMonthlySubscription = sessionPlan.plan.planSubscription === 1;
    const itemRef = useRef(null);
    itemRef.current = item;

    const addItem = useCallback((item) => setItem(item), []);
    const removeItem = () => {
      setItem(null);
      handleSliderChange({ target: { value: 0 } });
    };

    useEffect(() => {
      if (itemRef.current) {
        addItem(selectedPlan);
      }
    }, [selectedPlan, addItem]);

    useEffect(() => {
      const fetchPlanData = async () => {
        const planData = await dopplerAccountPlansApiClient.getPlanData(selectedPlanId);
        setSelectedMarketingPlan({ ...planData.value, type: planType, id: selectedPlanId });
      };

      fetchPlanData();
    }, [dopplerAccountPlansApiClient, selectedPlanId, planType]);

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

    const handleSliderChange = (e) => {
      const { value } = e.target;
      const _selectedPlanIndex = parseInt(value);
      handleSliderValue(_selectedPlanIndex);
    };

    if (loadingConversationPlans) {
      return <Loading page />;
    }

    if (hasErrorConversationPlans) {
      return <UnexpectedError />;
    }

    return (
      <>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h2 className="dp-first-order-title">
              {_('chat_selection.title')} <span className="dpicon iconapp-chatting" />
            </h2>
          </div>
        </HeaderSection>
        <div className="dp-container p-b-48">
          <div className="dp-rowflex">
            <div className="col-md-12 col-lg-8 m-b-24">
              <PlanChatInfo />
              <section className="m-t-42">
                <h3 className="dp-second-order-title">
                  {_('chat_selection.how_many_conversations_need_message')}
                </h3>
                <Slider
                  items={conversationPlansValues}
                  selectedItemIndex={selectedPlanIndex}
                  handleChange={handleSliderChange}
                  labelQuantity={`${thousandSeparatorNumber(
                    intl.defaultLocale,
                    selectedPlan.conversationsQty ?? 0,
                  )} conversaciones`}
                />
              </section>
              <section>
                <SelectedPlanChat
                  selectedPlan={selectedPlan}
                  item={item}
                  addItem={addItem}
                  removeItem={removeItem}
                />
                <span className="dp-reminder">
                  *{_('chat_selection.expiration_free_plan_message')}.
                </span>
              </section>
              <PlanBenefits selectedPlan={selectedPlan} />
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
                  currentSubscriptionUser: sessionPlan.plan.planSubscription,
                }}
                isMonthlySubscription={isMonthlySubscription}
                selectedPlanChat={item}
                selectedMarketingPlan={selectedMarketingPlan}
                handleRemovePlanChat={removeItem}
                isEqualPlan={false}
                hidePromocode={true}
                buyType={BUY_CHAT_PLAN}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);
