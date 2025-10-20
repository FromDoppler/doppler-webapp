import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { compactNumber } from '../../../utils';

export const HIDE_MARKS_FROM = 9;

export const Tickmarks = ({
  id,
  items = [],
  handleChange,
  hideMarksFrom = HIDE_MARKS_FROM,
  moreOptionTickmark,
}) => {
  const getHandleChange = (itemIndex) => () => handleChange({ target: { value: itemIndex } });
  const { length: amountItems } = items;

  var strongItems = [];
  if (!moreOptionTickmark) {
    strongItems = [0, amountItems - 1];
  } else {
    strongItems = [0];
  }

  return (
    <ul id={id} className="datalist">
      {amountItems >= hideMarksFrom
        ? items.map((value, index) => (
            <li key={index} onClick={getHandleChange(index)} style={{ width: '13px' }}>
              {strongItems.includes(index) && <strong>{compactNumber(value)}</strong>}
            </li>
          ))
        : items.map((value, index) => (
            <li key={index} onClick={getHandleChange(index)} style={{ width: '13px' }}>
              {strongItems.includes(index) ? (
                <strong>{compactNumber(value)}</strong>
              ) : (
                compactNumber(value)
              )}
            </li>
          ))}
      {moreOptionTickmark && (
        <li key={items.length} onClick={getHandleChange(amountItems)} style={{ width: '13px' }}>
          <strong>{moreOptionTickmark.label}</strong>
        </li>
      )}
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
  labelQuantity,
  moreOptionTickmark,
  handleOnClick,
}) => {
  const amountItems = items.length;

  const onChange = (e) => {
    handleChange(e);
    callbackMaxTop && parseInt(e.target.value) === items.length - 1 && callbackMaxTop(e);
  };

  const onClick = (e) => {
    handleOnClick(e);
  };

  return (
    <>
      <div className="dp-purchase-process--slider progress-bar">
        <h3>{labelQuantity}</h3>
        <Tickmarks
          id="item-list"
          items={items}
          handleChange={onChange}
          hideMarksFrom={hideMarksFrom}
          moreOptionTickmark={moreOptionTickmark}
        />
        <input
          className="range-slider"
          type="range"
          disabled={amountItems === 0}
          min={0}
          max={amountItems > 1 ? (moreOptionTickmark ? amountItems : amountItems - 1) : 1}
          step={1}
          value={selectedItemIndex}
          onChange={onChange}
          list="item-list"
          onClick={onClick}
        />
        <div
          className="progress-anchor"
          style={
            amountItems > 1
              ? {
                  width: `${
                    (selectedItemIndex * 100) / (moreOptionTickmark ? amountItems : amountItems - 1)
                  }%`,
                }
              : { width: '100%' }
          }
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
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  selectedItemIndex: PropTypes.number,
  handleChange: PropTypes.func.isRequired,
  callbackMaxTop: PropTypes.func,
  moreOptions: PropTypes.shape({
    label: PropTypes.string,
    relativePath: PropTypes.string,
  }),
  hideMarksFrom: PropTypes.number,
};
