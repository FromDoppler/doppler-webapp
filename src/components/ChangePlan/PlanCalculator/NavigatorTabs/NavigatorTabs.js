import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { TooltipContainer } from '../../../TooltipContainer/TooltipContainer';

export const NavigatorTabs = ({ tabs, pathType, selectedPlanType }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getTypePlanDescriptionWithTooltip = (type) => {
    switch (type) {
      case 'prepaid':
      case 'subscribers':
      case 'monthly-deliveries':
        return (
          <>
            {_(`plan_calculator.plan_type_${type.replace('-', '_')}`)}{' '}
            <TooltipContainer
              visible={true}
              content={_(`plan_calculator.plan_type_${type.replace('-', '_')}_tooltip`)}
              orientation="top"
            >
              <span className="ms-icon icon-info-icon"></span>
            </TooltipContainer>
          </>
        );
      default:
        return '';
    }
  };

  return (
    <nav className="tabs-wrapper">
      <ul className="tabs-nav">
        {tabs.map((type, index) => (
          <li className="tab--item" key={index}>
            <Link
              to={`/plan-selection/${pathType}/${type}`}
              className={type === selectedPlanType ? 'tab--link active' : 'tab--link'}
            >
              {getTypePlanDescriptionWithTooltip(type)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
