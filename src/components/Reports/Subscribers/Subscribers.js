import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { useParams } from 'react-router-dom';
import { Loading } from '../../Loading/Loading';
import SafeRedirect from '../../SafeRedirect';
import SubscriberGdprPermissions from '../GDPRPermissions/SubscriberGdprPermissions';
import SubscriberSentCampaigns from '../SubscriberSentCampaigns/SubscriberSentCampaigns';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import SubscriberInfo from '../../shared/SubscriberInfo/SubscriberInfo';
import { Tabs } from '../../shared/Tabs/Tabs';

const Subscribers = ({ dependencies: { dopplerApiClient } }) => {
  const { email, section } = useParams();
  const [state, setState] = useState({ loading: true });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const sections = {
    history: {
      Component: SubscriberSentCampaigns,
      title: _('subscriber_history.title'),
      description: _('subscriber_history.description'),
    },
    gdpr: {
      Component: SubscriberGdprPermissions,
      title: _('subscriber_gdpr.title'),
      description: _('subscriber_gdpr.description'),
    },
  };

  const tabsProperties = [];
  for (const sectionKey in sections) {
    const sectionValue = sections[sectionKey];
    tabsProperties.push({
      url: `/subscribers/${email}/${sectionKey}`,
      active: sectionKey === section,
      label: sectionValue.title,
      key: sectionKey,
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const responseSubscriber = await dopplerApiClient.getSubscriber(email);
      if (responseSubscriber.success) {
        const subscriber = {
          ...responseSubscriber.value,
          // TODO: move this to api client
          firstName: responseSubscriber.value.fields.find((x) => x.name === 'FIRSTNAME'),
          lastName: responseSubscriber.value.fields.find((x) => x.name === 'LASTNAME'),
        };

        setState({
          subscriber: subscriber,
          loading: false,
        });
      } else {
        setState({ redirect: true });
      }
    };
    fetchData();
  }, [dopplerApiClient, email]);

  // TODO: review do not call ajax if section does not exist.
  if (!sections[section] || state.redirect) {
    return <SafeRedirect to="/Lists/MasterSubscriber/" />;
  }

  if (state.loading) {
    return <Loading page />;
  }

  const { Component, ...currentSection } = sections[section];

  return (
    <>
      <Helmet>
        <title>{currentSection.title}</title>
        <meta name="description" content={currentSection.description} />
      </Helmet>

      <header className="hero-banner report-filters">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <nav className="dp-breadcrumb">
                <ul>
                  <li>
                    {/* TODO: rename as master_subscriber_url and master_subscriber_title */}
                    <a href={_('subscriber_history.subscriber_breadcrumb_url')}>
                      {_('subscriber_history.subscriber_breadcrumb')}
                    </a>
                  </li>
                  <li>{currentSection.title}</li>
                </ul>
              </nav>
              <h2>{currentSection.title}</h2>
              <p>{currentSection.description}</p>
            </div>
          </div>
          <span className="arrow"></span>
        </div>
      </header>

      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 m-b-36">
            <Tabs tabsProperties={tabsProperties} />
            <div className="dp-block-wlp dp-box-shadow">
              <SubscriberInfo subscriber={state.subscriber} />
              <Component subscriber={state.subscriber} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(Subscribers);
