import PropTypes from 'prop-types';
import { numberFormatOptions } from '../../../../doppler-types';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';

export const DeletePacksButton = ({ handleRemove, hasPlan }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <fieldset className="dp-buttons-packs">
      {hasPlan && (
        <button
          type="button"
          className={`dp-button button-medium primary-grey`}
          onClick={handleRemove}
        >
          {_('ai_agent_selection.remove_from_cart_button')}
        </button>
      )}
    </fieldset>
  );
};

export const Packs = ({ packs, handleRemove, hasPlan }) => {
  return (
    <>
      <div className="awa-form dp-packs">
        {packs.map((pack, index) => (
          <div className="dp-rowflex dp-container" key={index}>
            <div className="col-lg-9">
              <p className="dp-mark">
                <FormattedMessage
                  id="ai_agent_selection.plan_of_eco_ai_with_plural"
                  values={{
                    packs: pack.quantity,
                  }}
                />
              </p>
            </div>
            <div className="col-lg-3 text-align--right">
              <h3>
                <FormattedMessage
                  id={`landing_selection.pack_price`}
                  values={{
                    price: (
                      <FormattedNumber value={pack.fee} {...numberFormatOptions} />
                    ),
                  }}
                />
              </h3>
            </div>
          </div>
        ))}
        <DeletePacksButton
          handleRemove={handleRemove}
          hasPlan={hasPlan}
        />
      </div>
    </>
  );
};

Packs.propTypes = {
  packs: PropTypes.arrayOf(
    PropTypes.shape({
      planId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      description: PropTypes.string,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.node]),
      unitPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.node]),
    }),
  ).isRequired,
};
