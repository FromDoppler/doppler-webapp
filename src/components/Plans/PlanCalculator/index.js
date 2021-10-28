import React, { useEffect, useReducer } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import {
  INITIAL_STATE_PLAN_TYPES,
  planTypesReducer,
  PLAN_TYPES_ACTIONS,
} from './reducers/planTypesReducer';

export const PlanCalculator = InjectAppServices(({ dependencies: { planService } }) => {
  const [{ planTypes, loading }, dispatch] = useReducer(planTypesReducer, INITIAL_STATE_PLAN_TYPES);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: PLAN_TYPES_ACTIONS.FETCHING_STARTED });
      await planService.getPlanList();
      const _planTypes = planService.getPlanTypes();
      dispatch({ type: PLAN_TYPES_ACTIONS.RECEIVE_PLAN_TYPES, payload: _planTypes });
    };
    fetchData();
  }, [planService]);

  if (loading) {
    return <Loading page />;
  }

  return (
    <section className="dp-gray-page p-t-54 p-b-54">
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12">
            <h1 className="dp-tit-plans">Calculadora de planes</h1>
          </div>
        </div>
      </section>
    </section>
  );
});
