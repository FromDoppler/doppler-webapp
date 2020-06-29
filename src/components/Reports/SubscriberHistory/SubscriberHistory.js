import React from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { FormattedMessage, useIntl } from 'react-intl';
import SubscriberPage from '../../shared/SubscriberPage/SubscriberPage';
import SubscriberSentCampaigns from '../SubscriberSentCampaigns/SubscriberSentCampaigns';

const SubscriberHistory = ({ location }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const Breadcrumb = () => (
    <nav className="dp-breadcrumb">
      <ul>
        <li>
          <a href={_('subscriber_history.subscriber_breadcrumb_url')}>
            {_('subscriber_history.subscriber_breadcrumb')}
          </a>
        </li>
        <li>{_('subscriber_history.behaviour_history_breadcrumb')}</li>
      </ul>
    </nav>
  );

  return (
    <SubscriberPage
      location={location}
      header={() => (
        <header className="hero-banner report-filters">
          <div className="dp-container">
            <div className="dp-rowflex">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <Breadcrumb />
                <h2>
                  <FormattedMessage id="subscriber_history.title" />
                </h2>
                <p>
                  <FormattedMessage id="subscriber_history.description" />
                </p>
              </div>
            </div>
            <span className="arrow"></span>
          </div>
        </header>
      )}
      content={({ subscriber }) => (
        <SubscriberSentCampaigns subscriber={subscriber} location={location} />
      )}
    />
  );
};

export default InjectAppServices(SubscriberHistory);
