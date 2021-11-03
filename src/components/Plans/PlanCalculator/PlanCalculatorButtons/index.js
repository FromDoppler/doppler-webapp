import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { InjectAppServices } from '../../../../services/pure-di';
import { TooltipContainer } from '../../../TooltipContainer/TooltipContainer';
import * as S from './index.styles';

export const PlanCalculatorButtons = InjectAppServices(
  ({ selectedPlanId, selectedDiscountId, dependencies: { appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const query = useQueryParams();
    const promoCode = query.get('promo-code');

    const sessionPlan = appSessionRef.current.userData.user;
    const isEqualPlan = sessionPlan.plan.idPlan === selectedPlanId;

    return (
      <div className="dp-container">
        <div className="dp-rowflex">
          <div className="dp-align-center dp-cta-plans">
            <button
              type="button"
              className="dp-button button-medium primary-grey"
              onClick={() => window.history.back()}
            >
              {_('plan_calculator.button_back')}
            </button>
            <TooltipContainer
              visible={isEqualPlan}
              content={_('plan_calculator.button_purchase_tooltip')}
              orientation="top"
            >
              <S.PurchaseLink
                className={`dp-button button-medium primary-green ${isEqualPlan ? 'disabled' : ''}`}
                href={getBuyPurchaseUrl({
                  controlPanelUrl: _('common.control_panel_section_url'),
                  planId: selectedPlanId,
                  discountId: selectedDiscountId,
                  promoCode,
                })}
              >
                {_('plan_calculator.button_purchase')}
              </S.PurchaseLink>
            </TooltipContainer>
          </div>
        </div>
      </div>
    );
  },
);

const getBuyPurchaseUrl = ({ controlPanelUrl, planId, discountId, promoCode }) => {
  return (
    controlPanelUrl +
    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planId}&fromStep1=True` +
    `${discountId ? `&IdDiscountPlan=${discountId}` : ''}` +
    `${promoCode ? `&PromoCode=${promoCode}` : ''}`
  );
};
