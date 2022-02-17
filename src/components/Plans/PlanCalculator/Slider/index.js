import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { PLAN_TYPE } from '../../../../doppler-types';
import { compactNumber, thousandSeparatorNumber } from '../../../../utils';
import styled from 'styled-components';

const OldCreditsStyled = styled.div`
  padding: 0 !important;
`;

const OldCredits = ({ totalCredits }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <OldCreditsStyled className="dp-price--wrapper">
      <span className="dp-price-old" data-testid="old-credits">
        <span className="dp-price-old-amount">
          {totalCredits} {_(`plans.${PLAN_TYPE.byCredit}_amount_description`)}
        </span>
      </span>
    </OldCreditsStyled>
  );
};

export const Slider = ({
  planType,
  values,
  selectedPlanIndex,
  handleChange,
  promotion,
  isVisible = true,
}) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const amountPlans = values.length;

  const units = thousandSeparatorNumber(intl.defaultLocale, values[selectedPlanIndex]);
  const applyExtraCreditPromocode = planType === PLAN_TYPE.byCredit && promotion.extraCredits > 0;

  const amount = applyExtraCreditPromocode
    ? thousandSeparatorNumber(
        intl.defaultLocale,
        values[selectedPlanIndex] + promotion.extraCredits,
      )
    : units;

  return (
    <>
      <div className="dp-calc-quantity">
        {applyExtraCreditPromocode && <OldCredits totalCredits={units} />}
        <h3>{amount}</h3>
        <h4>{_(`plans.${planType.replace('-', '_')}_amount_description`)}</h4>
      </div>
      {isVisible && (
        <div className="dp-calc-slider progress-bar">
          <input
            className="range-slider"
            type="range"
            disabled={amountPlans === 0}
            min={0}
            max={amountPlans > 1 ? amountPlans - 1 : 1}
            step={1}
            value={selectedPlanIndex}
            onChange={handleChange}
          />
          <div
            className="progress-anchor"
            style={
              amountPlans > 1
                ? { width: `${(selectedPlanIndex * 100) / (amountPlans - 1)}%` }
                : { width: '100%' }
            }
          />
          <div className="dp-indicator">
            {amountPlans > 1 ? (
              <span role="feed">
                <strong>{compactNumber(values[0])}</strong>
              </span>
            ) : (
              <span />
            )}
            <span>
              <strong>{compactNumber(values[amountPlans - 1])}</strong>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

Slider.propTypes = {
  planType: PropTypes.oneOf([PLAN_TYPE.byContact, PLAN_TYPE.byEmail, PLAN_TYPE.byCredit])
    .isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedPlanIndex: PropTypes.number.isRequired,
  handleChange: PropTypes.func,
  promotion: PropTypes.object,
  isVisible: PropTypes.bool,
};
