import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { extractParameter } from './../../../utils';
import queryString from 'query-string';
import { InjectAppServices } from '../../../services/pure-di';

const SubscriberGdpr = ({ location }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const replaceSpaceWithSigns = (url) => {
    return url ? url.replace(' ', '+') : '';
  };

  const email = replaceSpaceWithSigns(extractParameter(location, queryString.parse, 'email'));

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
      <header className="report-filters">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <h3>
                <FormattedMessage id="subscriber_gdpr.header_title" />
              </h3>
              <span className="arrow" />
            </div>
          </div>
        </div>
      </header>
      <section className="dp-container">{email}</section>
    </>
  );
};
export default InjectAppServices(SubscriberGdpr);
