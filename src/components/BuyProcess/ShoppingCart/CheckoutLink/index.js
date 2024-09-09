import { FormattedMessage } from 'react-intl';
import { TooltipContainer } from '../../../TooltipContainer/TooltipContainer';
import { useLocation } from 'react-router-dom';
import { CheckoutLinkStyled } from './index.style';

export const CheckoutLink = ({
  showTooltip,
  planType,
  planId,
  discountId,
  promocode,
  monthPlan,
  newCheckoutEnabled,
  chatPlanId,
  hasChatActive,
}) => {
  const { search } = useLocation();

  return (
    <TooltipContainer
      visible={false}
      content={<FormattedMessage id="plan_calculator.button_purchase_tooltip" />}
      orientation="top"
    >
      <CheckoutLinkStyled
        className={`dp-button button-big primary-green ${false ? 'disabled' : ''}`}
        href={getBuyPurchaseUrl({
          controlPanelUrl: <FormattedMessage id="common.control_panel_section_url" />,
          planType,
          planId,
          discountId,
          promocode,
          monthPlan,
          newCheckoutEnabled,
          search,
          chatPlanId,
          hasChatActive,
        })}
      >
        <FormattedMessage id="buy_process.continue" />
      </CheckoutLinkStyled>
    </TooltipContainer>
  );
};

const getLegacyCheckoutPurchaseUrl = ({
  controlPanelUrl,
  planId,
  discountId,
  promocode,
  currentQueryParams,
}) => {
  return (
    controlPanelUrl +
    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${planId}&fromStep1=True` +
    `${discountId ? `&IdDiscountPlan=${discountId}` : ''}` +
    `${promocode ? `&PromoCode=${promocode}` : ''}` +
    `${currentQueryParams}`
  );
};

const getNewCheckoutPurchaseUrl = ({
  planType,
  planId,
  discountId,
  promocode,
  monthPlan,
  currentQueryParams,
  chatPlanId,
}) => {
  return (
    `/checkout/premium/${planType}?selected-plan=${planId}` +
    `${discountId ? `&discountId=${discountId}` : ''}` +
    `${promocode ? `&PromoCode=${promocode}` : ''}` +
    `${monthPlan ? `&monthPlan=${monthPlan}` : ''}` +
    `${chatPlanId ? `&chatPlanId=${chatPlanId}` : ''}` +
    `${currentQueryParams}`
  );
};

const getBuyChatPlanUrl = ({
  planType,
  planId,
  discountId,
  promocode,
  monthPlan,
  currentQueryParams,
}) => {
  return (
    `/plan-chat/premium/${planType}?selected-plan=${planId}` +
    `${discountId ? `&discountId=${discountId}` : ''}` +
    `${promocode ? `&PromoCode=${promocode}` : ''}` +
    `${monthPlan ? `&monthPlan=${monthPlan}` : ''}` +
    `${currentQueryParams}`
  );
};

export const getBuyPurchaseUrl = ({
  controlPanelUrl,
  planType,
  planId,
  discountId,
  promocode,
  monthPlan,
  newCheckoutEnabled,
  search,
  chatPlanId,
  hasChatActive,
}) => {
  const params = new URLSearchParams(search.slice(1));
  // these parameters are eliminated, so that they do not appear repeated in the url
  params.delete('selected-plan');
  params.delete('discountId');
  params.delete('monthPlan');
  params.delete('promo-code');
  params.delete('PromoCode');

  const currentQueryParams = params.toString()
    ? `&${params.toString().replace('promo-code', 'PromoCode')}`
    : '';

  return !hasChatActive
    ? newCheckoutEnabled
      ? getNewCheckoutPurchaseUrl({
          planType,
          planId,
          discountId,
          promocode: encodeURI(promocode),
          monthPlan,
          currentQueryParams,
          chatPlanId,
        })
      : getLegacyCheckoutPurchaseUrl({
          controlPanelUrl,
          planId,
          discountId,
          promocode: encodeURI(promocode),
          currentQueryParams,
        })
    : getBuyChatPlanUrl({
        planType,
        planId,
        discountId,
        promocode: encodeURI(promocode),
        monthPlan,
        currentQueryParams,
      });
};
