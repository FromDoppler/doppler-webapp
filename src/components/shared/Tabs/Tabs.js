import React from 'react';
import { Link } from 'react-router-dom';

export const Tabs = ({ tabsProperties }) => {
  return (
    <nav className="tabs-wrapper">
      <ul className="tabs-nav" data-tab-active="1">
        {tabsProperties.map((tab) => (
          <li className="tab--item" key={tab.key}>
            <Link to={tab.url} className={tab.active ? 'tab--link active' : 'tab--link'}>
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="tabs-bg"></div>
    </nav>
  );
};
