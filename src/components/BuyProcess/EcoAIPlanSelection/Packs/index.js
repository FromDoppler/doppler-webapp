import PropTypes from 'prop-types';
import { numberFormatOptions } from '../../../../doppler-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';

export const Packs = ({ packs }) => {
  return (
    <>
      <div className="awa-form dp-packs">
        {packs.map((pack, index) => (
          <div className="dp-rowflex dp-container p-b-24 p-t-12" key={index}>
            <div className="col-lg-9">
              <p className="dp-mark">
                <FormattedMessage
                  id="eco_ai_selection.plan_of_eco_ai_with_plural"
                  values={{
                    packs: pack.quantity,
                  }}
                />
              </p>
            </div>
            <div className="col-lg-3 text-align--right">
              <h3>
                <FormattedMessage
                  id={`eco_ai_selection.plan_price`}
                  values={{
                    price: <FormattedNumber value={pack.fee} {...numberFormatOptions} />,
                  }}
                />
              </h3>
            </div>
          </div>
        ))}
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
