import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

export const GoBackButton = ({ goBackUrl }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const _ = (id, values) => intl.formatMessage({ id }, values);

  return (
    <button
      type="button"
      className="dp-button button-medium ctaTertiary dp-new-plan-selection-back-button"
      onClick={() => (goBackUrl ? navigate(goBackUrl) : window.history.back())}
    >
      <span className="dp-new-plan-selection-back-text">{_('plan_calculator.button_back')}</span>
    </button>
  );
};
