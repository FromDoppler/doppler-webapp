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

const sections = {
  history: {
    Component: SubscriberSentCampaigns,
    titleKey: 'subscriber_history.title',
    descriptionKey: 'subscriber_history.description',
    pageTitleKey: 'subscriber_history.title',
    pageDescriptionKey: 'subscriber_history.description',
    breadcrumbDescriptionText: 'subscriber_history.behaviour_history_breadcrumb',
  },
  gdpr: {
    Component: SubscriberGdprPermissions,
    titleKey: 'subscriber_gdpr.header_title',
    descriptionKey: 'subscriber_gdpr.header_description',
    pageTitleKey: 'subscriber_gdpr.page_title',
    pageDescriptionKey: 'subscriber_gdpr.page_description',
    breadcrumbDescriptionText: 'subscriber_gdpr.gpdr_state_breadcrumb',
  },
};

const Subscribers = ({ dependencies: { dopplerApiClient } }) => {
  const { email, section } = useParams();
  const [state, setState] = useState({ loading: true });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

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

  const {
    Component,
    titleKey,
    descriptionKey,
    pageTitleKey,
    pageDescriptionKey,
    breadcrumbDescriptionText,
  } = sections[section];

  return (
    <>
      <Helmet>
        <title>{_(pageTitleKey)}</title>
        <meta name="description" content={_(pageDescriptionKey)} />
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
                  <li>{_(breadcrumbDescriptionText)}</li>
                </ul>
              </nav>
              <h2>{_(titleKey)}</h2>
              <p> {_(descriptionKey)} </p>
            </div>
          </div>
          <span className="arrow"></span>
        </div>
      </header>

      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 m-b-36">
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
