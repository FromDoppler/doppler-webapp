import { useCallback, useEffect, useReducer, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { PLAN_TYPE } from '../../../doppler-types';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
import { InjectAppServices } from '../../../services/pure-di';
import { getPlanTypeFromUrlSegment, thousandSeparatorNumber } from '../../../utils';
import { Loading } from '../../Loading/Loading';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import { NavigationTabs } from '../NavigationTabs';
import { ShoppingCart } from '../ShoppingCart';
import { Slider } from '../Slider';
import { UnexpectedError } from '../UnexpectedError';
import { BannerUpgrade } from './BannerUpgrade';
import {
  INITIAL_STATE_PLANS_BY_TYPE,
  plansByTypeReducer,
  PLANS_BY_TYPE_ACTIONS,
} from './reducers/plansByTypeReducer';
import {
  INITIAL_STATE_PLAN_TYPES,
  planTypesReducer,
  PLAN_TYPES_ACTIONS,
} from './reducers/planTypesReducer';
import { useDefaultPlanType } from '../../../hooks/useDefaultPlanType';
import { GoBackButton } from './GoBackButton';

const planTypesLabels = {
  [PLAN_TYPE.byContact]: 'contactos',
  [PLAN_TYPE.byEmail]: 'envíos',
  [PLAN_TYPE.byCredit]: 'créditos',
};

export const PlanSelection = InjectAppServices(
  ({ dependencies: { planService, appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { planType: planTypeUrlSegment } = useParams();
    const selectedPlanType = getPlanTypeFromUrlSegment(planTypeUrlSegment);
    const sessionPlan = appSessionRef.current.userData.user;
    const { isFreeAccount } = appSessionRef.current.userData.user.plan;
    const { locationCountry } = sessionPlan;
    const chat = appSessionRef.current.userData.user.chat;
    const isArgentina = locationCountry === 'ar';
    const currentUserPlanType = appSessionRef.current.userData.user.plan.planType;

    const [chatPlan, setChatPlan] = useState({ cant: 10000 });
    const { search } = useLocation();
    const [{ planTypes, loading, hasError }, dispatch] = useReducer(
      planTypesReducer,
      INITIAL_STATE_PLAN_TYPES,
    );
    const [
      {
        selectedPlanIndex,
        selectedPlan,
        plansByType,
        sliderValuesRange,
        discounts,
        selectedDiscount,
        hasError: hasErrorPlansByType,
      },
      dispatchPlansByType,
    ] = useReducer(plansByTypeReducer, INITIAL_STATE_PLANS_BY_TYPE);
    useDefaultPlanType({ appSessionRef, planTypeUrlSegment, window });

    useEffect(() => {
      const fetchData = async () => {
        try {
          dispatch({ type: PLAN_TYPES_ACTIONS.FETCHING_STARTED });
          const _planTypes = await planService.getDistinctPlans();
          dispatch({ type: PLAN_TYPES_ACTIONS.RECEIVE_PLAN_TYPES, payload: _planTypes });
        } catch (error) {
          dispatch({ type: PLAN_TYPES_ACTIONS.FETCH_FAILED });
        }
      };
      fetchData();
    }, [planService]);

    useEffect(() => {
      const fetchPlansByType = async () => {
        try {
          dispatchPlansByType({ type: PLANS_BY_TYPE_ACTIONS.START_FETCH });
          const _plansByType = await planService.getPlansByType(
            getPlanTypeFromUrlSegment(planTypeUrlSegment),
          );
          dispatchPlansByType({
            type: PLANS_BY_TYPE_ACTIONS.FINISH_FETCH,
            payload: {
              plansByType: _plansByType,
              currentSubscriptionUser: appSessionRef.current.userData.user.plan.planSubscription,
              currentPlanUser: appSessionRef.current.userData.user.plan.idPlan,
              currentPlanType: appSessionRef.current.userData.user.plan.planType,
            },
          });
        } catch (error) {
          dispatchPlansByType({ type: PLANS_BY_TYPE_ACTIONS.FAIL_FETCH });
        }
      };

      if (planTypes.length > 0) {
        fetchPlansByType();
      }
    }, [planService, appSessionRef, planTypeUrlSegment, planTypes]);

    const handleSliderChange = (e) => {
      const { value } = e.target;
      const _selectedPlanIndex = parseInt(value);
      dispatchPlansByType({
        type: PLANS_BY_TYPE_ACTIONS.SELECT_PLAN,
        payload: _selectedPlanIndex,
      });
    };

    const handleDiscountChange = useCallback((discount) => {
      dispatchPlansByType({
        type: PLANS_BY_TYPE_ACTIONS.SELECT_DISCOUNT,
        payload: discount.selectedPaymentFrequency,
      });
    }, []);

    if (!hasError && !loading && planTypes.length === 0) {
      return <Navigate to="/upgrade-suggestion-form" />;
    }

    if (loading) {
      return <Loading page />;
    }

    if (hasError || hasErrorPlansByType || selectedPlanType === 'unknown') {
      return <UnexpectedError />;
    }

    const isEqualPlan = sessionPlan.plan.idPlan === selectedPlan?.id;
    const hightestPlan = plansByType.length === 1 && isEqualPlan;
    const isMonthlySubscription = sessionPlan.plan.planSubscription === 1;
    const isPlanByContacts = selectedPlanType === PLAN_TYPE.byContact;

    return (
      <>
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h2 className="dp-first-order-title">
              {_(`buy_process.plan_selection.plan_title`)}
              <span className="dpicon iconapp-email-alert" />
            </h2>
          </div>
        </HeaderSection>
        <div className="dp-container p-b-48">
          <div className="dp-rowflex">
            <div className="col-lg-8 col-md-12">
              <div className="dp-container p-b-48">
                <div className="dp-rowflex">
                  <div className="col-sm-12">
                    <h3 className="dp-second-order-title">
                      {_('buy_process.plan_selection.plan_type')}
                    </h3>
                    <div className="m-b-24">
                      <FormattedMessageMarkdown
                        linkTarget={'_blank'}
                        id="buy_process.plan_selection.plan_subtitle_description_MD"
                      />
                    </div>
                    <NavigationTabs
                      planTypes={planTypes}
                      selectedPlanType={selectedPlanType}
                      searchQueryParams={search}
                      currentPlanType={currentUserPlanType}
                    />
                  </div>
                  <div className="col-sm-12 m-t-36">
                    <h3 className="dp-second-order-title">
                      <FormattedMessage
                        id={`buy_process.plan_selection.plan_type_units`}
                        values={{
                          units: _(
                            `buy_process.plan_selection.plan_type_${selectedPlanType.replace(
                              '-',
                              '_',
                            )}_label`,
                          ).toLowerCase(),
                        }}
                      />
                    </h3>
                    {!hightestPlan && (
                      <Slider
                        items={sliderValuesRange}
                        selectedItemIndex={selectedPlanIndex}
                        handleChange={handleSliderChange}
                        labelQuantity={`${thousandSeparatorNumber(
                          intl.defaultLocale,
                          sliderValuesRange[selectedPlanIndex],
                        )} ${planTypesLabels[selectedPlanType]}`}
                      />
                    )}
                    <BannerUpgrade
                      currentPlan={selectedPlan}
                      currentPlanList={plansByType}
                      planTypes={planTypes}
                      hightestPlan={hightestPlan}
                    />
                  </div>
                </div>
              </div>
              <hr className="dp-separator" />
              <div className="m-t-18 m-b-18">
                <GoBackButton />
              </div>
            </div>
            <div className="col-lg-4 col-sm-12">
              <ShoppingCart
                discountConfig={{
                  paymentFrequenciesList: discounts,
                  selectedPaymentFrequency: selectedDiscount,
                  onSelectPaymentFrequency: handleDiscountChange,
                  disabled: !isPlanByContacts || isEqualPlan || !isFreeAccount,
                  currentSubscriptionUser: sessionPlan.plan.planSubscription,
                }}
                isMonthlySubscription={isMonthlySubscription}
                selectedMarketingPlan={selectedPlan}
                selectedChatPlan={
                  chatPlan
                    ? {
                        ...chatPlan,
                        handleRemove: () => setChatPlan(null),
                      }
                    : null
                }
                items={[selectedPlan]}
                isEqualPlan={isEqualPlan}
                isArgentina={isArgentina}
                hasChatActive={chat && chat.active}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);
