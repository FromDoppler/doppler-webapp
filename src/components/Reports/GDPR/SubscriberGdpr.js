import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import {
  extractParameter,
  replaceSpaceWithSigns,
} from './../../../utils';
import queryString from 'query-string';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import SafeRedirect from '../../SafeRedirect';
import * as S from './SubscriberGdpr.styles';
import SubscriberInfoContainer from '../../shared/SubscriberInfoContainer/SubscriberInfoContainer';

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

  const email = replaceSpaceWithSigns(extractParameter(location, queryString.parse, 'email'));

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const responseSubscriber = await dopplerApiClient.getSubscriber(email);
      const allFields = await dopplerApiClient.getUserFields();
      if (responseSubscriber.success && allFields.success) {
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
          fields: fields,
          email: email,
        });
      } else {
        setState({ redirect: true });
      }
    };
    fetchData();
  }, [dopplerApiClient, location, email]);

  if (state.redirect) {
    return <SafeRedirect to="/Lists/MasterSubscriber/" />;
  }

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
      <>
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
        <section className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 m-b-36">
              <div className="dp-block-wlp dp-box-shadow">
                <SubscriberInfoContainer email={email} />
                <div>
                  <div className="dp-table-responsive">
                    {state.loading ? (
                      <Loading />
                    ) : (
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
                                      <S.TextColumn
                                        dangerouslySetInnerHTML={{ __html: field.permissionHTML }}
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </>
  );
};
export default InjectAppServices(SubscriberGdpr);
