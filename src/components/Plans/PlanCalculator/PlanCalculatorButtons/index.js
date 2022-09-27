import React from 'react';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../services/pure-di';
import { TooltipContainer } from '../../../TooltipContainer/TooltipContainer';
import * as S from './index.styles';
import { getPlanTypeFromUrlSegment } from '../../../../utils';
import { useLocation, useParams } from 'react-router-dom';
import { PLAN_TYPE } from '../../../../doppler-types';

export const PlanCalculatorButtons = InjectAppServices(
  ({ selectedPlanId, selectedDiscount, selectedMonthPlan, dependencies: { appSessionRef } }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { search } = useLocation();

    const sessionPlan = appSessionRef.current.userData.user;
    const isEqualPlan = sessionPlan.plan.idPlan === selectedPlanId;
    const { planType: planTypeUrlSegment } = useParams();
    const selectedPlanType = getPlanTypeFromUrlSegment(planTypeUrlSegment);
    const sessionPlanType = sessionPlan.plan.planType;
    const redirectNewCheckout = [
      PLAN_TYPE.free,
      PLAN_TYPE.byEmail,
      PLAN_TYPE.byContact,
      PLAN_TYPE.byCredit,
    ].includes(sessionPlanType);

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
              visible={isEqualPlan && sessionPlanType !== PLAN_TYPE.byCredit}
              content={_('plan_calculator.button_purchase_tooltip')}
              orientation="top"
            >
              <S.PurchaseLink
                className={`dp-button button-medium primary-green ${
                  isEqualPlan && sessionPlanType !== PLAN_TYPE.byCredit ? 'disabled' : ''
                }`}
                href={getBuyPurchaseUrl({
                  controlPanelUrl: _('common.control_panel_section_url'),
                  planType: selectedPlanType,
                  planId: selectedPlanId,
                  discountId: selectedDiscount?.id,
                  monthPlan: selectedMonthPlan,
                  newCheckoutEnabled: redirectNewCheckout,
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
    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planId}&fromStep1=True` +
    `${discountId ? `&IdDiscountPlan=${discountId}` : ''}` +
    `${currentQueryParams}`
  );
};

const getNewCheckoutPurchaseUrl = ({
  planType,
  planId,
  discountId,
  monthPlan,
  currentQueryParams,
}) => {
  return (
    `/checkout/premium/${planType}?selected-plan=${planId}` +
    `${discountId ? `&discountId=${discountId}` : ''}` +
    `${monthPlan ? `&monthPlan=${monthPlan}` : ''}` +
    `${currentQueryParams}`
  );
};

const getBuyPurchaseUrl = ({
  controlPanelUrl,
  planType,
  planId,
  discountId,
  monthPlan,
  newCheckoutEnabled,
  search,
}) => {
  const params = new URLSearchParams(search.slice(1));
  // these parameters are eliminated, so that they do not appear repeated in the url
  params.delete('selected-plan');
  params.delete('discountId');
  params.delete('monthPlan');

  const currentQueryParams = params.toString()
    ? `&${params.toString().replace('promo-code', 'PromoCode')}`
    : '';
  return newCheckoutEnabled
    ? getNewCheckoutPurchaseUrl({ planType, planId, discountId, monthPlan, currentQueryParams })
    : getLegacyCheckoutPurchaseUrl({ controlPanelUrl, planId, discountId, currentQueryParams });
};
