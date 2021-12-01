import React from 'react';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../services/pure-di';
import { TooltipContainer } from '../../../TooltipContainer/TooltipContainer';
import * as S from './index.styles';
import { getPlanTypeFromUrlSegment } from '../../../../utils';
import { useLocation, useParams } from 'react-router-dom';

export const PlanCalculatorButtons = InjectAppServices(
  ({
    selectedPlanId,
    selectedDiscountId,
    dependencies: { appSessionRef, experimentalFeatures },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { search } = useLocation();

    const sessionPlan = appSessionRef.current.userData.user;
    const isEqualPlan = sessionPlan.plan.idPlan === selectedPlanId;
    const newCheckoutEnabled = experimentalFeatures.getFeature('newCheckoutEnabled');
    const { planType: planTypeUrlSegment } = useParams();
    const selectedPlanType = getPlanTypeFromUrlSegment(planTypeUrlSegment);

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
                  planType: selectedPlanType,
                  planId: selectedPlanId,
                  discountId: selectedDiscountId,
                  newCheckoutEnabled,
                  search,
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

const getLegacyCheckoutPurchaseUrl = ({
  controlPanelUrl,
  planId,
  discountId,
  currentQueryParams,
}) => {
  return (
    controlPanelUrl +
    `/AccountPreferences/UpgradeAccountStep2${currentQueryParams}&IdUserTypePlan=${planId}&fromStep1=True` +
    `${discountId ? `&IdDiscountPlan=${discountId}` : ''}`
  );
};

const getNewCheckoutPurchaseUrl = ({ planType, planId, discountId, currentQueryParams }) => {
  return (
    `/checkout/premium/${planType}${currentQueryParams}&selected-plan=${planId}` +
    `${discountId ? `&discountId=${discountId}` : ''}`
  );
};

const getBuyPurchaseUrl = ({
  controlPanelUrl,
  planType,
  planId,
  discountId,
  newCheckoutEnabled,
  search,
}) => {
  const currentQueryParams = search ? `${search.replace('promo-code', 'PromoCode')}` : '';
  return newCheckoutEnabled
    ? getNewCheckoutPurchaseUrl({ planType, planId, discountId, currentQueryParams })
    : getLegacyCheckoutPurchaseUrl({ controlPanelUrl, planId, discountId, currentQueryParams });
};
