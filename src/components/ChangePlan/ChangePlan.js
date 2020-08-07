import React from 'react';
import { useIntl } from 'react-intl';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Card from './Card/Card';
import CardPrice from './Card/CardPrice';
import CardAction from './Card/CardAction';

const ChangePlan = () => {
  const { params } = useRouteMatch();
  const { planId, discountId, promoId } = params;
  const safeDiscountId = discountId ? discountId : 0;
  const safePromoId = promoId ? promoId : '';
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const planUrl =
    _('common.control_panel_section_url') +
    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planId}&fromStep1=True&IdDiscountPlan=${safeDiscountId}&PromoCode=${safePromoId}`;
  const planPrice = 15;
  const planQuantity = 100000;
  const planName = 'Mensual';

  const cardData = {
    name: planName,
    description: _('change_plan.description'),
    price: {
      initialText: _('change_plan.since'),
      endText: _('change_plan.per_month'),
      value: planPrice,
    },
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
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12" style={{ textAlign: 'center' }}>
              <Card>
                <h3>{cardData.name}</h3>
                <p>{cardData.description}</p>
                <p>{cardData.descriptionPlan}</p>
                <CardPrice currency="US$">{cardData.price.value}</CardPrice>
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
