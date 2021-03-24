import React, { useState } from 'react';
import * as S from './SubscriberGdpr.styles';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
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

const PermissionExpandableRow = ({ field, dependencies: { experimentalFeatures } }) => {
  const [expanded, setExpanded] = useState(false);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id }, values);
  const isPermissionHistoryEnabled =
    experimentalFeatures && experimentalFeatures.getFeature('PermissionHistory');

  /**
   * Toggle the expanded state of the row and fetch the permissions if the row is expanded.
   */
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <tr>
        <td>
          <span className="dp-name-text">
            {isPermissionHistoryEnabled && field.value != 'none' && (
              <button
                type="button"
                onClick={toggleExpanded}
                className={`dp-expand-results ${expanded && 'dp-open-results'}`}
              >
                <i className="ms-icon icon-arrow-next"></i>
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
                    <th aria-label={_('subscriber_gdpr.source_form')} scope="col">
                      <FormattedMessage id="subscriber_gdpr.source_form" tagName="span" />:
                    </th>
                  </tr>
                </thead>
              </table>
            </td>
            <td />
          </>
        </tr>
      )}
    </>
  );
};

PermissionExpandableRow.propTypes = {
  field: PropTypes.object,
};

export default InjectAppServices(PermissionExpandableRow);
