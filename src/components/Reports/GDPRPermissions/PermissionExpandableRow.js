import React, { useEffect, useState } from 'react';
import * as S from './SubscriberGdpr.styles';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Loading } from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';

const PermissionValue = ({ value }) => {
  const permissionValue = value.toLowerCase();
  const iconColor =
    permissionValue === 'none' ? 'grey' : permissionValue === 'true' ? 'green' : 'red';

  return (
    <div className="dp-icon-wrapper">
      <span className={`ms-icon icon-lock dp-lock-${iconColor}`} />
      <FormattedMessage id={`subscriber_gdpr.value_${permissionValue}`} />
    </div>
  );
};

const PermissionExpandableRow = ({
  field,
  email,
  dependencies: { dopplerApiClient, experimentalFeatures },
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id }, values);
  const isPermissionHistoryEnabled =
    experimentalFeatures && experimentalFeatures.getFeature('PermissionHistory');

  const fetchData = async () => {
    if (isPermissionHistoryEnabled) {
      setLoading(true);
      const fieldName = field.name;
      const { success, value } = await dopplerApiClient.getSubscriberPermissionHistory({
        subscriberEmail: email,
        fieldName,
      });
      if (success) {
        setPermissions(value.items);
      } else {
        setPermissions([]);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchData();
    }
  }, [expanded]);

  return (
    <>
      <tr>
        <td>
          <span className="dp-name-text">
            {isPermissionHistoryEnabled && field.value !== 'none' && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className={`dp-expand-results ${expanded && 'dp-open-results'}`}
              >
                <i className="ms-icon icon-arrow-next" />
              </button>
            )}
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
          <PermissionValue value={field.value} />
        </td>
      </tr>

      {isPermissionHistoryEnabled && (
        <tr className={`dp-expanded-table ${expanded && 'show'} dp-table-responsive`}>
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
          ) : !permissions || permissions.length === 0 ? (
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
                        <FormattedMessage id="subscriber_gdpr.consent" tagName="span" />:
                      </th>
                      <th aria-label={_('subscriber_gdpr.modification_source_ip')} scope="col">
                        <FormattedMessage
                          id="subscriber_gdpr.modification_source_ip"
                          tagName="span"
                        />
                        :
                      </th>
                      <th aria-label={_('subscriber_gdpr.modification_date')} scope="col">
                        <FormattedMessage id="subscriber_gdpr.modification_date" tagName="span" />:
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map(({ value, originIP, date }, index) => {
                      return (
                        <tr>
                          <td>
                            <PermissionValue key={index} value={value} />
                          </td>
                          <td>{originIP}</td>
                          <td>
                            <FormattedDate key={index} value={date} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </td>
              <td />
            </>
          )}
        </tr>
      )}
    </>
  );
};

PermissionExpandableRow.propTypes = {
  field: PropTypes.object,
};

export default InjectAppServices(PermissionExpandableRow);
