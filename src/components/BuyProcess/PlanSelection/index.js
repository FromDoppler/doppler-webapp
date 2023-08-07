import { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { Navigate, useParams } from 'react-router-dom';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
import { InjectAppServices } from '../../../services/pure-di';
import { getPlanTypeFromUrlSegment } from '../../../utils';
import { Loading } from '../../Loading/Loading';
import { BreadcrumbNew, BreadcrumbNewItem } from '../../shared/BreadcrumbNew';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';
import NavigationTabs from '../NavigationTabs';
import { UnexpectedError } from '../UnexpectedError';
import {
  INITIAL_STATE_PLAN_TYPES,
  planTypesReducer,
  PLAN_TYPES_ACTIONS,
} from './reducers/planTypesReducer';

export const PlanSelection = InjectAppServices(({ dependencies: { planService } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { planType: planTypeUrlSegment } = useParams();
  const selectedPlanType = getPlanTypeFromUrlSegment(planTypeUrlSegment);

  const [{ planTypes, loading, hasError }, dispatch] = useReducer(
    planTypesReducer,
    INITIAL_STATE_PLAN_TYPES,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: PLAN_TYPES_ACTIONS.FETCHING_STARTED });
        const _planTypes = await planService.getDistinctPlans();
        dispatch({ type: PLAN_TYPES_ACTIONS.RECEIVE_PLAN_TYPES, payload: _planTypes });
      } catch (error) {
        dispatch({ type: PLAN_TYPES_ACTIONS.FETCH_FAILED });
      }
    };
    fetchData();
  }, [planService]);

  if (!hasError && !loading && planTypes.length === 0) {
    return <Navigate to="/upgrade-suggestion-form" />;
  }

  if (loading) {
    return <Loading page />;
  }

  // TODO: validate hasErrorPlansByType too
  if (hasError || selectedPlanType === 'unknown') {
    return <UnexpectedError />;
  }

  return (
    <div className="dp-container">
      <div className="dp-rowflex">
        <HeaderSection>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <BreadcrumbNew>
              <BreadcrumbNewItem
                href={_('buy_process.plan_selection.breadcumb_plan_url')}
                text={_('buy_process.plan_selection.breadcumb_plan_text')}
              />
            </BreadcrumbNew>
            <h1 className="m-t-24">
              <span className="dpicon iconapp-email-alert m-r-6" />
              {_(`buy_process.plan_selection.plan_title`)}
            </h1>
            <h2>{_('checkoutProcessSuccess.plan_type')}</h2>
            <FormattedMessageMarkdown
              linkTarget={'_blank'}
              id="buy_process.plan_selection.plan_subtitle_MD"
            />
          </div>
        </HeaderSection>

        <div className="col-sm-12 col-md-12 col-lg-12">
          <NavigationTabs planTypes={planTypes} selectedPlanType={selectedPlanType} />
        </div>
      </div>
    </div>
  );
});
