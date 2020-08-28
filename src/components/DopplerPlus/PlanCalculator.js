import React, { useReducer, useEffect, useState } from 'react';
import { Slider } from '../shared/Slider/Slider';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { useIntl } from 'react-intl';
import queryString from 'query-string';
import { extractParameter } from '../../utils';
import { useRouteMatch } from 'react-router-dom';

const PlanCalculator = ({ location, dependencies: { dopplerPlanClient } }) => {
  const safePromoId = extractParameter(location, queryString.parse, 'promo-code') || '';
  const billingCycle = dopplerPlanClient.mapBillingCyleToMonths(extractParameter(location, queryString.parse, 'billing-cycle'));
  const selectedPlanId = parseInt(extractParameter(location, queryString.parse, 'selected-plan')) || 0;
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
              return discount.monthsToPay === action.monthsToPay;
            }),
          };
        case actionTypes.INIT:
          return {
            plan: state.planList[state.defaultPlan],
            discount: state.discountsList.find((discount) => {
                  return discount.monthsToPay === billingCycle;
                }) || state.discountsList[0]
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
      const planList = await dopplerPlanClient.getPlanListByType(planType, userType);
      if (planList.length) {
        const selectedPlan = planList.findIndex((plan)=> plan.id === selectedPlanId);
        setState({
          loading: false,
          planList: planList,
          discountsList: planList[0].advancedPayOptions,
          success: true,
          defaultPlan: selectedPlan!== -1? selectedPlan: 0
        });
        dispatchPlanData({
          type: actionTypes.INIT,
        });
      } else {
        setState({ success: false });
      }
      
    };
    fetchData();
  }, [selectedPlanId, actionTypes.INIT, dopplerPlanClient, planType, userType]);

  if (state.loading) {
    return <Loading page />;
  }

  const plansTooltipDescriptions = state.planList?.map((plan) => {
    return !!plan.emailsByMonth
      ? plan.emailsByMonth + ' Emails'
      : plan.subscribersByMonth + ' Suscriptores';
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

            {planData.discount ? (
              <p>*descuentos solo validos con medio de pago tarjeta de credito</p>
            ) : (
              ''
            )}
            <div style={{ marginBottom: '40px' }}>
              {state.discountsList.map((discount, index) => (
                <button
                  key={index}
                  style={{
                    padding: '10px',
                    border: '1px solid #000',
                    backgroundColor: discount.monthsToPay === planData.discount.monthsToPay ? '#33ad73' : '#f6f6f6',
                  }}
                  onClick={() => {
                    dispatchPlanData({
                      type: actionTypes.UPDATE_SELECTED_DISCOUNT,
                      monthsToPay: discount.monthsToPay,
                    });
                  }}
                >
                  {discount.monthsToPay + 'meses'}
                </button>
              ))}
            </div>
            {planData.discount?.discountPercentage ? (
              <p style={{ textDecoration: 'line-through' }}>
                US${planData.plan.fee * planData.discount.monthsToPay}
              </p>
            ) : (
              <></>
            )}
            <span>US$</span>
            <span style={{ fontSize: '40px' }}>
              {planData.discount
                ? Math.round(
                    planData.plan.fee *
                      (1 - planData.discount?.discountPercentage / 100) *
                      planData.discount?.monthsToPay,
                  )
                : planData.plan.fee}
            </span>
            <p>{planData.plan.description}</p>
            <Slider
              tooltipDescriptions={plansTooltipDescriptions}
              defaultValue={state.defaultPlan}
              handleChange={(index) => {
                dispatchPlanData({ type: actionTypes.UPDATE_SELECTED_PLAN, indexPlan: index });
              }}
            />
            <div style={{ marginTop: '40px' }}>
              <a
                className="dp-button button-medium primary-green"
                href={dopplerPlanClient.generateBuyLink(
                  _('common.control_panel_section_url'),
                  planData.plan,
                  planData.discount?.monthsToPay,
                  safePromoId,
                )}
              >
                Contratar
              </a>
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
