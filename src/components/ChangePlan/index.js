import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import useTimeout from '../../hooks/useTimeout';
import { FAQ } from '../FAQ';
import { topics } from '../FAQ/constants';
import { Loading } from '../Loading/Loading';
import { AdvisoryBanner } from './AdvisoryBanner';
import { PlanList } from './PlanList';
import { changePlanReducer, CHANGE_PLAN_ACTIONS } from './reducers/changePlanReducer';

export const INITIAL_STATE_CHANGE_PLAN = {
  loading: false,
  pathList: [],
  currentPlan: null,
};

export const ChangePlan = () => {
  const [{ loading }, dispatch] = useReducer(changePlanReducer, INITIAL_STATE_CHANGE_PLAN);
  const createTimeout = useTimeout();
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  useEffect(() => {
    dispatch({ type: CHANGE_PLAN_ACTIONS.FETCHING_STARTED });
    createTimeout(() => {
      dispatch({
        type: CHANGE_PLAN_ACTIONS.RECEIVE_PLANS,
        payload: {
          pathList: INITIAL_STATE_CHANGE_PLAN.pathList,
          currentPlan: null,
        },
      });
    }, 1000);
  }, [createTimeout]);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>Compra un plan</title>
      </Helmet>
      {loading ? (
        <Loading page />
      ) : (
        <>
          <div className="dp-gray-page p-t-54 p-b-54">
            <section className="dp-container">
              <div className="dp-rowflex">
                <div className="dp-align-center">
                  <h1 className="dp-tit-plans">{_('change_plan.title')}</h1>
                </div>
              </div>
            </section>
            <section className="dp-container">
              <PlanList />
              <AdvisoryBanner />
            </section>
          </div>
          <FAQ topics={topics} />
        </>
      )}
    </>
  );
};
