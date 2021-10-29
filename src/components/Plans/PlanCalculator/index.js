import React, { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../doppler-types';
import { InjectAppServices } from '../../../services/pure-di';
import { FAQ } from '../../FAQ';
import { topics } from '../../FAQ/constants';
import { Loading } from '../../Loading/Loading';
import { NavigatorTabs } from './NavigatorTabs/NavigatorTabs';
import {
  INITIAL_STATE_PLAN_TYPES,
  planTypesReducer,
  PLAN_TYPES_ACTIONS,
} from './reducers/planTypesReducer';
import { UnexpectedError } from './UnexpectedError';

export const PlanCalculator = InjectAppServices(({ dependencies: { planService } }) => {
  const [{ planTypes, loading, hasError }, dispatch] = useReducer(
    planTypesReducer,
    INITIAL_STATE_PLAN_TYPES,
  );
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

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

  if (loading) {
    return <Loading page />;
  }

  if (hasError) {
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
                <NavigatorTabs tabs={planTypes} selectedPlanType={PLAN_TYPE.byContact} />
              </div>
            </div>
          </div>
        </section>
      </section>
      <FAQ topics={topics} />
    </>
  );
});
