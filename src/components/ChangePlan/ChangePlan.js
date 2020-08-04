import React from 'react';
import { useIntl } from 'react-intl';
import { useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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
              <h1>Compra un plan</h1>
              <a href={planUrl} class="dp-button button-medium primary-green">
                Comprar Plan
              </a>
              <br />
              <br />
              Información del plan Plan Id {planId} - DiscountId - {safeDiscountId} - PromoCode -{' '}
              {safePromoId}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export { ChangePlan };
