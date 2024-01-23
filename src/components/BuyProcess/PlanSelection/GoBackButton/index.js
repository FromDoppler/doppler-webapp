import { useIntl } from 'react-intl';

export const GoBackButton = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <button
      type="button"
      className="dp-button button-medium ctaTertiary"
      onClick={() => window.history.back()}
    >
      {_('plan_calculator.button_back')}
    </button>
  );
};
