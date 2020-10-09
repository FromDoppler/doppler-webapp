import React, { useReducer, useEffect, useState } from 'react';
import { Slider } from '../shared/Slider/Slider';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { useIntl } from 'react-intl';
import queryString from 'query-string';
import { extractParameter, getPlanFee } from '../../utils';
import { useRouteMatch, Link } from 'react-router-dom';

const NavigatorTabs = ({ tabs, pathType, selectedPlanType }) => {
  return (
    <nav className="tabs-wrapper">
      <ul className="tabs-nav">
        {tabs.map((type, index) => (
          <li className="tab--item" key={index}>
            <Link
              to={`/plan-selection/${pathType}/${type}`}
              className={type === selectedPlanType ? 'tab--link active' : 'tab--link'}
            >
              {type}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Discounts = ({ discountsList, handleChange }) => {
  const [selectedDiscount, setSelectedDiscount] = useState(discountsList[0]);
  return (
    <>
      <div className="dp-wrap-subscription">
        <h4>Suscripcion</h4>
        <ul>
          {discountsList.map((discount, index) => (
            <li key={index}>
              <button
                key={index}
                className={`dp-button button-medium ${
                  discount.id === selectedDiscount.id ? 'btn-active' : ''
                }`}
                onClick={() => {
                  handleChange(discount);
                  setSelectedDiscount(discount);
                }}
              >
                {discount.description}
              </button>
              {discount.discountPercentage ? (
                <span className="dp-discount">{`${discount.discountPercentage}% OFF`}</span>
              ) : (
                <></>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="dp-calc-message dp-show">
          ¿Tienes más de 100.000 contactos?
          <a href="#">
            <strong>Contáctanos para crear un plan a tu medida.</strong>
          </a>
      </div>
    </>
  );
};

const PlanCalculator = ({
  location,
  dependencies: { planService, appSessionRef, dopplerLegacyClient },
}) => {
  const safePromoId = extractParameter(location, queryString.parse, 'promo-code') || '';
  const discountId = extractParameter(location, queryString.parse, 'discountId') || 0;
  const { pathType, planType } = useRouteMatch().params;
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

  const getPlanAmount = (plan) => {
    switch (plan.type) {
      case 'prepaid':
        return plan.credits;
      case 'subscribers':
        return plan.subscriberLimit;
      case 'monthly-deliveries':
        return plan.emailsByMonth;
      default:
        return null;
    }
  };

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
      const selectedPlanType = planType || planTypes[0];
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
            return {
              amount: getPlanAmount(plan),
              descriptionId:
                'plan_calculator.' + plan.type.replace('-', '_') + '_amount_description',
            };
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
  }, [dopplerLegacyClient, actionTypes.INIT, appSessionRef, planService, planType, pathType]);

  const getMonthsByCycle = (billingCycle) => {
    switch (billingCycle) {
      case 'monthly':
        return 1;
      case 'quarterly':
        return 3;
      case 'half-yearly':
        return 6;
      case 'yearly':
        return 12;
      default:
        return 1;
    }
  };

  if (state.loading) {
    return <Loading page />;
  }

  return state.success ? (
    <section className="dp-gray-page p-t-54 p-b-54">
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12" style={{ textAlign: 'center' }}>
            {/* TODO: change this to intl elemnt */}
            <h1 className="dp-tit-plans">Plan {pathType}</h1>
            <p>
              {/* TODO: change this to intl elemnt */}
              ¿Cuántos contactos tienes? Utiliza el slider para calcular el costo final de tu Plan
            </p>
            <div className="dp-align-center dp-tabs-plans col-sm-9">
              <NavigatorTabs
                tabs={state.planTypes}
                pathType={pathType}
                selectedPlanType={state.selectedPlanType}
              />
            </div>
            <section className="tab--container col-sm-12">
              <article className="tab--content active">
                <div className="dp-container">
                  <div className="dp-rowflex">
                    <div className="dp-calc-box">
                      <div className="col-md-6 col-sm-12">
                        <article className="dp-box-shadow dp-bgplan">
                          <Slider
                            planDescriptions={state.planDescriptions}
                            defaultValue={0}
                            handleChange={(index) => {
                              dispatchPlanData({
                                type: actionTypes.UPDATE_SELECTED_PLAN,
                                indexPlan: index,
                              });
                            }}
                          />
                          <hr />
                          {state.discountsList?.length ? (
                            <Discounts
                              discountsList={state.discountsList}
                              handleChange={(discount) => {
                                dispatchPlanData({
                                  type: actionTypes.UPDATE_SELECTED_DISCOUNT,
                                  idDiscount: discount.id,
                                });
                              }}
                            />
                          ) : (
                            <></>
                          )}
                        </article>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="dp-price--wrapper">
                          {planData.discount?.discountPercentage ? (
                            <span className="dp-price-old">
                              <span className="dp-price-old-money">US$</span>
                              <span className="dp-price-old-amount">
                                {getPlanFee(planData.plan)}
                              </span>
                            </span>
                          ) : (
                            <></>
                          )}
                          <h2 className="dp-price-large">
                            <span className="dp-price-large-money">US$</span>
                            <span className="dp-price-large-amount">
                              {planData.discount?.discountPercentage
                                ? Math.round(
                                    getPlanFee(planData.plan) *
                                      (1 - planData.discount?.discountPercentage / 100),
                                  )
                                : getPlanFee(planData.plan)}
                            </span>
                          </h2>
                          <span className="dp-for-time">Por mes</span>
                          <div className="dp-agreement">
                            {planData.discount?.discountPercentage ? (
                              <p>
                                El pago anual será de
                                <strong>
                                  {' '}
                                  US$
                                  {Math.round(
                                    getPlanFee(planData.plan) *
                                      (1 - planData.discount.discountPercentage / 100) *
                                      planData.discount.monthsAmmount,
                                  )}
                                </strong>
                              </p>
                            ) : (
                              <></>
                            )}
                            <p>
                              La renovación es automática y puedes cancelarla cuando quieras. Estos
                              valores no incluyen impuestos.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </section>
            <div className="dp-container">
              <div className="dp-rowflex">
                <div className="dp-align-center dp-cta-plans">
                  <Link
                    className="dp-button button-medium primary-grey"
                    to={`/plan-selection${safePromoId ? `?promo-code=${safePromoId}` : ''}`}
                  >
                    Volver a Planes
                  </Link>

                  <a
                    className="dp-button button-medium primary-green"
                    href={
                      _('common.control_panel_section_url') +
                      `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planData.plan.id}&fromStep1=True` +
                      `${planData.discount?.id ? `&IdDiscountPlan=${planData.discount?.id}` : ''}` +
                      `${safePromoId ? `&PromoCode=${safePromoId}` : ''}`
                    }
                  >
                    Contratar
                  </a>
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
            <span>Hubo un error al traer los datos</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InjectAppServices(PlanCalculator);
