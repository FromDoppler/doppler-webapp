import { useState } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { Header } from './Header';
import { SubscriptionDetails } from './SubscriptionDetails';
import { Tabs } from './Tabs';
import { useIntl } from 'react-intl';
import { AddOns } from './AddOns';
import { useQueryParams } from '../../hooks/useQueryParams';
import { useSearchParams } from 'react-router-dom';

export const MyPlan = InjectAppServices(() => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useQueryParams();
  const selectedTab = query.get('selected-tab') ?? 'subscriptionDetails';

  const [activeTab, setActiveTab] = useState(selectedTab);

  const sections = {
    subscriptionDetails: {
      Component: SubscriptionDetails,
      title: `${_(`my_plan.tabs.subscription_details`)}`,
      description: '',
    },
    addOns: {
      Component: AddOns,
      title: 'Add-ons',
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
        if (searchParams.has('selected-tab')) {
          searchParams.delete('selected-tab');
          setSearchParams(searchParams);
        }
        setActiveTab(sectionKey);
      },
    });
  }

  const { Component } = sections[activeTab];

  return (
    <>
      <Header activeTab={activeTab}></Header>
      <div className="dp-container">
        <div className="dp-rowflex">
          <Tabs tabsProperties={tabsProperties} />
          <Component />
        </div>
      </div>
    </>
  );
});
