import { useState } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { Header } from './Header';
import { SubscriptionDetails } from './SubscriptionDetails';
import { Tabs } from './Tabs';
import { useIntl } from 'react-intl';

export const MyPlan = InjectAppServices(() => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [activeTab, setActiveTab] = useState('subscriptionDetails');

  const sections = {
    subscriptionDetails: {
      Component: SubscriptionDetails,
      title: `${_(`my_plan.tabs.subscription_details`)}`,
      description: '',
    },
  };

  const tabsProperties = [];
  for (const sectionKey in sections) {
    const sectionValue = sections[sectionKey];
    tabsProperties.push({
      active: sectionKey === activeTab,
      label: sectionValue.title,
      key: sectionKey,
      handleClick: () => {
        setActiveTab(sectionKey);
      },
    });
  }

  const { Component } = sections[activeTab];

  return (
    <>
      <Header></Header>
      <div className="dp-container">
        <div className="dp-rowflex">
          <Tabs tabsProperties={tabsProperties} />
          <Component />
        </div>
      </div>
    </>
  );
});
