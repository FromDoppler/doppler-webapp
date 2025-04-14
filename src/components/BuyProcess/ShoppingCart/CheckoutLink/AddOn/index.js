import { useLocation } from 'react-router-dom';
import { TooltipContainer } from '../../../../TooltipContainer/TooltipContainer';
import { FormattedMessage } from 'react-intl';
import { CheckoutLinkStyled } from '../index.style';

export const getNewCheckoutPurchaseUrl = ({
  planId,
  planType,
  addOnPlanId,
  buyType,
  monthPlan,
  currentQueryParams,
}) => {
  return (
    `/checkout/premium/${planType}?selected-plan=${planId}` +
    `&addOnPlanId=${addOnPlanId}` +
    `${monthPlan ? `&monthPlan=${monthPlan}` : ''}` +
    `${currentQueryParams}`
  );
};

export const getBuyPurchaseUrl = ({ planId, planType, addOnPlanId, monthPlan, search }) => {
  const params = new URLSearchParams(search.slice(1));
  // these parameters are eliminated, so that they do not appear repeated in the url
  params.delete('monthPlan');

  const currentQueryParams = params.toString() ? `&${params.toString()}` : '';

  return getNewCheckoutPurchaseUrl({
    planId,
    planType,
    addOnPlanId,
    monthPlan,
    currentQueryParams,
  });
};

export const AddOnCheckoutLink = ({ planId, showTooltip, planType, addOnPlanId, monthPlan }) => {
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
          planId,
          planType,
          addOnPlanId,
          monthPlan,
          search,
        })}
      >
        <FormattedMessage id="buy_process.continue" />
      </CheckoutLinkStyled>
    </TooltipContainer>
  );
};
