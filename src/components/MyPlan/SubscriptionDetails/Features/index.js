import { useIntl } from 'react-intl';

export const Features = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <div className="dp-functionalities">
      <p>
        <strong>{_(`my_plan.subscription_details.features.title`)}</strong>
      </p>
      <div className="dp-func--items">
        <ul className="col-md-6">
          <li>{_(`my_plan.subscription_details.features.feature_1`)}</li>
          <li>{_(`my_plan.subscription_details.features.feature_2`)}</li>
          <li>{_(`my_plan.subscription_details.features.feature_3`)}</li>
        </ul>
        <ul className="col-md-6">
          <li>{_(`my_plan.subscription_details.features.feature_4`)}</li>
          <li>{_(`my_plan.subscription_details.features.feature_5`)}</li>
        </ul>
      </div>
    </div>
  );
};
