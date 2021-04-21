import React, { useState, useEffect } from 'react';
import { InjectAppServices } from '../../../services/pure-di';
import { Loading } from '../../Loading/Loading';
import { FormattedMessage, useIntl } from 'react-intl';
import PermissionExpandableRow from './PermissionExpandableRow';

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
          (customField) => customField.type === 'permission' || customField.type === 'consent',
        );
        const subscriberPermissionFields = subscriber.fields.filter(
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
        });
      } else {
        setState({ loading: false });
      }
    };
    fetchData();
  }, [dopplerApiClient, subscriber]);

  return (
    <div>
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
    </div>
  );
};

export default InjectAppServices(SubscriberGdprPermissions);
