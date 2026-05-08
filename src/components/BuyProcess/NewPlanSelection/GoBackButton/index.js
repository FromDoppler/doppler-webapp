import { useIntl } from 'react-intl';

export const GoBackButton = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id }, values);

  return (
    <button
      type="button"
      className="dp-button button-medium ctaTertiary dp-new-plan-selection-back-button"
      onClick={() => window.history.back()}
    >
      <span className="dp-new-plan-selection-back-text">{_('plan_calculator.button_back')}</span>
    </button>
  );
};
