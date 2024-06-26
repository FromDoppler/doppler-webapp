import PropTypes from 'prop-types';
import { numberFormatOptions } from '../../../../doppler-types';
import { FormattedNumber, useIntl } from 'react-intl';
import { thousandSeparatorNumber } from '../../../../utils';

export const SelectedPlanChat = ({ selectedPlan, item, addItem, removeItem }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { fee, conversationsQty, agents, channels } = selectedPlan;

  return (
    <div className="dp-boxgrey">
      <div className="dp-price">
        <h2>
          US$ <FormattedNumber value={fee} {...numberFormatOptions} />
          */mes
        </h2>
        <span>
          Antes <span className="dp-line-through">US$ 41,00*</span>
        </span>
      </div>
      <h3>Plan Conversaciones*</h3>
      <ul className="dp-items-plan">
        <li>
          <div className="dp-icon-lock">
            <span className="dp-ico--ok"></span>{' '}
            <span>
              Incluye hasta {thousandSeparatorNumber(intl.defaultLocale, conversationsQty)}{' '}
              conversaciones
            </span>
          </div>
        </li>
        <li>
          <div className="dp-icon-lock">
            <span className="dp-ico--ok"></span> <span>{agents} Agente</span>
          </div>
        </li>
        <li>
          <div className="dp-icon-lock">
            <span className="dp-ico--ok"></span> <span>{channels} Canales</span>
          </div>
        </li>
      </ul>
      <hr className="dp-h-divider m-t-12 m-b-12" />
      <button
        type="button"
        className="dp-button button-medium ctaTertiary"
        onClick={item?.planId !== selectedPlan?.planId ? () => addItem(selectedPlan) : removeItem}
      >
        {item?.planId === selectedPlan?.planId ? (
          <span>Remover del carrito</span>
        ) : (
          <span>Agregar al carrito</span>
        )}
      </button>
    </div>
  );
};

SelectedPlanChat.propTypes = {
  selectedPlan: PropTypes.shape({
    fee: PropTypes.number.isRequired,
    conversationsQty: PropTypes.number.isRequired,
    agents: PropTypes.number.isRequired,
    channels: PropTypes.number.isRequired,
  }),
  item: PropTypes.shape({
    fee: PropTypes.number.isRequired,
    conversationsQty: PropTypes.number.isRequired,
    agents: PropTypes.number.isRequired,
    channels: PropTypes.number.isRequired,
  }),
  addItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
};
