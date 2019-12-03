import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../../services/pure-di';
import { Loading } from '../../../Loading/Loading';
import { FormattedMessage } from 'react-intl';

const SubscriberHistoryCurrentSearch = ({ email, dependencies: { dopplerApiClient } }) => {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const response = await dopplerApiClient.getSubscriber(email);
      if (response.success) {
        const subscriber = {
          ...response.value,
          firstName: response.value.fields.find((x) => x.name === 'FIRSTNAME'),
          lastName: response.value.fields.find((x) => x.name === 'LASTNAME'),
        };
        setState({ loading: false, subscriber: subscriber });
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
        <table className="dp-c-table">
          <thead>
            <tr>
              <th>email</th>
              <th>nombre</th>
              <th>apellido</th>
              <th>ranking</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{state.subscriber.email}</td>
              <td>{state.subscriber.firstName ? state.subscriber.firstName.value : ''}</td>
              <td>{state.subscriber.lastName ? state.subscriber.lastName.value : ''}</td>
              <td>{state.subscriber.score}</td>
              <td>{state.subscriber.status}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="dp-boxshadow--error bounceIn">
          <FormattedMessage id="trafficSources.error" />
        </p>
      )}
    </div>
  );
};

export default InjectAppServices(SubscriberHistoryCurrentSearch);
