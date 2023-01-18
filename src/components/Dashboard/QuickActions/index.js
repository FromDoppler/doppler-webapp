import React from 'react';
import { useIntl } from 'react-intl';

export const QuickActions = ({ quickActions = [] }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <h2 className="dp-title-col-postcard">{_('dashboard.quick_actions.section_name')}</h2>
      <ul className="dp-quick-actions">
        {quickActions.map((qa, index) => (
          <li key={`qa-${index}`}>
            <a href={_(qa.linkId)} target="_blank" id={qa.trackingId}>
              <span className="action-title">{_(qa.labelId)}</span>
              <span className="ms-icon icon-arrow-next" />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};
