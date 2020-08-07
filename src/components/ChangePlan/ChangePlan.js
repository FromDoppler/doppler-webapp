import React from 'react';
import { useIntl } from 'react-intl';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Card from './Card/Card';

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

  const cardData = {
    title: planId,
    description: _('change_plan.description'),
    price: { initialText: _('change_plan.since'), endText: _('change_plan.per_month'), value: planPrice, },
    descriptionPlan: _('change_plan.until_x_subscribers', {subscribers: planQuantity}),
    action: {
      url: planUrl,
      text: _('change_plan.calculate_price'),
    }
  }
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
              <Card data={cardData} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export { ChangePlan };
