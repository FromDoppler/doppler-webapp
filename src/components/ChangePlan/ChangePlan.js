import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Card, CardPrice, CardAction, Ribbon, CardFeatures } from './Card';
import queryString from 'query-string';
import { extractParameter } from '../../utils';
import { InjectAppServices } from '../../services/pure-di';

function getPlanUrl(planId, advancedPay, promoCode, _) {
  return (
    _('common.control_panel_section_url') +
    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planId}&fromStep1=True&IdDiscountPlan=${advancedPay}&PromoCode=${promoCode}`
  );
}

const ChangePlan = ({ location, dependencies: { planService } }) => {
  const promoCode = extractParameter(location, queryString.parse, 'promo-code') || '';
  const advancedPay = extractParameter(location, queryString.parse, 'advanced-pay') || 0;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const [state, setState] = useState({
    loading: true,
    isFeaturesVisible: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      // TODO: get current plan for now free
      const currentPlan = {
        type: 'free',
        subscriberLimit: 500,
      };
      const pathList = await planService.getPaths(currentPlan, await planService.getPlanList());
      console.log(JSON.stringify(pathList));
      if (pathList.length) {
        setState({
          loading: false,
          pathList: pathList,
          isFeaturesVisible: false,
        });
      }
    };
    fetchData();
  }, [planService]);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>Compra un plan</title>
      </Helmet>
      <div className="p-t-54 p-b-54" style={{ backgroundColor: '#f6f6f6', flex: '1' }}>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="dp-align-center">
              <h1>{_('change_plan.title')}</h1>
            </div>{' '}
          </div>{' '}
        </section>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="dp-align-center p-t-30 p-b-30">
              {state.pathList?.length ? (
                state.pathList.map((path, index) => (
                  <Card highlighted={path.type === 'plus'} key={index}>
                    {path.type === 'plus' ? (
                      <Ribbon content={_('change_plan.recommended')} />
                    ) : null}

                    <div
                      className={
                        path.type === 'free' ? 'dp-content-plans-free' : 'dp-content-plans'
                      }
                    >
                      <h3>{path.type}</h3>
                      <p>{_('change_plan.description_' + path.type)}</p>
                    </div>
                    {path.type !== 'free' && path.type !== 'agencies' ? (
                      <CardPrice currency="US$">{path.minimumFee}</CardPrice>
                    ) : (
                      ''
                    )}
                    {path.actual ? (
                      <span className="dp-current-plan"> {_('change_plan.current_plan')} </span>
                    ) : path.type === 'agencies' ? (
                      <>
                        <img
                          alt="agency-icon"
                          className="dp-price"
                          style={{ width: '80px' }}
                          src={_('change_plan.agencies_icon') + '?12'}
                        ></img>
                        <CardAction url={getPlanUrl('18', advancedPay, promoCode, _)}>
                          {_('change_plan.ask_demo')}
                        </CardAction>
                      </>
                    ) : (
                      <CardAction url={getPlanUrl('18', advancedPay, promoCode, _)}>
                        {_('change_plan.calculate_price')}
                      </CardAction>
                    )}
                    {state.isFeaturesVisible ? (
                      <CardFeatures>
                        <h4>{_('change_plan.features')}</h4>
                        <ul className="dp-list-detail">
                          <li>
                            <span className="dp-icodot">.</span>
                            <span>{_('change_plan.cancel_campaign')}</span>
                          </li>
                          <li>
                            <span className="dp-icodot">.</span>
                            <span>{_('change_plan.email_parameter')}</span>
                          </li>
                          <li>
                            <span className="dp-icodot">.</span>
                            <span>{_('change_plan.shipping_limit')}</span>
                          </li>
                          <li>
                            <span className="dp-icodot">.</span>
                            <span>{_('change_plan.smart_campaigns')}</span>
                          </li>
                          <li>
                            <span className="dp-icodot">.</span>
                            <span>{_('change_plan.site_tracking')}</span>
                          </li>
                        </ul>
                      </CardFeatures>
                    ) : null}
                  </Card>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="dp-align-center p-t-30 p-b-30">
            <button
              className="dp-compare-details-plans"
              onClick={() => {
                setState({ ...state, isFeaturesVisible: !state.isFeaturesVisible });
              }}
            >
              {_('change_plan.compare_features')}
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default InjectAppServices(ChangePlan);
