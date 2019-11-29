import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { Loading } from '../../../Loading/Loading';
import { FormattedMessage } from 'react-intl';

const SubscriberHistoryCurrentSubscriber = ({ email, dependencies: { dopplerApiClient } }) => {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const response = await dopplerApiClient.getSubscriber(email);
      if (response.success) {
        setState({ loading: false, subscriber: response.value });
      } else {
        setState({ loading: false });
      }
    };

    fetchData();
  }, [dopplerApiClient, email]);

  return (
    <div>
      {state.loading ? (
        <Loading />
      ) : state.subscriber ? (
        <div>
          <p>email: {state.subscriber.email}</p>
          <p>name: {state.subscriber.fields[0].value}</p>
          <p>ranking: {state.subscriber.score}</p>
          <p>status: {state.subscriber.status}</p>
        </div>
      ) : (
        <p className="dp-boxshadow--error bounceIn">
          <FormattedMessage id="trafficSources.error" />
        </p>
      )}
    </div>
  );
};

export default InjectAppServices(SubscriberHistoryCurrentSubscriber);
