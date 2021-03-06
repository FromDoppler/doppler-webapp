import React from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

export const Card = ({ children, className, highlighted, ...rest }) => {
  // TODO: double negation (!!) should be removed
  return (
    <div
      className={classNames({ 'dp-card': true, 'dp-highlighthed': !!highlighted }, className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardAction = ({ url, children, ...rest }) => {
  return (
    <div className="dp-cta-plan">
      <Link to={url} className="dp-button button-medium primary-green" {...rest}>
        {children}
      </Link>
    </div>
  );
};

// TODO: the variable name 'doNotShowSince' should be an affirmative expression. 'doNotShowSince' is hard to read
export const CardPrice = ({ currency, children, doNotShowSince }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="dp-price">
      {doNotShowSince ? '' : <span className="dp-time-lapse-top">{_('change_plan.since')}</span>}
      <div className="dp-amount">
        <span className="dp-plan-currency">{currency}</span>
        <span className="dp-money-number">{children}</span>
      </div>
      <span className="dp-time-lapse-bottom">{_('change_plan.per_month')}</span>
    </div>
  );
};

export const Ribbon = ({ position = 'top-right', content }) => {
  return (
    <div className={`dp-ribbon dp-ribbon-${position}`}>
      <span>{content}</span>
    </div>
  );
};

export const CardFeatures = ({ children }) => {
  return <div className="dp-plan-detail">{children}</div>;
};
