import { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { Navigate, useParams } from 'react-router-dom';
import { PLAN_TYPE } from '../../../doppler-types';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
import { InjectAppServices } from '../../../services/pure-di';
import { getPlanTypeFromUrlSegment } from '../../../utils';
import { Loading } from '../../Loading/Loading';
import { BreadcrumbNew, BreadcrumbNewItem } from '../../shared/BreadcrumbNew';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import NavigationTabs from '../NavigationTabs';
import PaymentFrequency from '../PaymentFrequency';
import { Slider } from '../Slider';
import { UnexpectedError } from '../UnexpectedError';
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
import { SubscriptionType } from './SubscriptionType';

export const PlanSelection = InjectAppServices(
  ({ dependencies: { planService, appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { planType: planTypeUrlSegment } = useParams();
    const selectedPlanType = getPlanTypeFromUrlSegment(planTypeUrlSegment);
    const sessionPlan = appSessionRef.current.userData.user;
    const { isFreeAccount } = appSessionRef.current.userData.user.plan;

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

    const handleDiscountChange = (discount) => {
      dispatchPlansByType({
        type: PLANS_BY_TYPE_ACTIONS.SELECT_DISCOUNT,
        payload: discount,
      });
    };

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
    const hideSlider = plansByType.length === 1 && isEqualPlan;
    const isMonthlySubscription = sessionPlan.plan.planSubscription === 1;
    const isPlanByContacts = selectedPlanType === PLAN_TYPE.byContact;

    return (
      <div className="dp-container">
        <div className="dp-rowflex">
          <HeaderSection>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <BreadcrumbNew>
                <BreadcrumbNewItem
                  href={_('buy_process.plan_selection.breadcumb_plan_url')}
                  text={_('buy_process.plan_selection.breadcumb_plan_text')}
                />
              </BreadcrumbNew>
              <h1 className="m-t-24">
                <span className="dpicon iconapp-email-alert m-r-6" />
                {_(`buy_process.plan_selection.plan_title`)}
              </h1>
              <h2>{_('checkoutProcessSuccess.plan_type')}</h2>
              <FormattedMessageMarkdown
                linkTarget={'_blank'}
                id="buy_process.plan_selection.plan_subtitle_MD"
              />
            </div>
          </HeaderSection>

          <div className="col-sm-12 col-md-8 col-lg-8">
            <NavigationTabs planTypes={planTypes} selectedPlanType={selectedPlanType} />
          </div>

          {!hideSlider && (
            <div className="col-sm-12 col-md-8 col-lg-8">
              <Slider
                items={sliderValuesRange}
                selectedItemIndex={selectedPlanIndex}
                handleChange={handleSliderChange}
              />
            </div>
          )}

          <div className="col-sm-12 col-md-8 col-lg-8">
            {isMonthlySubscription ? (
              discounts.length > 0 && (
                <>
                  <h2>{_('buy_process.payment_frequency')}</h2>
                  <PaymentFrequency
                    discounts={discounts}
                    selectedDiscount={selectedDiscount}
                    onSelectDiscount={handleDiscountChange}
                    disabled={!isPlanByContacts || isEqualPlan || !isFreeAccount}
                  />
                </>
              )
            ) : (
              <SubscriptionType
                period={selectedDiscount?.numberMonths}
                discountPercentage={selectedDiscount?.discountPercentage}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);
