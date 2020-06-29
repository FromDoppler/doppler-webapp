import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { InjectAppServices } from '../../../services/pure-di';
import SubscriberPage from '../../shared/SubscriberPage/SubscriberPage';
import SubscriberGdprPermissions from '../GDPRPermissions/SubscriberGdprPermissions';

const SubscriberGdpr = ({ location }) => {
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
        <li>{_('subscriber_gdpr.gpdr_state_breadcrumb')}</li>
      </ul>
    </nav>
  );

  return (
    <>
      <FormattedMessage id="subscriber_gdpr.page_title">
        {(page_title) => (
          <Helmet>
            <title>{page_title}</title>
            <meta name="description" content={_('subscriber_gdpr.page_description')} />
          </Helmet>
        )}
      </FormattedMessage>

      <SubscriberPage
        location={location}
        header={() => (
          <header className="hero-banner report-filters">
            <div className="dp-container">
              <div className="dp-rowflex">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <Breadcrumb />
                  <h2>
                    <FormattedMessage id="subscriber_gdpr.header_title" />
                  </h2>
                  <p>
                    <FormattedMessage id="subscriber_gdpr.header_description" />
                  </p>
                </div>
              </div>
              <span className="arrow"></span>
            </div>
          </header>
        )}
        content={({ subscriber }) => <SubscriberGdprPermissions subscriber={subscriber} />}
      />
    </>
  );
};
export default InjectAppServices(SubscriberGdpr);
