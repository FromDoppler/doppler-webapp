import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../doppler-types';
import { PricePerExtraEmail } from './PricePerExtraEmail';
import { PriceWithDiscount } from './PriceWithDiscount';
import { OldPrice } from './OldPrice';
import { TotalPrice } from './TotalPrice';
import styled, { css } from 'styled-components';
import { FormattedMessageMarkdown } from '../../../../i18n/FormattedMessageMarkdown';

const WarningMessage = styled.div`
  text-align: left;
  position: relative;
  top: -42px;
  ${(props) =>
    props.hasDiscount &&
    css`
      top: -6px;
    `}
`;

export const PlanPrice = ({
  selectedPlan,
  selectedDiscount,
  promotion,
  loadingPromocode,
  hasPromocode,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  if (!selectedPlan) {
    return <></>;
  }

  return (
    <div className="dp-price--wrapper">
      {hasPromocode && !loadingPromocode && !promotion.isValid && (
        <WarningMessage
          className="dp-wrap-message dp-wrap-cancel"
          hasDiscount={selectedDiscount?.discountPercentage > 0}
        >
          <span className="dp-message-icon" />
          <div className="dp-content-message">
            <FormattedMessageMarkdown id="plan_calculator.promocode_error_message" />
          </div>
        </WarningMessage>
      )}
      {(selectedDiscount?.discountPercentage > 0 || promotion.discountPercentage > 0) && (
        <OldPrice selectedPlan={selectedPlan} />
      )}
      <TotalPrice
        selectedPlan={selectedPlan}
        discountPercentage={
          promotion.isValid ? promotion.discountPercentage : selectedDiscount?.discountPercentage
        }
      />
      <div className="dp-agreement">
        {selectedDiscount?.discountPercentage > 0 && (
          <PriceWithDiscount selectedPlan={selectedPlan} selectedDiscount={selectedDiscount} />
        )}
        {selectedPlan.type !== PLAN_TYPE.byContact && (
          <PricePerExtraEmail selectedPlan={selectedPlan} />
        )}
        {selectedPlan.type === PLAN_TYPE.byCredit ? (
          <p className="dp-plan-disclaimer">
            {_('plan_calculator.discount_clarification_prepaid')}
          </p>
        ) : (
          <p className="dp-plan-disclaimer">{_('plan_calculator.discount_clarification')}</p>
        )}
      </div>
    </div>
  );
};

PlanPrice.propTypes = {
  selectedPlan: PropTypes.object,
  selectedDiscount: PropTypes.object,
  promotion: PropTypes.object,
  hasPromocode: PropTypes.bool,
  loadingPromocode: PropTypes.bool,
};
