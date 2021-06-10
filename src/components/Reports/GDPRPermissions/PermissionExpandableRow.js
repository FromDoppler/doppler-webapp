import React, { useEffect, useState } from 'react';
import * as S from './SubscriberGdpr.styles';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Loading } from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';

const PermissionValue = ({ value }) => {
  const permissionValue = value ? value.toLowerCase() : 'none';
  const iconColor =
    permissionValue === 'none' ? 'grey' : permissionValue === 'true' ? 'green' : 'red';

  return (
    <span>
      <span className={`ms-icon icon-lock dp-lock-${iconColor}`} />
      <FormattedMessage id={`subscriber_gdpr.value_${permissionValue}`} />
    </span>
  );
};

const PermissionExpandableRow = ({ field, email, dependencies: { dopplerApiClient } }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id }, values);

  useEffect(() => {
    if (expanded) {
      const fetchData = async () => {
        setLoading(true);
        const fieldName = field.name;
        const { success, value } = await dopplerApiClient.getSubscriberPermissionHistory({
          subscriberEmail: email,
          fieldName,
        });
        if (success) {
          setError(false);
          setPermissions(value.items);
        } else {
          setError(true);
          setPermissions(undefined);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [expanded, dopplerApiClient, email, field.name]);

  return (
    <>
      <tr>
        <td>
          <span className="dp-name-text">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={`dp-expand-results ${expanded ? 'dp-open-results' : ''}`}
            >
              <i className="ms-icon icon-arrow-next" />
            </button>
            {field.name}
          </span>
        </td>
        <td>
          {field.permissionHTML ? (
            <S.TextColumn dangerouslySetInnerHTML={{ __html: field.permissionHTML }} />
          ) : (
            <FormattedMessage id="subscriber_gdpr.empty_html_text" />
          )}
        </td>
        <td>
          <div className="dp-icon-lock">
            <PermissionValue value={field.value} />
          </div>
        </td>
      </tr>
      <tr className={`dp-expanded-table ${expanded ? 'show' : ''}`}>
        {loading ? (
          <>
            <td />
            <td>
              <S.EmptyBox>
                <Loading />
              </S.EmptyBox>
            </td>
            <td />
          </>
        ) : error ? (
          <td className="dp-unexpected-error-table" colSpan={3}>
            <span>
              <span className="dp-icon-warning" />
              <FormattedMessage id={'validation_messages.error_unexpected_MD'} />
            </span>
          </td>
        ) : (
          <>
            <td className="dp-latest-results">
              <FormattedMessage id="subscriber_gdpr.latest_results" tagName="span" />
            </td>
            <td className="dp-list-results">
              <table className="dp-table-results">
                <thead>
                  <tr>
                    <th aria-label={_('subscriber_gdpr.consent')} scope="col">
                      <FormattedMessage id="subscriber_gdpr.consent" tagName="span" />
                    </th>
                    {permissions.length > 0 && (
                      <>
                        <th aria-label={_('subscriber_gdpr.modification_source_ip')} scope="col">
                          <FormattedMessage
                            id="subscriber_gdpr.modification_source_ip"
                            tagName="span"
                          />
                        </th>
                        <th aria-label={_('subscriber_gdpr.modification_date')} scope="col">
                          <FormattedMessage id="subscriber_gdpr.modification_date" tagName="span" />
                        </th>
                        {permissions.some((p) => p.originType) ? (
                          <th aria-label={_('subscriber_gdpr.modification_source')} scope="col">
                            <FormattedMessage
                              id="subscriber_gdpr.modification_source"
                              tagName="span"
                            />
                          </th>
                        ) : null}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {permissions.length === 0 ? (
                    <tr>
                      <td>
                        <PermissionValue value={'none'} />
                      </td>
                    </tr>
                  ) : (
                    permissions.map(({ value, originIP, date, originType }, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <PermissionValue value={value} />
                          </td>
                          <td>{originIP}</td>
                          <td>
                            <FormattedDate value={date} />
                          </td>
                          {originType ? <td>{originType}</td> : null}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </td>
            <td />
          </>
        )}
      </tr>
    </>
  );
};

PermissionExpandableRow.propTypes = {
  field: PropTypes.object,
};

export default InjectAppServices(PermissionExpandableRow);
