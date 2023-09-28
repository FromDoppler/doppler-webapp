import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

const RadioBox = ({
  tooltip,
  footer,
  info,
  value,
  label,
  checked = false,
  disabled = false,
  name,
  handleClick,
}) => {
  return (
    <div className={`dp-input--radio dp-checkout-radio-${checked ? 'selected' : 'notselected'}`}>
      <label aria-disabled={disabled}>
        {tooltip}
        <input
          type="radio"
          name={name || 'radio'}
          value={value}
          checked={checked}
          onChange={() => handleClick(value)}
          disabled={disabled}
        />
        <span>{label}</span>
        {footer}
      </label>
      {info}
    </div>
  );
};

RadioBox.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.number,
      description: PropTypes.string,
    }),
    PropTypes.string,
  ]),
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  tooltip: PropTypes.node,
  footer: PropTypes.node,
  info: PropTypes.node,
};

const RadioTooltip = ({ discountPercentage }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  if (!discountPercentage) {
    return <></>;
  }

  return (
    <span className={`dp-label-discount-${discountPercentage}`}>
      {_('buy_process.discount_percentage', { discountPercentage })}
    </span>
  );
};

RadioTooltip.propTypes = {
  discountPercentage: PropTypes.number.isRequired,
};

const RadioFooter = ({ price }) => {
  return (
    <div className="dp-footer--radio">
      <FormattedMessage
        id={'buy_process.min_monthly_plan_price'}
        values={{
          Strong: (chunks) => <strong>{chunks}</strong>,
          price,
        }}
      />
    </div>
  );
};

const RadioInfo = ({ info }) => {
  return <div className="dp-show-info">{info}</div>;
};

RadioFooter.propTypes = {
  price: PropTypes.string.isRequired,
};

export { RadioBox, RadioTooltip, RadioFooter, RadioInfo };
