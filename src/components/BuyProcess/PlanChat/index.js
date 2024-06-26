import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../services/pure-di';
import { thousandSeparatorNumber } from '../../../utils';
import { BreadcrumbNew, BreadcrumbNewItem } from '../../shared/BreadcrumbNew';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { Slider } from '../Slider';
import { useConversationPlans } from '../../../hooks/useFetchConversationPlans';
import { Loading } from '../../Loading/Loading';
import { UnexpectedError } from '../UnexpectedError';
import { SelectedPlanChat } from './SelectedPlanChat';
import { PlanChatInfo } from './PlanChatInfo';
import { BUY_LANDING_PACK, ShoppingCart } from '../ShoppingCart';
import { paymentFrequenciesListFake } from '../../../doppler-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PlanBenefits } from './PlanBenefits';

export const PlanChat = InjectAppServices(
  ({ dependencies: { dopplerAccountPlansApiClient, appSessionRef } }) => {
    const [item, setItem] = useState(null);
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

    useEffect(() => {
      if (itemRef.current) {
        addItem(selectedPlan);
      }
    }, [selectedPlan, addItem]);

    const handleSliderChange = (e) => {
      const { value } = e.target;
      const _selectedPlanIndex = parseInt(value);
      handleSliderValue(_selectedPlanIndex);
    };

    const addItem = useCallback((item) => setItem(item), []);
    const removeItem = () => {
      setItem(null);
      handleSliderChange({ target: { value: 0 } });
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
            <BreadcrumbNew>
              <BreadcrumbNewItem
                href={_('buy_process.plan_selection.breadcumb_plan_url')}
                text={_('buy_process.plan_selection.breadcumb_plan_text')}
              />
              <BreadcrumbNewItem
                href={_('buy_process.plan_selection.breadcumb_plan_url')}
                text={'Plan de chat'}
              />
            </BreadcrumbNew>
            <h2 className="dp-first-order-title">
              Quieres agregar un plan de chat?
              <span className="dpicon iconapp-chatting" />
            </h2>
          </div>
        </HeaderSection>
        <div className="dp-container p-b-48">
          <div className="dp-rowflex">
            <div className="col-md-12 col-lg-8 m-b-24">
              <PlanChatInfo />
              <section className="m-t-42">
                <h3 className="dp-second-order-title">
                  ¿Cuántas conversaciones necesitas por mes?
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
                  *Recuerda que al contratar un plan de conversaciones, finalizara de manera
                  automática la versión de prueba de tres meses.
                </span>
              </section>
              <PlanBenefits />
            </div>
            <div className="col-lg-4 col-sm-12">
              <ShoppingCart
                discountConfig={{
                  paymentFrequenciesList: paymentFrequenciesListFake,
                  selectedPaymentFrequency: paymentFrequenciesListFake.find(
                    (pf) => pf.numberMonths === sessionPlan.plan.planSubscription,
                  ),
                  onSelectPaymentFrequency: () => null,
                  disabled: true,
                  showBanner: false,
                  currentSubscriptionUser: sessionPlan.plan.planSubscription,
                }}
                isMonthlySubscription={isMonthlySubscription}
                selectedPlanChat={item}
                handleRemovePlanChat={removeItem}
                isEqualPlan={false}
                hidePromocode={true}
                buyType={BUY_LANDING_PACK}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);
