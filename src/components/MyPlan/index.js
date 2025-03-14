import { useState } from 'react';
import { InjectAppServices } from '../../services/pure-di';
import { Header } from './Header';
import { SubscriptionDetails } from './SubscriptionDetails';
import { AddOns } from './AddOns';
import { Tabs } from './Tabs';
import { PaymentMethod } from './PaymentMethod';
import { BillingHistory } from './BillingHistory';

export const MyPlan = InjectAppServices(() => {
  const [activeTab, setActiveTab] = useState('subscriptionDetails');

  const sections = {
    subscriptionDetails: {
      Component: SubscriptionDetails,
      title: 'Detalle de suscripción',
      description: '',
    },
    addOns: {
      Component: AddOns,
      title: 'Add-ons',
      description: '',
    },
    paymentMethod: {
      Component: PaymentMethod,
      title: 'Método de Pago',
      description: '',
    },
    billingHistory: {
      Component: BillingHistory,
      title: 'Historial de Facturación',
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
