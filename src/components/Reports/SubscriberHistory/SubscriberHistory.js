import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';

const SubscriberHistory = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <>
      <FormattedMessage id="subscriber_history.page_title">
        {(page_title) => (
          <Helmet>
            <title>{page_title}</title>
            <meta name="description" content={_('subscriber_history.page_description')} />
          </Helmet>
        )}
      </FormattedMessage>
      <header className="report-filters">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <h3>
                <FormattedMessage id="subscriber_history.header_title" />
              </h3>
              <span className="arrow" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default SubscriberHistory;
