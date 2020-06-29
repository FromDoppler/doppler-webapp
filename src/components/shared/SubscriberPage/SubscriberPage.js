import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import queryString from 'query-string';
import { extractParameter, replaceSpaceWithSigns } from '../../../utils';
import SubscriberInfo from '../SubscriberInfo/SubscriberInfo';
import SafeRedirect from '../../SafeRedirect';

const SubscriberPage = ({
  location,
  header: Header,
  content: Content,
  dependencies: { dopplerApiClient },
}) => {
  const [stateSubscriber, setStateSubscriber] = useState({ loading: true });

  const email = replaceSpaceWithSigns(extractParameter(location, queryString.parse, 'email'));

  useEffect(() => {
    const fetchData = async () => {
      setStateSubscriber({ loading: true });
      const responseSubscriber = await dopplerApiClient.getSubscriber(email);
      if (responseSubscriber.success) {
        const subscriber = {
          ...responseSubscriber.value,
          // TODO: move this to api client
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
      <Header />
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 m-b-36">
            <div className="dp-block-wlp dp-box-shadow">
              {stateSubscriber.loading ? (
                <Loading />
              ) : (
                <SubscriberInfo subscriber={stateSubscriber.subscriber} />
              )}
              <Content subscriber={stateSubscriber.subscriber} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(SubscriberPage);
