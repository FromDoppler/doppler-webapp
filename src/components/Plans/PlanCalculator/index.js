import React, { useEffect, useReducer, useState } from 'react';
import { useIntl } from 'react-intl';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../doppler-types';
import { useQueryParams } from '../../../hooks/useQueryParams';
import useTimeout from '../../../hooks/useTimeout';
import { useUserTypeAsQueryParam } from '../../../hooks/useUserTypeAsQueryParam';
import { InjectAppServices } from '../../../services/pure-di';
import { getPlanTypeFromUrlSegment } from '../../../utils';
import { FAQ } from '../../FAQ';
import { topics } from '../../FAQ/constants';
import { Loading } from '../../Loading/Loading';
import { BannerUpgrade } from './BannerUpgrade/BannerUpgrade';
import { Discounts } from './Discounts';
import * as S from './index.styles';
import { NavigatorTabs } from './NavigatorTabs/NavigatorTabs';
import { PlanCalculatorButtons } from './PlanCalculatorButtons';
import { PlanPrice } from './PlanPrice';
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
import {
  INITIAL_STATE_PROMOCODE,
  promocodeReducer,
  PROMOCODE_ACTIONS,
} from './reducers/promocodeReducer';
import { Slider } from './Slider';
import { SubscriptionType } from './SubscriptionType';
import { UnexpectedError } from './UnexpectedError';

export const PlanCalculator = InjectAppServices(
  ({ dependencies: { dopplerAccountPlansApiClient, planService, appSessionRef } }) => {
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
    const [{ promotion, loading: loadingPromocode }, dispatchPromocode] = useReducer(
      promocodeReducer,
      INITIAL_STATE_PROMOCODE,
    );
    const [activeClass, setActiveClass] = useState('active');
    const createTimeout = useTimeout();
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { planType: planTypeUrlSegment } = useParams();
    const selectedPlanType = getPlanTypeFromUrlSegment(planTypeUrlSegment);
    const sessionPlan = appSessionRef.current.userData.user;
    const query = useQueryParams();
    const navigate = useNavigate();
    const { isFreeAccount } = appSessionRef.current.userData.user.plan;
    useUserTypeAsQueryParam(isFreeAccount);

    useEffect(() => {
      const fetchData = async () => {
        try {
          dispatch({ type: PLAN_TYPES_ACTIONS.FETCHING_STARTED });
          const _planTypes = await planService.getPlanTypes();
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

    useEffect(() => {
      setActiveClass('');
      createTimeout(() => setActiveClass('active'), 0);
    }, [planTypeUrlSegment, createTimeout]);

    useEffect(() => {
      const promocode = query.get('promo-code') ?? query.get('PromoCode') ?? '';

      const validatePromocode = async () => {
        dispatchPromocode({ type: PROMOCODE_ACTIONS.START_FETCH });
        const validateData = await dopplerAccountPlansApiClient.validatePromocode(
          selectedPlan.id,
          promocode,
        );
        if (!validateData.success) {
          // TODO: define action to take when promocode is invalid
          dispatchPromocode({ type: PROMOCODE_ACTIONS.FAIL_FETCH });
        } else {
          dispatchPromocode({
            type: PROMOCODE_ACTIONS.FINISH_FETCH,
            payload: validateData.value,
          });
        }
      };
      if (selectedPlan && promocode) {
        validatePromocode();
      }
    }, [dopplerAccountPlansApiClient, query, selectedPlan]);

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

    useEffect(() => {
      const urlToRedirect = getDefaultPlanType({
        currentPlan: appSessionRef.current.userData.user.plan,
        planTypeUrlSegment,
        window,
      });
      if (urlToRedirect) {
        navigate(urlToRedirect);
      }
    }, [appSessionRef, planTypeUrlSegment, navigate]);

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

    const promocode = query.get('promo-code') ?? query.get('PromoCode') ?? '';
    const hasPromocode = !!promocode;

    const isMonthlySubscription = sessionPlan.plan.planSubscription === 1;

    return (
      <>
        <section className="p-t-54 p-b-54">
          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="col-sm-12 text-align--center">
                <h1 className="dp-tit-plans">{_(`plan_calculator.plan_premium_title`)}</h1>
                <p>{_(`plan_calculator.plan_premium_subtitle`)}</p>
                <div className="dp-align-center dp-tabs-plans col-sm-9">
                  <NavigatorTabs tabs={planTypes} selectedPlanType={selectedPlanType} />
                </div>
                <S.PlanTabContainer className="col-sm-12">
                  <article className={`tab--content ${activeClass}`}>
                    <div className="dp-container">
                      <div className="dp-rowflex">
                        <div className="dp-calc-box">
                          <div className="col-md-6 col-sm-12">
                            <article className="dp-box-shadow dp-bgplan">
                              <Slider
                                planType={selectedPlanType}
                                values={sliderValuesRange}
                                selectedPlanIndex={selectedPlanIndex}
                                handleChange={handleSliderChange}
                                isVisible={!hightestPlan}
                                promotion={promotion}
                              />
                              <BannerUpgrade
                                currentPlan={selectedPlan}
                                currentPlanList={plansByType}
                                planTypes={planTypes}
                              />
                              {isMonthlySubscription ? (
                                discounts.length > 0 && (
                                  <>
                                    <hr />
                                    <Discounts
                                      discounts={discounts}
                                      selectedDiscount={selectedDiscount}
                                      onSelectDiscount={handleDiscountChange}
                                      disabled={promotion.isValid || isEqualPlan}
                                    />
                                  </>
                                )
                              ) : (
                                <>
                                  <hr />
                                  <SubscriptionType
                                    period={selectedDiscount?.numberMonths}
                                    discountPercentage={selectedDiscount?.discountPercentage}
                                  />
                                </>
                              )}
                            </article>
                          </div>
                          <div className="col-md-6 col-sm-12">
                            <PlanPrice
                              selectedPlan={selectedPlan}
                              selectedDiscount={selectedDiscount}
                              promotion={promotion}
                              loadingPromocode={loadingPromocode}
                              hasPromocode={hasPromocode}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </S.PlanTabContainer>
                <PlanCalculatorButtons
                  selectedPlanId={selectedPlan?.id}
                  selectedDiscount={selectedDiscount}
                  selectedMonthPlan={selectedDiscount?.numberMonths}
                />
              </div>
            </div>
          </section>
        </section>
        <FAQ topics={topics} />
      </>
    );
  },
);

export const getDefaultPlanType = ({ currentPlan, planTypeUrlSegment, window }) => {
  const { isFreeAccount: isTrial, planType } = currentPlan;
  if (!isTrial) {
    switch (planType) {
      case PLAN_TYPE.byEmail:
        if (planTypeUrlSegment !== URL_PLAN_TYPE[PLAN_TYPE.byEmail]) {
          return `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byEmail]}${
            window.location.search
          }`;
        }
        break;
      case PLAN_TYPE.byContact:
        if (planTypeUrlSegment !== URL_PLAN_TYPE[PLAN_TYPE.byContact]) {
          return `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}${
            window.location.search
          }`;
        }
        break;
      case PLAN_TYPE.byCredit:
        if (planTypeUrlSegment !== URL_PLAN_TYPE[PLAN_TYPE.byCredit]) {
          return `/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byCredit]}${
            window.location.search
          }`;
        }
        break;
      default:
        // TODO: define scenary
        break;
    }
  }
  return null;
};
