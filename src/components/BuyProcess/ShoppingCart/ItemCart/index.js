import PropTypes from 'prop-types';

export const ItemCart = ({
  name,
  featureList,
  billingList,
  handleRemove,
  data,
  isRemovible = false,
}) => {
  return (
    <div className="dp-plan-box">
      <h4>{name}</h4>
      {isRemovible && (
        <button
          type="button"
          aria-label="remove"
          className="dp-icon-close"
          onClick={() => handleRemove(data)}
        />
      )}
      <ul className="dp-purchase-items">
        {featureList.map((featureItem, index) => (
          <li key={`feature-${index}`}>
            <p className="dp-mark">{featureItem}</p>
          </li>
        ))}
      </ul>
      <hr />
      {billingList?.length > 0 && (
        <ul className="dp-items-result">
          {billingList.map((billingItem, index) => (
            <li key={`billing-${index}`}>
              <p className="dp-discount">{billingItem.label}</p>{' '}
              <span className={billingItem.strike ? 'dp-strike' : ''}>{billingItem.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ItemCart.propTypes = {
  name: PropTypes.node,
  featureList: PropTypes.arrayOf(PropTypes.node).isRequired,
  isRemovible: PropTypes.bool,
  handleRemove: PropTypes.func,
  billingList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }),
  ),
  data: PropTypes.object,
};
