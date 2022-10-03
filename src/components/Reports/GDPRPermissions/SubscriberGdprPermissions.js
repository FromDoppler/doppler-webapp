import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { FormattedMessage, useIntl } from 'react-intl';
import PermissionExpandableRow from './PermissionExpandableRow';
import { DownloadLink } from './SubscriberGdpr.styles';

const SubscriberGdprPermissions = ({
  subscriber,
  dependencies: {
    dopplerApiClient,
    appConfiguration: { reportsUrl },
  },
}) => {
  const [state, setState] = useState({ loading: true });
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  useEffect(() => {
    setState({ loading: true });
    if (!subscriber) {
      return;
    }
    const fetchData = async () => {
      const allFields = await dopplerApiClient.getUserFields();

      if (allFields.success) {
        const allPermissionFields = allFields.value.filter(
          (customField) => customField.type === 'permission',
        );
        const subscriberPermissionFields = subscriber.fields.filter(
          (customField) => customField.type === 'permission',
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
        });
      } else {
        setState({ loading: false });
      }
    };
    fetchData();
  }, [dopplerApiClient, subscriber]);

  return (
    <div>
      <meta name="doppler-menu-mfe:default-active-item" content="listCustomFieldMenu" />
      <div className="dp-table-responsive">
        {state.loading ? (
          <Loading page />
        ) : (
          <table
            className="dp-c-table dp-nested-table"
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
                    <PermissionExpandableRow field={field} key={index} email={subscriber.email} />
                  ))}
                </>
              ) : (
                <tr>
                  <td>
                    <span className="bounceIn">
                      <FormattedMessage id="subscriber_gdpr.empty_data" />
                    </span>
                  </td>
                  <td />
                  <td />
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {subscriber.downloadPermissionHistoryUrl ? (
        <DownloadLink className="dp-cta-links">
          <a href={subscriber.downloadPermissionHistoryUrl}>
            <i className="ms-icon icon-download"> </i>
            <span className="m-l-6 align-middle">
              <FormattedMessage id="subscriber_gdpr.download_permission_history" />
            </span>
          </a>
        </DownloadLink>
      ) : null}
    </div>
  );
};

export default InjectAppServices(SubscriberGdprPermissions);
