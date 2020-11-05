import React, { useReducer, useEffect, useState } from 'react';
import { Slider } from '../shared/Slider/Slider';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { FormattedMessage, useIntl } from 'react-intl';
import queryString from 'query-string';
import { extractParameter, getPlanFee } from '../../utils';
import { useRouteMatch, Link } from 'react-router-dom';

const NavigatorTabs = ({ tabs, pathType, selectedPlanType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getTypePlanDescriptionWithTooltip = (type) => {
    switch (type) {
      case 'prepaid':
      case 'subscribers':
      case 'monthly-deliveries':
        return (
          <>
            {_(`plan_calculator.plan_type_${type.replace('-', '_')}`)}{' '}
            <div className="dp-tooltip-container">
              <span className="ms-icon icon-info-icon"></span>
              <div className="dp-tooltip-top">
                <span>{_(`plan_calculator.plan_type_${type.replace('-', '_')}_tooltip`)}</span>
              </div>
            </div>
          </>
        );
      default:
        return '';
    }
  };

  return (
    <nav className="tabs-wrapper">
      <ul className="tabs-nav">
        {tabs.map((type, index) => (
          <li className="tab--item" key={index}>
            <Link
              to={`/plan-selection/${pathType}/${type}`}
              className={type === selectedPlanType ? 'tab--link active' : 'tab--link'}
            >
              {getTypePlanDescriptionWithTooltip(type)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Discounts = ({ discountsList, handleChange }) => {
  const [selectedDiscount, setSelectedDiscount] = useState(discountsList[0]);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getDiscountDescription = (discountDescription) => {
    switch (discountDescription) {
      case 'monthly':
      case 'quarterly':
      case 'half-yearly':
      case 'yearly':
        return _('plan_calculator.discount_' + discountDescription.replace('-', '_'));
      default:
        return '';
    }
  };

  return (
    <>
      <div className="dp-wrap-subscription">
        <h4>{_('plan_calculator.discount_title')}</h4>
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
                {getDiscountDescription(discount.description)}
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
    </>
  );
};

const BannerUpgrade = ({ currentPlan, currentPlanList }) => {
  const getBannerInfo = (type) => {
    const bannerInfo = { messageId: `plan_calculator.banner_for_${type.replace('-', '_')}` };
    switch (type) {
      case 'prepaid':
      case 'subscribers':
        return {
          ...bannerInfo,
          link: `/plan-selection/${currentPlan.featureSet}/monthly-deliveries`,
        };
      case 'monthly-deliveries':
        // TODO: define where to go in this case
        return { ...bannerInfo, link: `/email-marketing-agencies` };
      default:
        return `plan_calculator.banner_for_unknown`;
    }
  };

  if (currentPlan.id === currentPlanList[currentPlanList.length - 1].id) {
    const bannerInfo = getBannerInfo(currentPlan.type);
    return (
      <div className="dp-calc-message">
        <p>
          <FormattedMessage
            id={bannerInfo.messageId}
            values={{
              Link: (chunk) => (
                <Link to={bannerInfo.link}>
                  <strong>{chunk}</strong>
                </Link>
              ),
            }}
          />
        </p>
      </div>
    );
  }
  return <></>;
};

const PlanPriceWithoutDiscounts = ({ planData }) => {
  return (
    <>
      {planData.discount?.discountPercentage ? (
        <span className="dp-price-old">
          <span className="dp-price-old-money">US$</span>
          <span className="dp-price-old-amount">{getPlanFee(planData.plan)}</span>
        </span>
      ) : (
        <></>
      )}
    </>
  );
};

const PlanPricePerMonth = ({ planData }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <>
      <h2 className="dp-price-large">
        <span className="dp-price-large-money">US$</span>
        <span className="dp-price-large-amount">
          {planData.discount?.discountPercentage
            ? Math.round(
                getPlanFee(planData.plan) * (1 - planData.discount?.discountPercentage / 100),
              )
            : getPlanFee(planData.plan)}
        </span>
      </h2>
      <span className="dp-for-time">{_('plan_calculator.per_month')}</span>
    </>
  );
};

const PlanAgreement = ({ planData }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getAgreementDescription = (discountDescription) => {
    switch (discountDescription) {
      case 'quarterly':
      case 'half-yearly':
      case 'yearly':
        return _('plan_calculator.with_' + discountDescription.replace('-', '_') + '_discount');
      default:
        return '';
    }
  };

  return (
    <div className="dp-agreement">
      {planData.discount?.discountPercentage ? (
        <p>
          {getAgreementDescription(planData.discount.description)}
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
      <p>{_('plan_calculator.discount_clarification')}</p>
    </div>
  );
};

const PlanPrice = ({ children }) => {
  return <div className="dp-price--wrapper">{children}</div>;
};

const PlanCalculator = ({ location, dependencies: { planService, appSessionRef } }) => {
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

  const getPlanDescription = (plan) => {
    const planDescription = {
      descriptionId: 'plan_calculator.' + plan.type.replace('-', '_') + '_amount_description',
    };
    switch (plan.type) {
      case 'prepaid':
        return {
          ...planDescription,
          amount: plan.credits,
        };
      case 'subscribers':
        return {
          ...planDescription,
          amount: plan.subscriberLimit,
        };
      case 'monthly-deliveries':
        return {
          ...planDescription,
          amount: plan.emailsByMonth,
        };
      default:
        return {
          amount: null,
          descriptionId: 'plan_calculator.unknown_amount_description',
        };
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
            <h1 className="dp-tit-plans">{_(`plan_calculator.plan_${pathType}_title`)}</h1>
            <p>{_('plan_calculator.subtitle')}</p>
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
                          <BannerUpgrade
                            currentPlan={planData.plan}
                            currentPlanList={state.planList}
                          />
                          {state.discountsList?.length ? (
                            <>
                              <hr />
                              <Discounts
                                discountsList={state.discountsList}
                                handleChange={(discount) => {
                                  dispatchPlanData({
                                    type: actionTypes.UPDATE_SELECTED_DISCOUNT,
                                    idDiscount: discount.id,
                                  });
                                }}
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
            </section>
            <div className="dp-container">
              <div className="dp-rowflex">
                <div className="dp-align-center dp-cta-plans">
                  <Link
                    className="dp-button button-medium primary-grey"
                    to={`/plan-selection${safePromoId ? `?promo-code=${safePromoId}` : ''}`}
                  >
                    {_('plan_calculator.button_back')}
                  </Link>

                  <a
                    className="dp-button button-medium primary-green"
                    href={planService.getBuyUrl(
                      _('common.control_panel_section_url'),
                      planData.plan.id,
                      planData.discount?.id,
                      safePromoId,
                    )}
                  >
                    {_('plan_calculator.button_purchase')}
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
            <span>{_('common.unexpected_error')}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InjectAppServices(PlanCalculator);
