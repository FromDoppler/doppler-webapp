import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Card, CardPrice, CardAction, Ribbon } from './Card';
import queryString from 'query-string';
import { extractParameter } from '../../utils';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { planType, userType } from '../../services/doppler-legacy-client';

const ChangePlan = ({ location, dependencies: { dopplerPlanClient } }) => {
  const promoCode = extractParameter(location, queryString.parse, 'promo-code') || '';
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const responsePlansList = await dopplerPlanClient.getPlans();
      if (responsePlansList) {
        setState({
          loading: false,
          planList: responsePlansList,
        });
      } else {
        setState({ success: false });
      }
    };
    fetchData();
  }, [dopplerPlanClient]);

  if (state.loading) {
    return <Loading page />;
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>Compra un plan</title>
      </Helmet>
      <div className="dp-gray-page">
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="dp-align-center">
              <h1 className="dp-tit-plans">Planes a la medida de tu negocio</h1>
            </div>
          </div>
        </section>
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="dp-align-center p-t-30 p-b-30">
              <Card>
                <div className="dp-content-plans-free">
                  <h3>{_('change_plan.card.free.title')}</h3>
                  <p>{_('change_plan.card.free.description')}</p>
                </div>
                <div className="dp-cta-plan">
                  <span className="dp-current-plan"> {_('change_plan.card.free.cta')} </span>
                </div>
              </Card>
              {state.planList.map((plan) => {
                return (
                  <Card highlighted={plan.type === planType.PLUS} key={plan.id}>
                    {plan.type === planType.PLUS ? (
                      <Ribbon content={_('change_plan.recommended')} />
                    ) : null}
                    <div className="dp-content-plans">
                      <h3>{_(`change_plan.card.${planType[plan.type].toLowerCase()}.title`)}</h3>
                      <p>
                        {_(`change_plan.card.${planType[plan.type].toLowerCase()}.description`)}
                      </p>
                    </div>
                    <CardPrice currency="US$">{plan.fee}</CardPrice>
                    <CardAction
                      url={`/plan-selection/${planType[plan.type].toLowerCase()}-subscribers${
                        promoCode ? `?promo-code=${promoCode}` : ''
                      }`}
                    >
                      {_('change_plan.calculate_price')}
                    </CardAction>
                  </Card>
                );
              })}
              <Card>
                <div className="dp-content-plans">
                  <h3>{_('change_plan.card.agencies.title')}</h3>
                  <p>{_('change_plan.card.agencies.description')}</p>
                </div>
                <div className="dp-card-asset">
                  <img
                    src="https://cdn.fromdoppler.com/doppler-ui-library/latest/img/asset-enterprise.svg"
                    alt="Enterprise"
                  />
                </div>
                <a
                  href={_('change_plan.card.agencies.link')}
                  className="dp-button button-medium primary-green"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {_('change_plan.card.agencies.cta')}
                </a>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default InjectAppServices(ChangePlan);
