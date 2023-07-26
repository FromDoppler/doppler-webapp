import { useIntl } from 'react-intl';
import { FieldGroup, FieldItemAccessible } from '../../form-helpers/form-helpers';
import { RadioBox, RadioTooltip } from '../RadioBox';
import PropTypes from 'prop-types';

const PaymentFrequency = ({ discounts, selectedDiscount, onSelectDiscount, disabled = false }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getDiscountName = (subscriptionType) =>
    _('buy_process.discount_' + subscriptionType.replace('-', '_'));

  return (
    <FieldGroup aria-label="suscription type">
      {discounts.map((discount) => (
        <FieldItemAccessible key={discount.id} className="col-sm-3 m-b-12">
          <RadioBox
            tooltip={<RadioTooltip discountPercentage={discount.discountPercentage} />}
            value={discount}
            label={getDiscountName(discount.subscriptionType)}
            checked={discount.id === selectedDiscount?.id}
            handleClick={onSelectDiscount}
            disabled={disabled && discount.numberMonths > 1}
          />
        </FieldItemAccessible>
      ))}
    </FieldGroup>
  );
};

PaymentFrequency.propTypes = {
  discounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      discountPercentage: PropTypes.number,
      subscriptionType: PropTypes.string,
    }),
  ),
  selectedDiscount: PropTypes.shape({
    id: PropTypes.number,
  }),
  onSelectDiscount: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default PaymentFrequency;
