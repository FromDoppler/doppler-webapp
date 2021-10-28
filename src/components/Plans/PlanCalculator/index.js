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

export const PlanCalculator = InjectAppServices(({ dependencies: { planService } }) => {
  const [{ planTypes, loading }, dispatch] = useReducer(planTypesReducer, INITIAL_STATE_PLAN_TYPES);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

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
