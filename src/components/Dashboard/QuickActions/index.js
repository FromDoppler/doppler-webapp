import React from 'react';
import { useIntl } from 'react-intl';

export const QUICK_ACTIONS = [
  {
    labelId: 'dashboard.quick_actions.make_campaign',
    linkId: 'dashboard.quick_actions.make_campaign_url',
  },
  {
    labelId: 'dashboard.quick_actions.make_contact_list',
    linkId: 'dashboard.quick_actions.make_contact_list_url',
  },
  {
    labelId: 'dashboard.quick_actions.launch_automation',
    linkId: 'dashboard.quick_actions.launch_automation_url',
  },
  {
    labelId: 'dashboard.quick_actions.send_sms',
    linkId: 'dashboard.quick_actions.send_sms_url',
  },
];

export const QuickActions = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <h2 className="dp-title-col-postcard">{_('dashboard.quick_actions.section_name')}</h2>
      <ul className="dp-quick-actions">
        {QUICK_ACTIONS.map((qa, index) => (
          <li key={`qa-${index}`}>
            <a href={_(qa.linkId)} target="_blank">
              <span className="action-title">{_(qa.labelId)}</span>
              <span className="ms-icon icon-arrow-next" />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};
