import React, { useState } from 'react';
import { useIntl } from 'react-intl';

export const PlanList = () => {
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const toggleFeatures = () => setIsFeaturesVisible(!isFeaturesVisible);

  return (
    <>
      <div className="dp-align-center p-t-30">
        <h2>Lista de planes</h2>
        {/* todo: show the paths of the plans */}
      </div>
      <div className="col-sm-12">
        <button
          className={`dp-compare-details-plans ${isFeaturesVisible ? 'dp-open-compare' : ''}`}
          onClick={toggleFeatures}
        >
          {isFeaturesVisible ? _('change_plan.hide_features') : _('change_plan.show_features')}
        </button>
      </div>
    </>
  );
};
