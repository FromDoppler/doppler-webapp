import React, { useReducer, useEffect, useState } from 'react';
import { Slider } from '../shared/Slider/Slider';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { useIntl } from 'react-intl';
import queryString from 'query-string';
import { extractParameter } from '../../utils';
import { useRouteMatch, Link } from 'react-router-dom';

const PlanCalculator = ({
  location,
  dependencies: { planService, appSessionRef, dopplerLegacyClient },
}) => {
  const safePromoId = extractParameter(location, queryString.parse, 'promoId') || '';
  const discountId = extractParameter(location, queryString.parse, 'discountId') || 0;
  const typePlanId = parseInt(extractParameter(location, queryString.parse, 'selected-plan')) || 0;
  const { params } = useRouteMatch();
  const { planType, userType } = params;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

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
              ? state.discountsList.find((discount) => {
                  return discount.id === discountId;
                }) || state.discountsList[0]
              : state.discountsList[0],
          };
        default:
          return prevPlanData;
      }
    },
    { plan: {}, discount: {} },
  );

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const planList = await planService.getPlanList();
      const sessionPlan = appSessionRef.current.userData.user.plan;
      const currentPlan = planService.mapCurrentPlanFromTypeOrId(
        sessionPlan.planType,
        sessionPlan.planId,
        planList,
      );
      const planTypes = planService.getPlanTypes(currentPlan, planType, planList);
      const responsePlansList = await dopplerLegacyClient.getPlansList(typePlanId);
      if (responsePlansList.success) {
        setState({
          loading: false,
          planList: responsePlansList.planList,
          discountsList: responsePlansList.discounts,
          planTypes: planTypes,
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
  }, [dopplerLegacyClient, typePlanId, actionTypes.INIT, appSessionRef, planService]);

  if (state.loading) {
    return <Loading page />;
  }

  const plansTooltipDescriptions = state.planList?.map((plan) => {
    return plan.amount + ' ' + userType;
  });

  return state.success ? (
    <div className="p-t-54 p-b-54" style={{ backgroundColor: '#f6f6f6', flex: '1' }}>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12" style={{ textAlign: 'center' }}>
            {/* TODO: change this to intl elemnt */}
            <h1>
              Plan {planType} - {userType}
            </h1>
            <p style={{ paddingBottom: '50px' }}>
              {/* TODO: change this to intl elemnt */}
              ¿Cuántos contactos tienes? Utiliza el slider para calcular el costo final de tu Plan
            </p>
            <div className="dp-align-center dp-tabs-plans col-sm-9">
              <nav className="tabs-wrapper">
                <ul className="tabs-nav" data-tab-active="1">
                  {state.planTypes.map((type, index) => (
                    <li className="tab--item" key={index}>
                      <Link
                        to={`/plan-selection/${planType}/${type}`}
                        className={type === userType ? 'tab--link active' : 'tab--link'}
                      >
                        {type}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="dp-rowflex">
              <section className="col-lg-6">
                <Slider
                  planDescriptions={plansTooltipDescriptions}
                  defaultValue={0}
                  handleChange={(index) => {
                    dispatchPlanData({ type: actionTypes.UPDATE_SELECTED_PLAN, indexPlan: index });
                  }}
                />
                {/* discounts */}
                <div style={{ marginBottom: '40px' }}>
                  {state.discountsList.map((discount, index) => (
                    <button
                      key={index}
                      style={{
                        padding: '10px',
                        border: '1px solid #000',
                        backgroundColor:
                          discount.id === planData.discount.id ? '#33ad73' : '#f6f6f6',
                      }}
                      onClick={() => {
                        dispatchPlanData({
                          type: actionTypes.UPDATE_SELECTED_DISCOUNT,
                          idDiscount: discount.id,
                        });
                      }}
                    >
                      {discount.description}
                    </button>
                  ))}
                </div>
              </section>
              <section className="col-lg-6">
                {planData.discount.percent ? (
                  <p style={{ textDecoration: 'line-through' }}>
                    US${planData.plan.price * planData.discount.monthsAmmount}
                  </p>
                ) : (
                  <></>
                )}
                <span>US$</span>
                <span style={{ fontSize: '40px' }}>
                  {Math.round(
                    planData.plan.price *
                      (1 - planData.discount.percent / 100) *
                      planData.discount.monthsAmmount,
                  )}
                </span>
              </section>
            </div>
            <div style={{ marginTop: '40px' }}>
              <span className="col-lg-1">
                <Link to="/plan-selection"> &lt; &lt; Volver a Planes</Link>
              </span>
              <span className="col-lg-1">
                <a
                  className="dp-button button-medium primary-green"
                  href={
                    _('common.control_panel_section_url') +
                    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planData.plan.idPlan}&fromStep1=True&IdDiscountPlan=${planData.discount.id}` +
                    `${safePromoId ? `&PromoCode=${safePromoId}` : ''}`
                  }
                >
                  Contratar
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  ) : (
    <div className="p-t-54 p-b-54" style={{ backgroundColor: '#f6f6f6', flex: '1' }}>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12" style={{ textAlign: 'center' }}>
            <span>Hubo un error al traer los datos</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InjectAppServices(PlanCalculator);
