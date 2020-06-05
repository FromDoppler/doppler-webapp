import React from 'react';
import { FormattedMessage } from 'react-intl';

export const Tabs = ({ tabsProperties }) => {
  return (
    <nav className="tabs-wrapper">
      <ul className="tabs-nav" data-tab-active="1">
        {tabsProperties.map((tab) => (
          <li className="tab--item">
            <a href={tab.url} className={tab.active ? 'tab--link active' : 'tab--link'}>
              <FormattedMessage id={tab.descriptionId} />
            </a>
          </li>
        ))}
      </ul>
      <div className="tabs-bg"></div>
    </nav>
  );
};
