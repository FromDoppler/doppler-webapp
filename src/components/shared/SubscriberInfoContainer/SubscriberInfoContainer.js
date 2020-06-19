import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import SafeRedirect from '../../SafeRedirect';
import SubscriberInfo from '../SubscriberInfo/SubscriberInfo';

const SubscriberInfoContainer = ({ email, dependencies: { dopplerApiClient } }) => {
  const [stateSubscriber, setStateSubscriber] = useState({ loading: true });

  useEffect(() => {
    const fetchData = async () => {
      setStateSubscriber({ loading: true });
      const responseSubscriber = await dopplerApiClient.getSubscriber(email);
      if (responseSubscriber.success) {
        const subscriber = {
          ...responseSubscriber.value,
          firstName: responseSubscriber.value.fields.find((x) => x.name === 'FIRSTNAME'),
          lastName: responseSubscriber.value.fields.find((x) => x.name === 'LASTNAME'),
        };

        setStateSubscriber({
          subscriber: subscriber,
          loading: false,
        });
      } else {
        setStateSubscriber({ redirect: true });
      }
    };
    fetchData();
  }, [dopplerApiClient, email]);

  if (stateSubscriber.redirect) {
    return <SafeRedirect to="/Lists/MasterSubscriber/" />;
  }

  return (
    <>
      {stateSubscriber.loading ? (
        <Loading />
      ) : (
        <SubscriberInfo subscriber={stateSubscriber.subscriber} />
      )}
    </>
  );
};

export default InjectAppServices(SubscriberInfoContainer);
