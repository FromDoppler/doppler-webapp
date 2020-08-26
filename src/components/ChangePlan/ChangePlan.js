import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Card, CardPrice, CardAction, Ribbon } from './Card';
import queryString from 'query-string';
import { extractParameter } from '../../utils';

const ChangePlan = ({ location }) => {
  const promoCode = extractParameter(location, queryString.parse, 'promo-code') || '';
  const advancedPay = extractParameter(location, queryString.parse, 'advanced-pay') || 0;
  // TODO: remove planId, it just for testing right now
  const planId = parseInt(extractParameter(location, queryString.parse, 'planId')) || 0;
  // Allow preselect by email or contacts
  const selectedType = extractParameter(location, queryString.parse, 'selected-type') || '';
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const planUrl =
    _('common.control_panel_section_url') +
    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planId}&fromStep1=True&IdDiscountPlan=${advancedPay}&PromoCode=${promoCode}`;
  const planPrice = 15;
  const planQuantity = 100000;
  const planName = 'Mensual';

  const cardData = {
    name: planName,
    price: planPrice,
    descriptionPlan: _('change_plan.until_x_subscribers', { subscribers: planQuantity }),
    action: {
      url: planUrl,
      text: _('change_plan.calculate_price'),
    },
  };
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
              <Card>
                <div className="dp-content-plans">
                  <h3>{cardData.name}</h3>
                  <p>{_('change_plan.description')}</p>
                  <p>{cardData.descriptionPlan}</p>
                </div>
                <CardPrice currency="US$">{cardData.price}</CardPrice>
                <CardAction url={cardData.action.url}>{cardData.action.text}</CardAction>
              </Card>
              <Card highlighted>
                <Ribbon content={_('change_plan.recommended')} />
                <div className="dp-content-plans">
                  <h3>{cardData.name}</h3>
                  <p>{_('change_plan.description')}</p>
                  <p>{cardData.descriptionPlan}</p>
                </div>
                <CardPrice currency="US$">{cardData.price}</CardPrice>
                <CardAction url={cardData.action.url}>{cardData.action.text}</CardAction>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export { ChangePlan };
