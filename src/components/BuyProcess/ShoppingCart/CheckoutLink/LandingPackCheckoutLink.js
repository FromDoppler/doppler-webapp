import { FormattedMessage } from 'react-intl';
import { TooltipContainer } from '../../../TooltipContainer/TooltipContainer';
import { useLocation } from 'react-router-dom';
import { CheckoutLinkStyled } from './index.style';

export const LandingPackCheckoutLink = ({
  showTooltip,
  planType,
  landingIds,
  landingPacks,
  monthPlan,
}) => {
  const { search } = useLocation();

  return (
    <TooltipContainer
      visible={showTooltip}
      content={<FormattedMessage id="plan_calculator.button_purchase_tooltip" />}
      orientation="top"
    >
      <CheckoutLinkStyled
        className={`dp-button button-big primary-green ${
          showTooltip || !landingIds?.length ? 'disabled' : ''
        }`}
        href={getBuyPurchaseUrl({
          planType,
          landingIds,
          landingPacks,
          monthPlan,
          search,
        })}
      >
        <FormattedMessage id="buy_process.continue" />
      </CheckoutLinkStyled>
    </TooltipContainer>
  );
};

export const getNewCheckoutPurchaseUrl = ({
  planType,
  landingIds,
  landingPacks,
  monthPlan,
  currentQueryParams,
}) => {
  return (
    `/checkout/premium/${planType}?landing-ids=${landingIds}&landing-packs=${landingPacks}` +
    `${monthPlan ? `&monthPlan=${monthPlan}` : ''}` +
    `${currentQueryParams}`
  );
};

export const getBuyPurchaseUrl = ({ planType, landingIds, landingPacks, monthPlan, search }) => {
  const params = new URLSearchParams(search.slice(1));
  // these parameters are eliminated, so that they do not appear repeated in the url
  params.delete('monthPlan');

  const currentQueryParams = params.toString() ? `&${params.toString()}` : '';

  return getNewCheckoutPurchaseUrl({
    planType,
    landingIds,
    landingPacks,
    monthPlan,
    currentQueryParams,
  });
};
