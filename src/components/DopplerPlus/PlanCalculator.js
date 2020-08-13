import React, { useReducer, useEffect, useState } from 'react';
import { Slider } from '../shared/Slider/Slider';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { useRouteMatch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import queryString from 'query-string';
import { extractParameter } from '../../utils';

const PlanCalculator = ({ location, dependencies: { dopplerLegacyClient } }) => {
  const safePromoId = extractParameter(location, queryString.parse, 'promoId') || '';
  const discountId = parseInt(extractParameter(location, queryString.parse, 'discountId')) || 0;
  const { params } = useRouteMatch();
  const { typePlanId } = params;
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
      const responsePlansList = await dopplerLegacyClient.getPlansList(typePlanId);
      if (responsePlansList.success) {
        setState({
          loading: false,
          planList: responsePlansList.planList,
          discountsList: responsePlansList.discounts,
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
  }, [dopplerLegacyClient, typePlanId, actionTypes.INIT]);

  if (state.loading) {
    return <Loading page />;
  }

  const plansTooltipDescriptions = state.planList?.map((plan) => {
    return plan.amount + ' Suscriptores';
  });

  return state.success ? (
    <div className="p-t-54 p-b-54" style={{ backgroundColor: '#f6f6f6', flex: '1' }}>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12" style={{ textAlign: 'center' }}>
            {/* TODO: change this to intl elemnt */}
            <h1>Plan STANDARD</h1>
            <p style={{ paddingBottom: '50px' }}>
              {/* TODO: change this to intl elemnt */}
              ¿Cuántos contactos tienes? Utiliza el slider para calcular el costo final de tu Plan
            </p>
            <div style={{ marginBottom: '40px' }}>
              {state.discountsList.map((discount, index) => (
                <button
                  key={index}
                  style={{
                    padding: '10px',
                    border: '1px solid #000',
                    backgroundColor: discount.id === planData.discount.id ? '#33ad73' : '#f6f6f6',
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
            <p>{planData.plan.description}</p>
            <Slider
              tooltipDescriptions={plansTooltipDescriptions}
              defaultValue={0}
              handleChange={(index) => {
                dispatchPlanData({ type: actionTypes.UPDATE_SELECTED_PLAN, indexPlan: index });
              }}
            />
            <div style={{ marginTop: '40px' }}>
              <a
                className="dp-button button-medium primary-green"
                href={
                  _('common.control_panel_section_url') +
                  `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planData.plan.idPlan}&fromStep1=True&IdDiscountPlan=${planData.discount.id}&PromoCode=${safePromoId}`
                }
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
