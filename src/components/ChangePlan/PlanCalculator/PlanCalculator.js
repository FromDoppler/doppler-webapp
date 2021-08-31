import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { Slider } from '../../shared/Slider/Slider';
import { TooltipContainer } from '../../TooltipContainer/TooltipContainer';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { useIntl } from 'react-intl';
import queryString from 'query-string';
import { extractParameter } from '../../../utils';
import { useRouteMatch, Link } from 'react-router-dom';
import useTimeout from '../../../hooks/useTimeout';
import * as S from './PlanCalculator.styles';
import { NavigatorTabs } from './NavigatorTabs/NavigatorTabs';
import { Discounts } from './Discounts/Discounts';
import { BannerUpgrade } from './BannerUpgrade/BannerUpgrade';
import { PlanPriceWithoutDiscounts } from './PlanPriceWithoutDiscounts/PlanPriceWithoutDiscounts';
import { PlanPricePerMonth } from './PlanPricePerMonth/PlanPricePerMonth';
import { PlanAgreement } from './PlanAgreement/PlanAgreement';
import { PlanPrice } from './PlanPrice/PlanPrice';
import { getMonthsByCycle, getPlanDescription } from '../../../services/plan-service';

const PlanCalculator = ({ location, dependencies: { planService, appSessionRef } }) => {
  const safePromoId = extractParameter(location, queryString.parse, 'promo-code') || '';
  const discountId = extractParameter(location, queryString.parse, 'discountId') || 0;
  const { pathType, planType } = useRouteMatch().params;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [activeClass, setActiveClass] = useState('active');
  const createTimeout = useTimeout();
  const [state, setState] = useState({ loading: true });

  const actionTypes = {
    UPDATE_SELECTED_PLAN: 'updateSelectedPlan',
    UPDATE_SELECTED_DISCOUNT: 'updateSelectedDiscount',
    INIT: 'init',
  };

  const [planData, dispatchPlanData] = useReducer(
    (prevPlanData, action) => {
      switch (action.type) {
        case actionTypes.UPDATE_SELECTED_PLAN:
          return { ...prevPlanData, plan: state.planList[action.indexPlan] };
        case actionTypes.UPDATE_SELECTED_DISCOUNT:
          return {
            ...prevPlanData,
            discount: state.discountsList.find((discount) => {
              return discount.id === action.idDiscount;
            }),
          };
        case actionTypes.INIT:
          return {
            plan: state.planList[0],
            discount: discountId
              ? state.discountsList?.find((discount) => {
                  return discount.id === discountId;
                }) || state.discountsList[0]
              : state.discountsList
              ? state.discountsList[0]
              : undefined,
          };
        default:
          return prevPlanData;
      }
    },
    { plan: {}, discount: {} },
  );

  useEffect(() => {
    const mapDiscount = (discount) => {
      return {
        id: discount.id,
        description: discount.billingCycle,
        monthsAmmount: getMonthsByCycle(discount.billingCycle),
        discountPercentage: discount.discountPercentage,
      };
    };

    const fetchData = async () => {
      setState({ loading: true });
      const planList = await planService.getPlanList();
      const sessionPlan = appSessionRef.current.userData.user.plan;
      const currentPlan = planService.mapCurrentPlanFromTypeOrId(
        sessionPlan.planType,
        sessionPlan.idPlan,
        planList,
      );
      const planTypes = planService.getPlanTypes(currentPlan, pathType, planList);
      const selectedPlanType = planTypes.includes(planType) ? planType : planTypes[0];
      const plansByType = planService.getPlans(
        currentPlan,
        pathType,
        selectedPlanType,
        planList,
        appSessionRef,
      );
      if (plansByType.length) {
        setState({
          loading: false,
          planList: plansByType,
          discountsList: plansByType[0].billingCycleDetails?.map(mapDiscount),
          planTypes: planTypes,
          selectedPlanType: selectedPlanType,
          planDescriptions: plansByType.map((plan) => {
            return getPlanDescription(plan);
          }),
          success: true,
        });

        dispatchPlanData({
          type: actionTypes.INIT,
        });
      } else {
        setState({ success: false });
      }
    };
    fetchData();
  }, [actionTypes.INIT, appSessionRef, planService, planType, pathType]);

  useEffect(() => {
    setActiveClass('');
    createTimeout(() => setActiveClass('active'), 0);
  }, [planType, createTimeout]);

  const handleDiscountChange = useCallback(
    (discount) => {
      dispatchPlanData({
        type: actionTypes.UPDATE_SELECTED_DISCOUNT,
        idDiscount: discount.id,
      });
    },
    [actionTypes.UPDATE_SELECTED_DISCOUNT],
  );

  if (state.loading) {
    return <Loading page />;
  }
  const sessionPlan = appSessionRef.current.userData.user;
  const isEqualPlan = sessionPlan.plan.idPlan === planData.plan.id;
  const hightestPlan = state.planList.length === 1 && isEqualPlan;

  return state.success ? (
    <section className="dp-gray-page p-t-54 p-b-54">
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12" style={{ textAlign: 'center' }}>
            <h1 className="dp-tit-plans">{_(`plan_calculator.plan_${pathType}_title`)}</h1>
            <p>{_(`plan_calculator.plan_${pathType}_subtitle`)}</p>
            <div className="dp-align-center dp-tabs-plans col-sm-9">
              <NavigatorTabs
                tabs={state.planTypes}
                pathType={pathType}
                selectedPlanType={state.selectedPlanType}
              />
            </div>
            <S.PlanTabContainer className="col-sm-12">
              <article className={`tab--content ${activeClass}`}>
                <div className="dp-container">
                  <div className="dp-rowflex">
                    <div className="dp-calc-box">
                      <div className="col-md-6 col-sm-12">
                        <article className="dp-box-shadow dp-bgplan">
                          <Slider
                            planDescriptions={state.planDescriptions}
                            defaultValue={0}
                            visible={!hightestPlan}
                            handleChange={(index) => {
                              dispatchPlanData({
                                type: actionTypes.UPDATE_SELECTED_PLAN,
                                indexPlan: index,
                              });
                            }}
                          />
                          <BannerUpgrade
                            sessionPlan={sessionPlan.plan}
                            currentPlan={planData.plan}
                            currentPlanList={state.planList}
                          />
                          {state.discountsList?.length ? (
                            <>
                              <hr />
                              <Discounts
                                discountsList={state.discountsList}
                                sessionPlan={sessionPlan.plan}
                                handleChange={handleDiscountChange}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </article>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <PlanPrice>
                          <PlanPriceWithoutDiscounts planData={planData} />
                          <PlanPricePerMonth planData={planData} />
                          <PlanAgreement planData={planData} />
                        </PlanPrice>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </S.PlanTabContainer>
            <div className="dp-container">
              <div className="dp-rowflex">
                <div className="dp-align-center dp-cta-plans">
                  <Link
                    className="dp-button button-medium primary-grey"
                    to={`/plan-selection${safePromoId ? `?promo-code=${safePromoId}` : ''}`}
                  >
                    {_('plan_calculator.button_back')}
                  </Link>
                  <TooltipContainer
                    visible={isEqualPlan}
                    content={_('plan_calculator.button_purchase_tooltip')}
                    orientation="top"
                  >
                    <S.PurchaseLink
                      className={`dp-button button-medium primary-green ${
                        isEqualPlan ? 'disabled' : ''
                      }`}
                      href={planService.getBuyUrl(
                        _('common.control_panel_section_url'),
                        planData.plan.id,
                        planData.discount?.id,
                        safePromoId,
                      )}
                    >
                      {_('plan_calculator.button_purchase')}
                    </S.PurchaseLink>
                  </TooltipContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  ) : (
    <div className="p-t-54 p-b-54" style={{ backgroundColor: '#f6f6f6', flex: '1' }}>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12" style={{ textAlign: 'center' }}>
            <span>{_('common.unexpected_error')}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InjectAppServices(PlanCalculator);
