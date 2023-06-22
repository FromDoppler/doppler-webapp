import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const HIDE_MARKS_FROM = 9;

export const Tickmarks = ({ id, items = [], handleChange, hideMarksFrom = HIDE_MARKS_FROM }) => {
  const getHandleChange = (itemIndex) => () => handleChange({ target: { value: itemIndex } });
  const { length: amountItems } = items;

  return (
    <ul id={id} className="datalist">
      {amountItems >= hideMarksFrom
        ? items.map((value, index) => (
            <li key={index} onClick={getHandleChange(index)}>
              {[0, amountItems - 1].includes(index) && <strong>{value}</strong>}
            </li>
          ))
        : items.map((value, index) => (
            <li key={index} onClick={getHandleChange(index)}>
              {[0, amountItems - 1].includes(index) ? <strong>{value}</strong> : value}
            </li>
          ))}
    </ul>
  );
};

export const Slider = ({
  items,
  selectedItemIndex = 0,
  handleChange,
  hideMarksFrom = HIDE_MARKS_FROM,
  callbackMaxTop,
  moreOptions,
}) => {
  const amountItems = items.length;

  const onChange = (e) => {
    handleChange(e);
    callbackMaxTop && parseInt(e.target.value) === items.length - 1 && callbackMaxTop(e);
  };

  return (
    <>
      <div className="dp-calc-slider progress-bar">
        <input
          className="range-slider"
          type="range"
          disabled={amountItems === 0}
          min={0}
          max={amountItems > 1 ? amountItems - 1 : 1}
          step={1}
          value={selectedItemIndex}
          onChange={onChange}
          list="item-list"
        />
        <div
          className="progress-anchor"
          style={
            amountItems > 1
              ? { width: `${(selectedItemIndex * 100) / (amountItems - 1)}%` }
              : { width: '100%' }
          }
        />
        <Tickmarks
          id="item-list"
          items={items}
          handleChange={onChange}
          hideMarksFrom={hideMarksFrom}
        />
      </div>
      {moreOptions && (
        <Link to={moreOptions.relativePath}>
          <span>{moreOptions.label}</span>
        </Link>
      )}
    </>
  );
};

Slider.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedItemIndex: PropTypes.number,
  handleChange: PropTypes.func.isRequired,
  callbackMaxTop: PropTypes.func,
  moreOptions: PropTypes.shape({
    label: PropTypes.string,
    relativePath: PropTypes.string,
  }),
  hideMarksFrom: PropTypes.number,
};
