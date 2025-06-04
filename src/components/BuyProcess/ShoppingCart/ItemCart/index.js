import PropTypes from 'prop-types';

export const ItemCart = ({
  name,
  featureList,
  billingList,
  subscriptionItems,
  handleRemove,
  data,
  isRemovible = false,
}) => {
  return (
    <div className="dp-plan-box">
      <h3 className="dp-second-order-title">{name}</h3>
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
      {billingList?.length > 0 && (
        <>
          <hr />
          <ul className="dp-items-result">
            {billingList.map((billingItem, index) => (
              <li key={`billing-${index}`}>
                <p className="dp-discount">{billingItem.label}</p>{' '}
                <span className={billingItem.strike ? 'dp-strike' : ''}>{billingItem.amount}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {subscriptionItems?.length > 0 && (
        <>
          <hr />
          <div className="dp-subscription-items">
            <ul>
              {subscriptionItems.map((subscriptionItem, index) => (
                <li key={`subscription-item-${index}`}>
                  <p>{subscriptionItem}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
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
