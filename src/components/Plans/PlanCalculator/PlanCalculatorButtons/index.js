import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../../../services/pure-di';
import { TooltipContainer } from '../../../TooltipContainer/TooltipContainer';
import * as S from './index.styles';
import { getPlanTypeFromUrlSegment } from '../../../../utils';
import { useLocation, useParams } from 'react-router-dom';
import { PLAN_TYPE } from '../../../../doppler-types';
import { Loading } from '../../../Loading/Loading';

const excludedCountries = ['AR', 'CO', 'MX'];

export const PlanCalculatorButtons = InjectAppServices(
  ({
    selectedPlanId,
    selectedDiscountId,
    selectedMonthPlan,
    dependencies: { appSessionRef, experimentalFeatures, ipinfoClient },
  }) => {
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);
    const { search } = useLocation();

    const sessionPlan = appSessionRef.current.userData.user;
    const isEqualPlan = sessionPlan.plan.idPlan === selectedPlanId;
    const newCheckoutEnabled = experimentalFeatures.getFeature('newCheckoutEnabled');
    const { planType: planTypeUrlSegment } = useParams();
    const selectedPlanType = getPlanTypeFromUrlSegment(planTypeUrlSegment);
    const sessionPlanType = sessionPlan.plan.planType;

    const [loading, setLoading] = useState(true);
    const [countryCode, setCountryCode] = useState('');

    useEffect(() => {
      const fetchCountry = async () => {
        setLoading(true);
        const data = await ipinfoClient.getCountryCode();
        setCountryCode(data);
        setLoading(false);
      };

      fetchCountry();
    }, [ipinfoClient]);

    if (loading) {
      return <Loading />;
    }

    const redirectNewCheckout =
      sessionPlanType === PLAN_TYPE.free &&
      (!excludedCountries.find((c) => c === countryCode) || newCheckoutEnabled);

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
  const currentQueryParams = search ? `&${search.slice(1).replace('promo-code', 'PromoCode')}` : '';
  return newCheckoutEnabled
    ? getNewCheckoutPurchaseUrl({ planType, planId, discountId, monthPlan, currentQueryParams })
    : getLegacyCheckoutPurchaseUrl({ controlPanelUrl, planId, discountId, currentQueryParams });
};
