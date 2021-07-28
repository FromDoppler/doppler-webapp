import { IconMessage } from '../form-helpers/form-helpers';
import React from 'react';
import { useIntl } from 'react-intl';

export const Promotional = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  return (
    <section className="dp-gray-page p-t-54 p-b-54">
      <div className="dp-container">
        <div className="dp-rowflex">
          <div className="col-lg-6">
            <IconMessage text={_('common.feature_no_available')} />
          </div>
        </div>
      </div>
    </section>
  );
};
