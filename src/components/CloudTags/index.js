import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// CloudTags component
export const RemoveButton = ({ removeTag }) => (
  <button type="button" onClick={removeTag} className="dp-button dp-remove-tag">
    <i className="ms-icon icon-close" />
  </button>
);
RemoveButton.propTypes = {
  removeTag: PropTypes.func.isRequired,
};

// CloudTags component
export const CloudTags = ({ tags, remove, disabled, render }) => (
  <ul
    className={classNames({
      'dp-cloud-tags': true,
      'dp-overlay': disabled,
    })}
    aria-label="cloud tags"
  >
    {tags.map((tag, index) => (
      <li key={`tag-${index}`}>
        <span
          className={classNames({
            'dp-tag': true,
            'dp-recently-add': index + 1 === tags.length,
          })}
        >
          {tag}
          <RemoveButton removeTag={() => remove(index)} />
        </span>
      </li>
    ))}
    {render && <li>{render()}</li>}
  </ul>
);
CloudTags.propTypes = {
  tags: PropTypes.array.isRequired,
  remove: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  render: PropTypes.func,
};
