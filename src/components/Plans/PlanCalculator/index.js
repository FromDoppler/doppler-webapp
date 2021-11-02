import React, { useEffect, useReducer, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import useTimeout from '../../../hooks/useTimeout';
import { InjectAppServices } from '../../../services/pure-di';
import { getPlanTypeFromUrlSegment } from '../../../utils';
import { FAQ } from '../../FAQ';
import { topics } from '../../FAQ/constants';
import { Loading } from '../../Loading/Loading';
import * as S from './index.styles';
import { NavigatorTabs } from './NavigatorTabs/NavigatorTabs';
import { PlanCalculatorButtons } from './PlanCalculatorButtons';
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
import { Slider } from './Slider';
import { UnexpectedError } from './UnexpectedError';

const INITIAL_VALUE_OF_SLIDER = 0;
export const PlanCalculator = InjectAppServices(({ dependencies: { planService } }) => {
  const [{ planTypes, loading, hasError }, dispatch] = useReducer(
    planTypesReducer,
    INITIAL_STATE_PLAN_TYPES,
  );
  const [{ plansByType, sliderValuesRange, hasError: hasErrorPlansByType }, dispatchPlansByType] =
    useReducer(plansByTypeReducer, INITIAL_STATE_PLANS_BY_TYPE);
  const [activeClass, setActiveClass] = useState('active');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(INITIAL_VALUE_OF_SLIDER);
  const createTimeout = useTimeout();
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { planType: planTypeUrlSegment } = useParams();
  const selectedPlanType = getPlanTypeFromUrlSegment(planTypeUrlSegment);

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
        dispatchPlansByType({ type: PLANS_BY_TYPE_ACTIONS.FETCHING_STARTED });
        const _plansByType = await planService.getPlansByType(
          getPlanTypeFromUrlSegment(planTypeUrlSegment),
        );
        dispatchPlansByType({
          type: PLANS_BY_TYPE_ACTIONS.RECEIVE_PLANS_BY_TYPE,
          payload: _plansByType,
        });
      } catch (error) {
        dispatchPlansByType({ type: PLANS_BY_TYPE_ACTIONS.FETCH_FAILED });
      }
    };

    if (planTypes.length > 0) {
      setSelectedPlanIndex(INITIAL_VALUE_OF_SLIDER);
      fetchPlansByType();
    }
  }, [planService, planTypeUrlSegment, planTypes]);

  useEffect(() => {
    setActiveClass('');
    createTimeout(() => setActiveClass('active'), 0);
  }, [planTypeUrlSegment, createTimeout]);

  const handleSliderChange = (e) => {
    const { value } = e.target;
    const _selectedPlanIndex = parseInt(value);
    setSelectedPlanIndex(_selectedPlanIndex);
  };

  if (loading) {
    return <Loading page />;
  }

  if (hasError || hasErrorPlansByType || selectedPlanType === 'unknown') {
    return <UnexpectedError />;
  }

  return (
    <>
      <section className="dp-gray-page p-t-54 p-b-54">
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
                            />
                          </article>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </S.PlanTabContainer>
              <PlanCalculatorButtons selectedPlanId={plansByType[selectedPlanIndex]?.id} />
            </div>
          </div>
        </section>
      </section>
      <FAQ topics={topics} />
    </>
  );
});
