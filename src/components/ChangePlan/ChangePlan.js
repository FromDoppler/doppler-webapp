import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Card, CardPrice, CardAction, Ribbon, CardFeatures } from './Card';
import queryString from 'query-string';
import { extractParameter } from '../../utils';

function getPlans() {
  return [
    {
      price: 15,
      quantity: 1500,
      name: 'Standard',
      id: 2,
      EmailParameterEnabled: true,
      CancelCampaignEnabled: true,
      SiteTrackingLicensed: false,
      SmartCampaignsEnabled: false,
      ShippingLimitEnabled: false,
      PlanType: 2,
    },
    {
      price: 21,
      quantity: 1500,
      name: 'Plus',
      id: 1,
      EmailParameterEnabled: true,
      CancelCampaignEnabled: true,
      SiteTrackingLicensed: true,
      SmartCampaignsEnabled: true,
      ShippingLimitEnabled: true,
      PlanType: 3,
    },
  ];
}

function getPlanUrl(planId, advancedPay, promoCode, _) {
  return (
    _('common.control_panel_section_url') +
    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planId}&fromStep1=True&IdDiscountPlan=${advancedPay}&PromoCode=${promoCode}`
  );
}

const ChangePlan = ({ location }) => {
  const promoCode = extractParameter(location, queryString.parse, 'promo-code') || '';
  const advancedPay = extractParameter(location, queryString.parse, 'advanced-pay') || 0;
  // TODO: remove planId, it just for testing right now
  const planId = parseInt(extractParameter(location, queryString.parse, 'planId')) || 0;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  // Allow preselect by email or contacts
  const selectedType = extractParameter(location, queryString.parse, 'selected-type') || '';
  const plans = getPlans();

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>Compra un plan</title>
      </Helmet>
      <div className="p-t-54 p-b-54" style={{ backgroundColor: '#f6f6f6', flex: '1' }}>
        {selectedType.length ? (
          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="dp-align-center">
                <h1>{_('change_plan.selected_type') + selectedType}</h1>
              </div>{' '}
            </div>{' '}
          </section>
        ) : (
          ''
        )}
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="dp-align-center p-t-30 p-b-30">
              {plans.map((plan, index) => (
                <Card highlighted={plan.PlanType !== 2} key={index}>
                  {plan.PlanType !== 2 ? <Ribbon content={_('change_plan.recommended')} /> : null}
                  <div className="dp-content-plans">
                    <h3>{plan.name}</h3>
                    <p>{_('change_plan.description')}</p>
                    <p>{_('change_plan.until_x_subscribers', { subscribers: plan.quantity })}</p>
                  </div>
                  <CardPrice currency="US$">{plan.price}</CardPrice>
                  <CardAction url={getPlanUrl(plan.id, advancedPay, promoCode, _)}>
                    {_('change_plan.calculate_price')}
                  </CardAction>
                  {isFeaturesVisible ? (
                    <CardFeatures>
                      <h4>{_('change_plan.features')}</h4>
                      <ul className="dp-list-detail">
                        {plan.CancelCampaignEnabled ? (
                          <li>
                            <span className="dp-icodot">.</span>
                            <span>{_('change_plan.cancel_campaign')}</span>
                          </li>
                        ) : null}
                        {plan.EmailParameterEnabled ? (
                          <li>
                            <span className="dp-icodot">.</span>
                            <span>{_('change_plan.email_parameter')}</span>
                          </li>
                        ) : null}
                        {plan.ShippingLimitEnabled ? (
                          <li>
                            <span className="dp-icodot">.</span>
                            <span>{_('change_plan.shipping_limit')}</span>
                          </li>
                        ) : null}
                        {plan.SmartCampaignsEnabled ? (
                          <li>
                            <span className="dp-icodot">.</span>
                            <span>{_('change_plan.smart_campaigns')}</span>
                          </li>
                        ) : null}
                        {plan.SiteTrackingLicensed ? (
                          <li>
                            <span className="dp-icodot">.</span>
                            <span>{_('change_plan.site_tracking')}</span>
                          </li>
                        ) : null}
                      </ul>
                    </CardFeatures>
                  ) : null}
                </Card>
              ))}
            </div>
          </div>
          <div className="dp-align-center p-t-30 p-b-30">
            <button
              className="dp-compare-details-plans"
              onClick={() => {
                setIsFeaturesVisible(!isFeaturesVisible);
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

export { ChangePlan };
