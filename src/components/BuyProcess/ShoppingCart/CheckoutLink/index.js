import { FormattedMessage } from 'react-intl';
import { TooltipContainer } from '../../../TooltipContainer/TooltipContainer';
import { useLocation } from 'react-router-dom';
import { CheckoutLinkStyled } from './index.style';

export const CheckoutLink = ({
  showTooltip,
  planType,
  planId,
  discountId,
  monthPlan,
  newCheckoutEnabled,
}) => {
  const { search } = useLocation();

  return (
    <TooltipContainer
      visible={showTooltip}
      content={<FormattedMessage id="plan_calculator.button_purchase_tooltip" />}
      orientation="top"
    >
      <CheckoutLinkStyled
        className={`dp-button button-big primary-green ${showTooltip ? 'disabled' : ''}`}
        href={getBuyPurchaseUrl({
          controlPanelUrl: <FormattedMessage id="common.control_panel_section_url" />,
          planType,
          planId,
          discountId,
          monthPlan,
          newCheckoutEnabled,
          search,
        })}
      >
        <FormattedMessage id="buy_process.buy_now_title" />
      </CheckoutLinkStyled>
    </TooltipContainer>
  );
};

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

export const getBuyPurchaseUrl = ({
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
