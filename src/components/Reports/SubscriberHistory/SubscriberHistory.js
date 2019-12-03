import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import SubscriberHistoryCurrentSearch from './SubscriberHistoryCurrentSearch/SubscriberHistoryCurrentSearch';

const SubscriberHistory = () => {
  const intl = useIntl();
  const [state, setState] = useState({ subscriberSearch: '' });
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const searchSubscriber = () => {
    setState({ showResults: true, subscriberEmail: state.subscriberSearch });
  };

  const handeChange = (event) => {
    setState({ showResults: false, subscriberSearch: event.target.value });
  };
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
      <div className="dp-box-shadow col-md-8 col-sm-8" style={{ margin: '80px auto' }}>
        <div className="col-md-8 col-sm-8" style={{ padding: '30px' }}>
          Email Suscriptor
          <div style={{ display: 'flex' }}>
            <input type="text" value={state.subscriberSearch} onChange={handeChange} />
            <button className="dp-button button-medium primary-grey" onClick={searchSubscriber}>
              Buscar
            </button>
          </div>
        </div>
        <div style={{ padding: '30px' }}>
          {state.showResults ? (
            <SubscriberHistoryCurrentSearch email={state.subscriberEmail} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default SubscriberHistory;
