import PropTypes from 'prop-types';

export const ItemCart = ({
  name,
  featureList,
  handleRemove,
  billing = null,
  item,
  isRemovible = true,
}) => {
  return (
    <div>
      {name}
      <ul>
        {featureList.map((featureItem, index) => (
          <li key={`feature-${index}`}>{featureItem}</li>
        ))}
      </ul>
      {isRemovible && (
        <button type="button" aria-label="remove" onClick={() => handleRemove(item)}></button>
      )}
      {billing && (
        <div>
          <span>{billing.label}</span>
          <span>{billing.amount}</span>
        </div>
      )}
    </div>
  );
};

ItemCart.propTypes = {
  name: PropTypes.string.isRequired,
  featureList: PropTypes.arrayOf(PropTypes.string).isRequired,
  isRemovible: PropTypes.bool.isRequired,
  handleRemove: PropTypes.func,
  billing: PropTypes.shape({
    label: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
  }),
  item: PropTypes.object.isRequired,
};
