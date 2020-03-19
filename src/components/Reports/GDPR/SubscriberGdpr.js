import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl, FormattedDate } from 'react-intl';
import { Helmet } from 'react-helmet';
import {
  getSubscriberStatusCssClassName,
  extractParameter,
  replaceSpaceWithSigns,
} from './../../../utils';
import queryString from 'query-string';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { StarsScore } from '../../shared/StarsScore/StarsScore';
import SafeRedirect from '../../SafeRedirect';

const SubscriberGdpr = ({ location, dependencies: { dopplerApiClient } }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const [state, setState] = useState({ loading: true });

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

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const email = replaceSpaceWithSigns(extractParameter(location, queryString.parse, 'email'));
      const responseSubscriber = await dopplerApiClient.getSubscriber(email);
      const allFields = await dopplerApiClient.getUserFields();
      if (responseSubscriber.success && allFields.success) {
        const subscriber = {
          firstName: responseSubscriber.value.fields.find((x) => x.name === 'FIRSTNAME'),
          lastName: responseSubscriber.value.fields.find((x) => x.name === 'LASTNAME'),
          email: responseSubscriber.value.email,
          score: responseSubscriber.value.score,
          status: responseSubscriber.value.status,
        };
        const allPermissionFields = allFields.value.filter(
          (customField) => customField.type === 'permission' || customField.type === 'consent',
        );
        const subscriberPermissionFields = responseSubscriber.value.fields.filter(
          (customField) => customField.type === 'permission' || customField.type === 'consent',
        );

        const fields = allPermissionFields.map((field) => {
          const found = subscriberPermissionFields.find(
            (subscriberField) => subscriberField.name === field.name,
          );
          field.value = found ? found.value : 'none';
          return field;
        });

        setState({
          loading: false,
          subscriber: subscriber,
          fields: fields,
          email: email,
        });
      } else {
        setState({ loading: false });
      }
    };
    fetchData();
  }, [dopplerApiClient, location]);

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
      {state.loading ? (
        <Loading />
      ) : state.subscriber ? (
        <>
          <header className="report-filters">
            <div className="dp-container">
              <div className="dp-rowflex">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <Breadcrumb />
                  <h3>
                    <FormattedMessage id="subscriber_gdpr.header_title" />
                  </h3>
                  <p>
                    <FormattedMessage id="subscriber_gdpr.header_description" />
                  </p>
                  <span className="arrow" />
                </div>
              </div>
            </div>
          </header>
          <section className="dp-container">
            <div className="dp-rowflex">
              <div className="col-sm-12 m-t-24 m-b-36">
                <div className="dp-block-wlp dp-box-shadow m-t-36">
                  <header className="dp-header-campaing dp-rowflex p-l-18">
                    <div className="col-lg-6 col-md-12 m-b-24">
                      <div className="dp-calification">
                        <span className="dp-useremail-campaign">
                          <strong>{state.subscriber.email}</strong>
                        </span>
                        <StarsScore score={state.subscriber.score} />
                      </div>
                      <span className="dp-username-campaing">
                        {state.subscriber.firstName ? state.subscriber.firstName.value : ''}{' '}
                        {state.subscriber.lastName ? state.subscriber.lastName.value : ''}
                      </span>
                      <span className="dp-subscriber-icon">
                        <span
                          className={
                            'ms-icon icon-user ' +
                            getSubscriberStatusCssClassName(state.subscriber.status)
                          }
                        ></span>
                        <FormattedMessage id={'subscriber.status.' + state.subscriber.status} />
                      </span>
                      {state.subscriber.status.includes('unsubscribed') ? (
                        <ul className="dp-rowflex col-sm-12 dp-subscriber-info">
                          <li className="col-sm-12 col-md-4 col-lg-3">
                            <span className="dp-block-info">
                              <FormattedMessage id="subscriber_history.unsubscribed_date" />
                            </span>
                            <span>
                              <FormattedDate value={state.subscriber.unsubscribedDate} />
                            </span>
                          </li>
                        </ul>
                      ) : null}
                    </div>
                  </header>
                  <div>
                    <div className="dp-table-responsive">
                      <table
                        className="dp-c-table"
                        aria-label={_('subscriber_history.table_result.aria_label_table')}
                        summary={_('subscriber_history.table_result.aria_label_table')}
                      >
                        <thead>
                          <tr>
                            <th scope="col">
                              <FormattedMessage id="subscriber_gdpr.permission_name" />
                            </th>
                            <th scope="col">
                              <FormattedMessage id="subscriber_gdpr.permission_description" />
                            </th>
                            <th scope="col">
                              <FormattedMessage id="subscriber_gdpr.permission_value" />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.fields.length ? (
                            <>
                              {state.fields.map((field, index) => (
                                <tr key={index}>
                                  <td>{field.name}</td>
                                  <td>
                                    {field.permissionHTML ? (
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: field.permissionHTML
                                            .replace('<p>', '<span>')
                                            .replace('</p>', '</span>'),
                                        }}
                                      />
                                    ) : (
                                      <FormattedMessage id="subscriber_gdpr.empty_html_text" />
                                    )}
                                  </td>
                                  <td>
                                    {field.value.toLowerCase() === 'none' ? (
                                      <div className="dp-icon-wrapper">
                                        <span className="ms-icon icon-lock dp-lock-grey"></span>
                                        <FormattedMessage id="subscriber_gdpr.value_none" />
                                      </div>
                                    ) : field.value.toLowerCase() === 'true' ? (
                                      <div className="dp-icon-wrapper">
                                        <span className="ms-icon icon-lock dp-lock-green"></span>
                                        <FormattedMessage id="subscriber_gdpr.value_true" />
                                      </div>
                                    ) : (
                                      <div className="dp-icon-wrapper">
                                        <span className="ms-icon icon-lock dp-lock-red"></span>
                                        <FormattedMessage id="subscriber_gdpr.value_false" />
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <tr>
                              <td>
                                <span className="bounceIn">
                                  <FormattedMessage id="subscriber_gdpr.empty_data" />
                                </span>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <SafeRedirect to="/Lists/MasterSubscriber/" />
      )}
    </>
  );
};
export default InjectAppServices(SubscriberGdpr);
